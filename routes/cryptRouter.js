/**
 * Generate NEW Keys
 * https://www.scottbrady91.com/OpenSSL/Creating-Elliptical-Curve-Keys-using-OpenSSL
 * openssl ecparam -name secp521r1 -genkey -noout -out private-key.pem
 * openssl ec -in private-key.pem -pubout -out public-key.pem
 */
var express = require('express');
var router = express.Router();
const Validate = require('validate.js');
const CRYPT = require('../services/encrypt');
const JWT = require('../services/jwt');


router.post('/asyncencrypt', function(req, res, next) {
    let params = req.body;
    let constraints = {
        "payload": {type: "string", presence: true}
    }
    Validate.async(params, constraints)
    .then(valid => {
        CRYPT.asynencrypt(params.payload)
        .then((result) => {
            return res.status(200).send(result).end();
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).end();
        });
    })
    .catch(err => {
        return res.status(400).send('Parameter "payload" must be of a String type.').end()
    });

});
/**
 * Using a Private Key Certificate like RSA2048, decrypt a hash into a string
 * returns the original string content.
 */
router.post('/asyncdecrypt', function(req, res, next) {
    let params = req.body;
    let constraints = {
        "payload": {type: "string", presence: true},
        "password": {type: "string"},
    }
    Validate.async(params, constraints)
    .then(valid => {
        CRYPT.asyndecrypt(params.payload, params.password)
        .then((result) => {
            return res.status(200).send(result).end();
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).end(err);
        });
    })
    .catch(err => {
        return res.status(400).send('Parameter "payload" must be of a String type.').end()
    });
});
/**
 * Using a password or APP_KEY encrypt a string
 * Returns a hash
 */
router.post('/encrypt', function(req, res, next) {
    let params = req.body;
    let constraints = {
        "payload": {type: "string", presence: true},
    }
    Validate.async(params, constraints)
    .then(valid => {
        let payload = params.payload;        
        CRYPT.encrypt(payload)
        .then(results => {
            return res.status(200).send(results).end();
        })
        .catch(err => {
            console.log('ENCRYPTION ERROR: ', err)
            return res.status(400).send('ENCRYPTION/DECRYPTION ERROR: ' + err).end();
        });
    })
    .catch(err => {
        return res.status(400).send('Parameter "payload" must be of a String type.').end()
    });
 
});
/**
 * Using a password or APP_KEY decrypt a hash
 * Returns a string
 */
router.post('/decrypt', function(req, res, next) {
    let params = req.body;
    let constraints = {
        "payload": {type: "string", presence: true},
    }
    Validate.async(params, constraints)
    .then(valid => {
        let payload = params.payload; 
        
        console.log('PAYLOAD', payload)
        CRYPT.decrypt(payload)
        .then(results => {
            return res.status(200).send(results).end();
        })
        .catch(err => {
            console.log('DECRYPTION ERROR: ', err)
            return res.status(400).send('ENCRYPTION/DECRYPTION ERROR: ' + err).end();
        });
    })
    .catch(err => {
        return res.status(400).send('Parameter "payload" must be of a String type.').end()
    });
});
/**
 * Returns the SHA384 Hash of a string
 */
router.post('/hash', function(req, res, next) {
    let params = req.body;

    let constraints = {
        "payload": {type: 'string', presence: true},
    }
    Validate.async(params, constraints)
    .then(valid => {
        CRYPT.hash(params.payload)
        .then(results => {
            return res.status(200).send(results).end();
        })
        .catch(err => {
            console.log('HASHING ERROR: ', err)
            return res.status(400).send('ENCRYPTION/DECRYPTION ERROR: ' + err).end();
        });
    })
    .catch(err => {
        console.log(err)
        return res.status(400).send('Parameter "payload" must be of a String type.').end()
    });
});

router.post('/shash', function(req, res, next) {
    let params = req.body;
    let constraints = {
        "payload": {type: "string", presence: true},
    }
    Validate.async(params, constraints)
    .then(valid => {
        let payload = params.payload;        
        CRYPT.hash(payload)
        .then(results => {
            JWT.sign(results)
            .then( shash => {
                return res.status(200).json(shash).end();
            })
            .catch(err => {
                console.log('JWT SIGNING ERROR', err);
                return res.status(400).send(err).end();
            }) 
        })
        .catch(err => {
            console.log('HASHING ERROR: ', err)
            return res.status(400).send('ENCRYPTION/DECRYPTION ERROR: ' + err).end();
        });
    })
    .catch(err => {
        return res.status(400).send('Parameter "payload" must be of a String type.').end()
    });
});

