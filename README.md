## Deviant Code Crypt Key Services

When building micro serviced based architectures and using encryption, the challenge is, for each service, protecting the keys. In an organization whjere there are many developers why put the protection of those keys in each individual's hands. Each dev may protect their keys in a different way. This increases your risk factors. This Crypt service is an API which is meant to handle that for you. This serivce standardizes your encryption methods, hashes, Jason Web Tokens, Symetric Encrpytion and PKI Asymetric Encryption. Now you protect one set of keys. YOu configure BCRYPT, ARGON, or other crypt algorithms in one location and no longer worry if some service is doing it outside of your standards.

## Installation

Clone this repo

```bash 
    git clone https://github.com/deviantdevops/api.crypt.git api.crypt 
```

Add npm packages

```bash 
    yarn install
```


## Setup

After you have installed all of the package dependencies, you need to generate your encryption certificates. The base path for these certificates will be the root of this application.


```bash 
    npm run genkeys
```

This command will generate your keys and create 3 new files. These keys must be protected. It is recommended NOT to leave them in any directory which is accessible by a web server. Best would be a container secret or /root, /var, 
/usr instead. You will alos want to create a backup of these keys. The loss of these keys will result in your failure to recover your system.

To change the path or name of these keys, you may change config.js respectively.

@TODO: If you plan to replace your keys in the future, you will need to write a script that decrypts using the old key and re-encrypts with the new key.

IMPORTANT:  You will be issued a random password for your private key. You must save this also as alone your private key can do nothing becuase it is password secured.


## Asynchronus Encryption

This encryption type uses your Public key to encrypt a payload. ONLY your Private key can decrypt the contents. THe Public key is safe to dsitribute among other applications if need be.


### /asyncencrypt

**method:** post
**params:** 
    * payload: (String) the data to be encrypted
    

### /asyncdecrypt

**method:** post
**params:** 
    * payload: (String) the data to be encrypted
    * password: (String) when you created your pki, you were given a password. Send this.




## Synchronus Encryption

This method will use a password to encrpyt and decrpyt a string payload. Similar to an APP_KEY a symetric-key was created for you using the keygen command. That will be the password.



### /encrypt

**method:** post
**params:** 
    * payload: (String) the data to be encrypted


### /decrypt

**method:** post
**params:** 
    * payload: (String) the data to be encrypted
 
 

## Hashing

This system uses hash methods via SHA3 or SHA384 to generate a fixed hash of a string payload. To create a crypto graphic hash for elements such as a password, it uses BCRYPT.


### /hash

Creates a SHA3 hash of a string. Best used for checking integrity or detecting changes. Should NOT be used to hash passwords.

**method:** post
**params:** 
    * payload: (String) the data to be encrypted


### /shash

This method will create a SHA3 hash of a string payload and then also sign that hash with your private key. This allows to validating the shash against the system to prove that you are the one that created the signature.

**method:** post
**params:** 
    * payload: (String) the data to be encrypted


### /bcrypt

Best used to hash elements such as passwords.

**method:** post
**params:** 
    * payload: (String) the data to be encrypted

### /compare

Used to check those passwords against a known bcrypt hash.

**method:** post
**params:** 
    * plaintext: (String) the data to be encrypted
    * hash: the known bcrypt hash of the password string



## JSON Web Tokens

The tokens are encoded payloads used for many purposes. They are ideal for issuing OAUTH user access tokens, client keys and other security element that require an identity to grant a requested resource. Any JWT can be decoded using any JWT package, however, this takes it one step further. There are use cases where you do not want your key read by every system. This system will alos encrypt the JWT payload using your Public Key certificate, ensuring that every key not only matches ONLY your system but can only be read by your system, thus making this key distributable and transmittable, however you like.


#### /generate

This route will generate and return a valid key.
example return:
```bash
{
    "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJoaWJiZXJkayIsInRva2VuX2lkIjoiNXB2Mm44MTlpa25maWlheTgiLCJrZXlfdHlwZSI6ImRldmVsb3BtZW50In0sImlhdCI6MTYxODI4NzM1NSwiZXhwIjoxNjE4NTQ2NTU1LCJhdWQiOiJBdXRoaWZ5IiwiaXNzIjoiQXV0aGlmeSBARGV2T3BzIn0.hWb3240JGqGAhvFfWhOiTDJGk8dBJI1fNoM3S8m3QuT-x3EEDmJrYeN__LMK6FPHNuTQje225n1AmxFat1Gm2",
    "created_at": "Dienstag, 13. April 2021",
    "expires_at": "Freitag, 16. April 2021",
    "issuedBy": "Deviant.Code @DevOps"
}
```

**method:** post
**params:** 
    * payload : a json object of any information which you want to be included in this encrypted key. example: User object, user token. When this key is "validated" this payload will be returned as a decoded object.
    * ttl:  Time to Live. default is 3 days. A ttl parameter when provided will create an expiring key. This expiration is also validated and will return a expired notification. example: 1000, "2 days", "10h", "7d" 

#### /validate

**method:** post
**params:** 
    * token: the JWT token to be validated. Returns 401 with message for all invalid, expired or corrupted tokens or returns a 200 with a decoded payload:

example return:
```bash
{
    "decoded": {
        "data": {
            "name": "Mr Smith",
            "token_id": "5pv2n819iknfiiay8",
            "key_type": "development"
        },
        "iat": 1618287355,
        "exp": 1618546555,
        "aud": "Deviant.Code",
        "iss": "Deviant.Code @DevOps"
    },
    "created_at": "Dienstag, 13. April 2021",
    "expires_at": "Freitag, 16. April 2021"
}
```
