const NACL = require('tweetnacl')
const UTIL = require('tweetnacl-util');
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");


//https://github.com/dchest/tweetnacl-js
//https://github.com/dchest/tweetnacl-util-js

/**
 * BOX = a return of encrypted data
 */

class Nacl {

    constructor() {

    }

    create () {
        return new Promise( (resolve, reject) => {
            console.log('Creating a new key pair');
            let keys = {};
            let pair = {}
            try{
                pair = NACL.box.keyPair();
            }catch(err){
                throw new Error(err)
            }
            keys.public = UTIL.encodeBase64(pair.publicKey);
            keys.private = UTIL.encodeBase64(pair.secretKey);
            console.log(keys)
            resolve(keys);
        })   
    }

    decodePublicKey(key){
        try {
            var k = UTIL.decodeBase64(key);
            if (k.length != NACL.box.publicKeyLength) {
                this.error('Bad public key length: must be ' + NACL.box.publicKeyLength + ' bytes');
                return null;
            }
            return k;
        } catch(e) {
            this.error('Failed to decode public key from Base64');
            return null;
        }
    }

    decodeSecretKey(key){
        try {
            var k = UTIL.decodeBase64(key);
            if (k.length != NACL.box.secretKeyLength) {
                this.error('Bad secret key length: must be ' + NACL.box.secretKeyLength + ' bytes');
                return null;
            }
            return k;
        } catch(e) {
            this.error('Failed to decode secret key from Base64');
            return null;
        }
    }

    /**
     * When encrypting a payload, we want to async encrypt a message for a receiver.
     * We need the public key of the receiver, and we need the private key of the sender
     * Payload must be a string.
     * 
     * Returns an encrypted string that can be decrpted with the receivers private key
     */
    messageEncrypt(payload, receiver_public_key, sender_private_key){

        let nonce = NACL.randomBytes(NACL.secretbox.nonceLength);
        let key = this.decodePublicKey(receiver_public_key)
        let secret = this.decodeSecretKey(sender_private_key)
        let messageUint8 = UTIL.decodeUTF8(payload)

        let encrypted = NACL.box(messageUint8, nonce, key, secret);
        let encMessage = new Uint8Array(nonce.length + encrypted.length)
        encMessage.set(nonce);
        encMessage.set(encrypted, nonce.length);

        return UTIL.encodeBase64(encMessage);

    }
    /**
     * Decrypting a payload which was encrpted with messageEncrypt requires the 
     * sender's public key and the receiver's private key
     */
    messageDecrypt(emsg, receiver_private_key, sender_public_key){

        let msgDecoded = UTIL.decodeBase64(emsg)
        let nonce = msgDecoded.slice(0, NACL.box.nonceLength);
        let message = msgDecoded.slice(NACL.box.nonceLength, emsg.length);
        let key = this.decodeSecretKey(receiver_private_key)
        let secret = this.decodePublicKey(sender_public_key)
        let decrypted = NACL.box.open(message, nonce, secret, key)
        if (!decrypted) {
            throw new Error('Could not decrypt message');
          }
        return UTIL.encodeUTF8(decrypted);  
    }

    /**
     * We need to build a message that the user can decode and prove
     * they are in control of their Secret Key.
     * Generate fake Server Keys to use for signing
     * Generate random strings and encrypt to send to the user to decrypt
     * @param userObj
     * @returns {Promise<{serverPublicKey: string, message: Uint8Array, user: {unique: boolean, type: String | StringConstructor}, hash: *}>}
     */
    async generateLoginChallenge(userObj, socket){

        var serverKeys = NACL.box.keyPair();
        var userPublicKey = UTIL.decodeBase64(userObj.public_key);
        var nonce = NACL.randomBytes(NACL.secretbox.nonceLength);
        var randomBytes = randomstring.generate({
            length: 64,
            charset: 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ123456789'
        });
        var hash = await bcrypt.hash(randomBytes, 15);
        var greenMsg = UTIL.decodeUTF8(randomBytes);

        var message = NACL.box(greenMsg, nonce, userPublicKey, serverKeys.secretKey)
        var msgObject = {
            "user":userObj,
            "nonce":UTIL.encodeBase64(nonce),
            "serverPublicKey":UTIL.encodeBase64(serverKeys.publicKey),
            "hash":hash,
            "message":UTIL.encodeBase64(message)
        }

        console.log('Secrete Challenge: '+ randomBytes)

        socket.emit('challenge', msgObject)
    }

}

module.exports = Nacl;