const uniqid = require('uniqid');
const JWT = require('jsonwebtoken');
const FS = require('fs');
const CRYPT = require('./encrypt');
const Base64 = require('js-base64');

const dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

module.exports = {

    generate: (payload) => {
        return new Promise( async (resolve, reject) => {
            FS.readFile(global.config.KEY.PRIVATE, 'utf8', function (err, secret) {
                if (err){
                    reject(err);
                    return;
                };
                let token = null;
                payload.token_id = uniqid();
                /**
                 * Requestee may set a custom expires at (express in milliseconds where 3000 = 3 seconds.)
                 * @type {{expiresIn: string, audience: string, issuer: string, algorithm: string}}
                 */
                let tokenParams = global.config.CERT.OPTIONS;
                if(payload.ttl !== undefined){
                    tokenParams.expiresIn = `${payload.ttl} days`;
                }

                token = JWT.sign({
                    data: payload,
                }, secret, tokenParams)

                let decoded = JWT.decode(token)
                var exp = new Date(decoded.exp * 1000);
                var exp_local = exp.toLocaleDateString('de-DE', dateOptions);
                var iat = new Date(decoded.iat * 1000);
                var iat_local = iat.toLocaleDateString('de-DE', dateOptions);

                //Encrypt the token so that the JWT can not be read
                CRYPT.encrypt(token)
                .then(enc_token => {
                    resolve({
                        "token": Base64.encode(enc_token),
                        "created_at": iat_local,
                        "expires_at": exp_local,
                        "issuedBy": decoded.iss
                    })
                })
                .catch(err => {
                    reject(err);
                });
                
                
            })
        })
    },

    validate: (token) => {
        return new Promise( async (resolve, reject) => {
            let denc_token = await CRYPT.decrypt(Base64.decode(token));
            FS.readFile(global.config.KEY.PRIVATE, 'utf8', function (err, secret) {
                if (err) {
                    reject("Error reading file");
                    return;
                };
                JWT.verify(denc_token, secret, global.config.CERT.OPTIONS,function (err, decoded) {
                    if(err){
                        console.log(err)
                        reject('INVALID: Not issued by this agency or is corrupted.');
                        return;
                    }
                    var iat = new Date(decoded.iat * 1000);
                    var iat_local = iat.toLocaleDateString('de-DE', dateOptions);
                    var exp = new Date(decoded.exp * 1000);
                    var exp_local = exp.toLocaleDateString('de-DE', dateOptions);
                    if(Date.now() > exp){
                        return res.status(401).send('INVALID: Token expired on '+ exp_local).end();
                    }
                    resolve({
                        "decoded": decoded,
                        "created_at": iat_local,
                        "expires_at": exp_local
                    });

                })
            });
        });
    },

    sign: (payload) => {
        return new Promise( async (resolve, reject) => {
            FS.readFile(global.config.KEY.PRIVATE, 'utf8', function (err, secret) {
                if (err) {
                    reject("Error reading file");
                    return;
                };
                payload.token_id = uniqid();
                payload.key_type = 'production';
                if(process.env.NODE_ENV !== 'production'){
                    payload.key_type = 'development'
                };
                let tokenParams = global.config.CERT.OPTIONS;
                //Set expires to never
                delete tokenParams.expiresIn;
                let token = JWT.sign({
                    data: payload,
                }, secret, tokenParams);

                resolve({"token": token});

            })
        })
    }
}