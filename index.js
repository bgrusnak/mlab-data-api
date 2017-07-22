'use strict';

import axios from 'axios'

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
  options.onUploadProgress && ap.onUploadProgress = options.onUploadProgress
  options.onDownloadProgress && ap.onDownloadProgress = options.onDownloadProgress
  this.axios = axios.create(ap)
  this.listDatabases()
    .then(function (response) {
      if (response.message === 'Please provide a valid API key.') throw new Error('Invalid API key');
    })
    .catch(function (error) {
      throw new Error('No DB connection');
    })
}

  (
  function () {
    this.setDatabase = function (database) {
      if ((typeof database !== 'string') || (database === undefined)) {
        throw new Error('database name is required');
      }
      this._database = database
    }

    this.makePath = function (uri, params) {
      realUri = Array.isArray(uri) ? [uri].join('/') : uri;
      return [params && params.path ? params.path : this._basePath, 'databases', params && params.database ? params.database : this._database, realUri].join('/')
    };

    this.specialCharChanger = function (str) {
      return str.replace(/ /gi, '%20').replace(/"/gi, '%22');
    };

    this.meters2radians = function (meters) {
      return meters / 6378100
    };

    this.doParams = function (params) {
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

    this.listDatabases = function () {
      return this.axios.get(this._basePath + '/databases', {
        params: { apiKey: this._key }
      })
    };

    this.listCollections = function (database) {
      return this.axios.get(this.makePath('collections', { database: database }), {
        params: { apiKey: this._key }
      })
    };

    this.listDocuments = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      return this.axios.get(this.makePath(['collections', options.collection], { database: options.database }), {
        params: this.doParams(options)
      })
    };

    this.insertDocuments = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      if ((typeof options.data !== 'array') || (options.data === undefined))
        throw new Error('data is required');

      return this.axios.post(this.makePath(['collections', options.collection], { database: options.database }), options.data, {
        params: { apiKey: this._key }
      })
    };

    this.updateDocuments = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      if (options.data === undefined)
        throw new Error('data is required');

      return this.axios.put(this.makePath(['collections', options.collection], { database: options.database }), { "$set": options.data }, {
        params: this.doParams(options)
      })
    };

    this.deleteDocuments = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      return this.axios.put(this.makePath(['collections', options.collection], { database: options.database }), options.data || [], {
        params: this.doParams(options)
      })
    };

    this.viewDocument = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      if (typeof options.id !== 'string' || options.id === null) throw new Error('document id is required');

      return this.axios.get(this.makePath(['collections', options.collection, options.id], { database: options.database }), {
        params: { apiKey: this._key }
      })
    };

    this.insertDocument = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      if (options.data === null) throw new Error('document id is required');

      return this.axios.post(this.makePath(['collections', options.collection], { database: options.database }), options.data, {
        params: { apiKey: this._key }
      })
    };

    this.updateDocument = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      if (typeof options.id !== 'string' || options.id === null) throw new Error('document id is required');

      if (options.data === null) throw new Error('document id is required');

      return this.axios.put(this.makePath(['collections', options.collection, options.id], { database: options.database }), options.data, {
        params: { apiKey: this._key }
      })
    };

    this.deleteDocument = function (options) {
      if ((typeof options.collection !== 'string') || (options.collection === undefined))
        throw new Error('collection is required');

      if (typeof options.id !== 'string' || options.id === null) throw new Error('document id is required');

      return this.axios.delete(this.makePath(['collections', options.collection, options.id], { database: options.database }), {
        params: { apiKey: this._key }
      })
    };

    this.runCommand = function (options) {
      if (options.commands === null) throw new Error('commands is required');

      return this.axios.post(this.makePath('runCommand', { database: options.database }), options.commands, {
        params: { apiKey: this._key }
      })

    };

    this.multiple = function (requests) {
      return axios.all(requests.map(function (request) {
        return this[request.func].apply(request.params)
      }))
    }

  }).call(MLab.prototype);





module.exports = MLab;