router.post('/bcrypt', function(req, res, next) {
    let params = req.body;
    let constraints = {
        "payload": {type: "string", presence: true},
    }
    Validate.async(params, constraints)
    .then(valid => {
        let payload = params.payload;        
        CRYPT.bcrypt(payload)
        .then(results => {
            return res.status(200).send(results).end();
        })
        .catch(err => {
            console.log('BCRYPT ERROR: ', err)
            return res.status(400).send('ENCRYPTION/DECRYPTION ERROR: ' + err).end();
        });
    })
    .catch(err => {
        return res.status(400).send('Parameter "payload" must be of a String type.').end()
    });
});

router.post('/compare', function(req, res, next) {
    let params = req.body;
    let constraints = {
        "plaintext": {type: "string", presence: true},
        "hash": {presence: true},
    }
    Validate.async(params, constraints)
    .then(valid => {      
        CRYPT.compare(params.plaintext, params.hash)
        .then(results => {
            return res.status(200).send(results).end();
        })
        .catch(err => {
            console.log('BCRYPT ERROR: ', err)
            return res.status(400).send('ENCRYPTION/DECRYPTION ERROR: ' + err).end();
        });
    })
    .catch(err => {
        return res.status(400).send('Parameter "payload" must be of a String type.').end()
    });
});

router.post('/generate', function(req, res, next) {
    let params = req.body;
    let constraints = {
        "payload": {presence: true},
        "ttl":{presence: true}
    }
    Validate.async(params, constraints)
        .then(valid => {
            JWT.generate(params)
            .then(results => {
                return res.status(200).send(results).end();
            })
            .catch(err => {
                console.log('JWT ERROR', err);
                return res.status(400).send(err).end();
            })
        })
        .catch(err => {
            return res.status(503).send(err).end()
        })
});

router.post('/validate', function(req, res, next) {
    console.log('CRYPT VALIDATOR')
    let params = req.body;
    let constraints = {
        "payload": {presence: true}
    }
    Validate.async(params, constraints)
        .then(valid => {
            JWT.validate(params.payload)
            .then( results => {
                console.log('CRYPT VALIDATOR RESULTS', results.decoded)
                return res.status(200).send(results).end();
            })
            .catch(err => {
                console.log('JWT ERROR', err);
                return res.status(400).send(err).end();
            })
        })
        .catch(err => {
            return res.status(400).send(err).end();
        })
});

router.post('/sign', function(req, res, next) {
    let params = req.body;
    let constraints = {
        "payload": {presence: true}
    }
    Validate.async(params, constraints)
        .then(valid => {
           JWT.sign(params.payload)
           .then( results => {
                return res.status(200).send(results).end();
            })
            .catch(err => {
                console.log('JWT ERROR', err);
                return res.status(400).send(err).end();
            })
        })
        .catch(err => {
            return res.status(400).send(err).end();
        })
});

router.post('/pki/gen', function(req, res, next) {
    let params = req.body;
    let constraints = {
  //      "payload": {presence: true}
    }
    Validate.async(params, constraints)
        .then(valid => {
            CRYPT.pkiGen()
            .then(keys => {
                return res.status(200).send(keys).end();
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send(err).end();
            })
        })
        .catch(err => {
            return res.status(400).send(err).end();
        })
});

router.post('/pki/encrypt', function(req, res, next) {
    let params = req.body;
    let constraints = {
        "payload": {presence: true},
        "public_key": {presence: true},
        "private_key": {presence: true},
    }
    Validate.async(params, constraints)
        .then(valid => {
            CRYPT.naclEncrypt(params.payload, params.public_key, params.private_key)
            .then(response => {
                return res.status(200).send(response).end();
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send(err).end();
            })
        })
        .catch(err => {
            return res.status(400).send(err).end();
        })
});


module.exports = router;