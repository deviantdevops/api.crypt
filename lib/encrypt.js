/**
 * This library will allow communication with the Encryption Services.
 *  
 */
const axios = require('axios');
module.exports = {
  
  encrypt: async (payload, headers = {}, server) => {
    return new Promise( (resolve, reject) => {
      if(typeof payload !== 'string'){
        payload = payload.toString();
      }

      if(server === undefined){
        server = 'http://localhost:7001';
      }

      axios({
        method: 'POST',
        url: `${server}/encrypt`,
        data: {"payload": payload},
        headers: headers
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })

    })

  },

  decrypt: async (payload, headers = {}, server) => {
    return new Promise( (resolve, reject) => {
      if(typeof payload !== 'string'){
        payload = payload.toString();
      }
      if(server === undefined){
        server = 'http://localhost:7001';
      }
      axios({
        method: 'POST',
        url: `${server}/decrypt`,
        data: {"payload": payload},
        headers: headers
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
    })
  },

  hash: async (payload, headers = {}, server) => {
    return new Promise( (resolve, reject) => {
      if(typeof payload !== 'string'){
        payload = payload.toString();
      }

      if(server === undefined){
        server = 'http://localhost:7001';
      }

      axios({
        method: 'POST',
        url: `${server}/hash`,
        data: {"payload": payload},
        headers: headers
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })

    })
  },

  shash: async (payload, headers = {}, server) => {
    return new Promise( (resolve, reject) => {
      if(typeof payload !== 'string'){
        payload = payload.toString();
      }

      if(server === undefined){
        server = 'http://localhost:7001';
      }

      axios({
        method: 'POST',
        url: `${server}/shash`,
        data: {"payload": payload},
        headers: headers
      })
      .then(response => {
        resolve(response.data.token)
      })
      .catch(err => {
        reject(err)
      })

    })
  }, 
  
  bcrypt: async (payload, headers = {}, server) => {
    return new Promise( (resolve, reject) => {
      if(typeof payload !== 'string'){
        payload = payload.toString();
      }

      if(server === undefined){
        server = 'http://localhost:7001';
      }

      axios({
        method: 'POST',
        url: `${server}/bcrypt`,
        data: {"payload": payload},
        headers: headers
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })

    })

  },

  compare: async (plaintext, hash, headers = {}, server) => {
    return new Promise( (resolve, reject) => {
      if(typeof plaintext !== 'string'){
        plaintext = plaintext.toString();
      }

      if(server === undefined){
        server = 'http://localhost:7001';
      }

      axios({
        method: 'POST',
        url: `${server}/compare`,
        data: {"plaintext": plaintext, "hash":hash},
        headers: headers
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })

    })

  },
    
  generate: async (payload, ttl, headers = {}, server) => {
    return new Promise( (resolve, reject) => {
      if(server === undefined){
        server = 'http://localhost:7001';
      }

      axios({
        method: 'POST',
        url: `${server}/generate`,
        data: {"payload": payload, "ttl": ttl},
        headers: headers
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })

    })

  },

  validate: async (payload, headers = {}, server) => {
    return new Promise( (resolve, reject) => {
      if(server === undefined){
        server = 'http://localhost:7001';
      }
      axios({
        method: 'POST',
        url: `${server}/validate`,
        data: {"payload": payload},
        headers: headers
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })

    })

  },

  sign: async (payload, headers = {}, server) => {
    return new Promise( (resolve, reject) => {
      if(server === undefined){
        server = 'http://localhost:7001';
      }

      axios({
        method: 'POST',
        url: `${server}/sign`,
        data: {"payload": payload},
        headers: headers
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })

    })

  },

}

