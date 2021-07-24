/**
 * Generate PKI public & private keys used for asymetric encryption. This is REQUIRED
 * before using this Crypt service. Please keep in mind that everything will be 
 * encrypted using these certificates. The loss of these certificates is unrecoverable.
 * You will not be able to decrypt anything encrypted with this system.
 * 
 * *** PROTECTING THESE KEYS ***
 * Keys will be generated and stored in the root directory. it is recommended that you move those 
 * keys outside of the web directory to a location not accessible by the web, such as /root, /var, /usr
 * and then change the path in config.js to the new location.
 * 
 * If using a container system, put these keys either in a "secret" or elsewhere in the system and then 
 * mount these keys into the expected location. However Docker secrets would be the best solution.
 * 
 */
const CRYPT = require('./services/encrypt');
const { exec } = require('child_process');
const randomstring = require("randomstring");
const FS = require('fs');
const config = require('./config');

const PRIVATE_KEYFILE = global.config.KEY.PRIVATE;
const PUBLIC_KEYFILE = global.config.KEY.PUBLIC;
const SYMETRIC_KEYFILE = global.config.KEY.SYMETRIC;

function genKey(password = null){
    return new Promise( (resolve, reject) => {
        let privateKey, publicKey;
        if(password === null){
          password = randomstring.generate(32)
        }
        exec(`openssl genrsa -aes256 -passout pass:${password} -out private-key.pem 4096`, (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            reject();
          }else{
  
            privateKey = FS.readFileSync(PRIVATE_KEYFILE, 'utf8')
  
            exec(`openssl rsa -passin pass:${password} -in private-key.pem -pubout -out public-key.pem`, async (error, stdout, stderr) => {
              if (error) {
                console.log(`error: ${error.message}`);
                reject();
              }else{
                publicKey = FS.readFileSync(PRIVATE_KEYFILE, 'utf8');
                let passenc = await CRYPT.encrypt(password);
                resolve({
                  "password": {
                    "plaintext" : password,
                    "encypted" : passenc,
                    "description": "This is the password to your private key. It is required to decrpyt your content. Depending on your application, it may be best to send the encrypted version"
                  }
                });
              }
            })
          }
        })
    });
}

function symKey(){
    return new Promise( (resolve, reject) => {
        let key = randomstring.generate(64);
        FS.writeFile(SYMETRIC_KEYFILE, key, function (err) {
            if (err) return console.log(err);
            resolve(`Your symetric encryption key has been generated at: ${SYMETRIC_KEYFILE}`)
        });
    });
}


;(async () => {

    let sym = await symKey();
    console.error(sym);
    console.error(`Your Private encryption key has been generated at: ${PRIVATE_KEYFILE}`);
    console.error(`Your Public encryption key has been generated at: ${PUBLIC_KEYFILE}`);
    let pki = await genKey();
    console.error(pki);
    
})()