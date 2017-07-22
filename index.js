/* jshint asi:true */

var axios = require('axios');

var MLab = function (options) {
  if (!(this instanceof MLab)) {
    return new MLab(options);
  }
  this._key = options.key
  this._host = options.host || 'https://api.mlab.com'
  this._uri = options.uri || '/api'
  this._version = options.version || '1'
  this._database = options.database
  this._basePath = [this._host, this._uri, this._version].join('/')
  var ap = {
    baseURL: this._host,
    timeout: options.timeout || 10000,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  }
  ap.onUploadProgress = options.onUploadProgress
  ap.onDownloadProgress = options.onDownloadProgress
  this.axios = axios.create(ap)
  this.listDatabases()
    .then(function (response) {
      if (response.message === 'Please provide a valid API key.') throw new Error('Invalid API key');
    })
    .catch(function (error) {
      throw new Error('No DB connection');
    })
}

    MLab.prototype.setDatabase = function (database) {
      if ((typeof database !== 'string') || (database === undefined)) {
        throw new Error('database name is required');
      }
      this._database = database
    }

    MLab.prototype.makePath = function (uri, params) {
      realUri = Array.isArray(uri) ? uri.join('/') : uri;
      return [params && params.path ? params.path : this._basePath, 'databases', params && params.database ? params.database : this._database, realUri].join('/')
    };

    MLab.prototype.specialCharChanger = function (str) {
      return str.replace(/ /gi, '%20').replace(/"/gi, '%22');
    };

    MLab.prototype.meters2radians = function (meters) {
      return meters / 6378100
    };

    MLab.prototype.doParams = function (params) {
      var ap = { apiKey: this._key }
      if (params.query) ap.q = JSON.stringify(params.query)
      if (params.count) ap.c = true
      if (params.fields) ap.f = JSON.stringify(params.fields)
      if (params.findOne) ap.fo = true
      if (params.sort) ap.s = JSON.stringify(params.sort)
      if (params.skip) ap.sk = params.skip
      if (params.limit) ap.l = params.limit
      if (params.all) ap.m = true
      if (params.upsert) ap.u = true
      return ap
    }

    MLab.prototype.listDatabases = function () {
      return this.axios.get(this._basePath + '/databases', {
        params: { apiKey: this._key }
      })
    };

    MLab.prototype.listCollections = function (database) {
      return this.axios.get(this.makePath('collections', { database: database }), {
        params: { apiKey: this._key }
      })
    };

    MLab.prototype.listDocuments = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      return this.axios.get(this.makePath(['collections', options.collection], { database: options.database }), {
        params: this.doParams(options)
      })
    };

    MLab.prototype.insertDocuments = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      if (!Array.isArray(options.data) || (options.data === undefined))
        throw new Error('data is required');

      return this.axios.post(this.makePath(['collections', options.collection], { database: options.database }), options.data, {
        params: { apiKey: this._key }
      })
    };

    MLab.prototype.updateDocuments = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      if (options.data === undefined)
        throw new Error('data is required');

      return this.axios.put(this.makePath(['collections', options.collection], { database: options.database }), { "$set": options.data }, {
        params: this.doParams(options)
      })
    };

    MLab.prototype.deleteDocuments = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      return this.axios.put(this.makePath(['collections', options.collection], { database: options.database }), options.data || [], {
        params: this.doParams(options)
      })
    };

    MLab.prototype.viewDocument = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      if (typeof options.id !== 'string' || options.id === null) throw new Error('document id is required');

      return this.axios.get(this.makePath(['collections', options.collection, options.id], { database: options.database }), {
        params: { apiKey: this._key }
      })
    };

    MLab.prototype.insertDocument = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      if (options.data === null) throw new Error('document id is required');

      return this.axios.post(this.makePath(['collections', options.collection], { database: options.database }), options.data, {
        params: { apiKey: this._key }
      })
    };

    MLab.prototype.updateDocument = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      if (typeof options.id !== 'string' || options.id === null) throw new Error('document id is required');

      if (options.data === null) throw new Error('document id is required');

      return this.axios.put(this.makePath(['collections', options.collection, options.id], { database: options.database }), options.data, {
        params: { apiKey: this._key }
      })
    };

    MLab.prototype.deleteDocument = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      if (typeof options.id !== 'string' || options.id === null) throw new Error('document id is required');

      return this.axios.delete(this.makePath(['collections', options.collection, options.id], { database: options.database }), {
        params: { apiKey: this._key }
      })
    };

    MLab.prototype.runCommand = function (options) {
      if (options.commands === null) throw new Error('commands is required');

      return this.axios.post(this.makePath('runCommand', { database: options.database }), options.commands, {
        params: { apiKey: this._key }
      })

    };

    MLab.prototype.multiple = function (requests) {
      return axios.all(requests.map(function (request) {
        return this[request.func].apply(request.params)
      }))
    }





module.exports = MLab;