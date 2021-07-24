/**
 * Generate NEW Keys
 * https://www.scottbrady91.com/OpenSSL/Creating-Elliptical-Curve-Keys-using-OpenSSL
 * openssl ecparam -name secp521r1 -genkey -noout -out private-key.pem
 * openssl ec -in private-key.pem -pubout -out public-key.pem
 */
const config = require('../config');
const FS = require('fs')
const PRIVATE_KEYFILE = global.config.KEY.PRIVATE;
const PUBLIC_KEYFILE = global.config.KEY.PUBLIC;
const SYMETRIC_KEYFILE = global.config.KEY.SYMETRIC;
const CryptoJS = require("crypto-js");
const BCRYPT = require('bcrypt');
const { exec } = require('child_process');
const CRPYTO = require('crypto')
const randomstring = require("randomstring");

const NACL = require('../lib/nacl');

module.exports = {

  asynencrypt: (payload) => {
    return new Promise( (resolve, reject) => {
      let key = FS.readFileSync(PUBLIC_KEYFILE, 'utf8');
      let buffer = Buffer.from(payload, 'utf8');
      let out = CRPYTO.publicEncrypt(key, buffer)
      resolve( out.toString('base64') )
    })
    
  },

  asyndecrypt: (payload, password) => {
    return new Promise( (resolve, reject) => {
      let key = FS.readFileSync(PRIVATE_KEYFILE, 'utf8');
      let buffer = Buffer.from(payload, 'base64');

      let params = {
        key: key
      }
      if(password !== undefined){
        params.passphrase = password
      }

      let out = {};
      try{
        out = CRPYTO.privateDecrypt(params, buffer).toString('utf8')
      }catch(err){
        reject('Password incorrect')
        return;
      }
      resolve( out )
    })
    
  },

  encrypt: (plaintext) => {
     return new Promise((resolve, reject) => {
       FS.readFile(SYMETRIC_KEYFILE, 'utf8', function (err, secret) {
         if (err) {
           reject("Error getting app_key");
         };
         var ciphertext = CryptoJS.AES.encrypt(plaintext, secret).toString();
         resolve(ciphertext);
       })
     });
  },
 
  decrypt: (ciphertext) => {
     return new Promise((resolve, reject) => {
       FS.readFile(SYMETRIC_KEYFILE, 'utf8', function (err, secret) {
         if (err) {
           reject("Error getting app_key");
         };
         try{
            var bytes  = CryptoJS.AES.decrypt(ciphertext, secret);
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);
            resolve(plaintext);
         }catch(decryptError){
            console.log('DECRYPTION ERROR: ', decryptError)
            resolve(plaintext);
         }
         
       })
     });
  },
   /**
    * Returns a string hash of some plaintext. For example if you want to verify an email address
    * of a user, get their email address and create a hash of it. Then compare it with the
    * value saved in the user object/db.
    * @param plaintext
    * @returns {*}
    */
  hash: (plaintext) => {
     return new Promise((resolve, reject) => {
       let hash = CryptoJS.SHA3(plaintext, { outputLength: 384 }).toString();
       resolve(hash)
     });
  },
  /**
  * Returns a Bcrypt encrypted hash which can not be decrypted.
  * 2GHz Core
  * rounds=8 : ~40 hashes/sec
    rounds=9 : ~20 hashes/sec
    rounds=10: ~10 hashes/sec
    rounds=11: ~5  hashes/sec
    rounds=12: 2-3 hashes/sec
    rounds=13: ~1 sec/hash
    rounds=14: ~1.5 sec/hash
    rounds=15: ~3 sec/hash
    rounds=25: ~1 hour/hash
    rounds=31: 2-3 days/hash
  */
  bcrypt: (plaintext, saltRounds = 12) => {
     return new Promise(async (resolve, reject) => {
       BCRYPT.genSalt(saltRounds, function(err, salt) {
         if(err) throw(err)
         BCRYPT.hash(plaintext, salt, function(err, hash) {
             if(err) throw(err)
             resolve(hash)
         })
       })
     })
  },
   /**
    * A perfect example is checking a user password. Compare will accept a 
    * bcryt hash and a plaitext payload and see if they are the same,
    * as a bcryted hash can not be decrypted.
    */
  compare: (plaintext, hash) => {
    return new Promise(async (resolve, reject) => {
      BCRYPT.compare(plaintext, hash, function(err, result) {
        if(err){
          reject(err);
          return;
        }
        resolve(result);
      })
    })
  },
  /**
   * Generate PKI certs from TweetNACL
   */
  pkiGen: () => {
    return new Promise(async (resolve, reject) => {
      let svc = new NACL();
      svc.create()
      .then(keys => {
        resolve(keys)
      })
      .catch(err => {
        reject(err)
      })
    })
  },

  
  naclEncrypt: (payload, receiver_public_key, sender_private_key) => {
    return new Promise(async (resolve, reject) => {
      let svc = new NACL();
      let msg = svc.messageEncrypt(payload, receiver_public_key, sender_private_key)
      
        resolve(msg)
     
    })
  },

  naclDecrypt: (payload, receiver_public_key, sender_private_key) => {
    return new Promise(async (resolve, reject) => {
      let svc = new NACL();
      let msg = svc.messageEncrypt(payload, receiver_public_key, sender_private_key)
      
        resolve(msg)
      
    })
  },











  
 
 
 
 
 
 
   
}
 
