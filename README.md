# mlab-data-api

`mlab-data-api` is a node.js module designed to allow you to access [mLab's Data API](http://docs.mlab.com/data-api/#reference) with minimal overhead from browser-side.
Inspired by  [mongolab Data API](https://github.com/gamontalvo/mongolab-data-api)

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save mlab-data-api

If you don't have or don't want to use npm:

    $ cd ~/.node_modules
    $ git clone git://github.com/bgrusnak/mlab-data-api.git

## Usage

To require the library and initialize it 

```javascript
import MLab from 'mlab-data-api';
var mLab=MLab({
  key: '<YOUR MLAB API DATA KEY>',
  host:'https://api.mlab.com', //optional
  uri : '/api',//optional
  version :'1',//optional
  database:'your working database', //optional
  timeout : 10000 //optional
})

```

### Examples

**List databases**

```javascript
  mLab.listDatabases()
  .then(function (response) {
    console.log("got",response.data)
  })
  .catch(function (error) {
    console.log("error", error)
  })
```

**List collections**

```javascript
mLab.listCollections('exampledb')
  .then(function (response) {
    console.log("got",response.data)
  })
  .catch(function (error) {
    console.log("error", error)
  })
```

**List documents**

```javascript
var options = {
  database: 'exampledb', //optional
  collection: 'examples',
  query: { "key": "value" }
};

mLab.listDocuments(options)
  .then(function (response) {
    console.log("got",response.data)
  })
  .catch(function (error) {
    console.log("error", error)
  });
```
### Methods

All methods returns the Promises for further processing

#### `listDatabases`

Get the databases linked to the authenticated account

`.listDatabases()`

#### `listCollections`

Get the collections in the specified database

`.listCollections(database)` 

***Parameters:***

Name | Description | Type | Required |
-----|------------ |------|:----------:|
database| MongoDB database name | `String` | No |

#### `listDocuments`

Get the documents in the specified collection

`.listDocuments(options)`

***Options:***

Name | Description | Type | Required |
-----|------------ |------|:----------:|
database| MongoDB database name | `String` | No |
collection| MongoDB collection name | `String` | Yes |
query| restrict results by the specified JSON query | `Object` | No |
resultCount| return the result count for this query | `Boolean` | No |
fields| specify the set of fields to include or exclude in each document (1 - include; 0 - exclude) | `Object` | No |
findOne| return a single document from the result set (same as findOne() using the mongo shell) | `Boolean` | No |
order| specify the order in which to sort each specified field (1- ascending; -1 - descending) | `String` | No |
skip| number of documents to skip | `Number` | No |
limit| number of documents to return | `Number` | No |

#### `insertDocuments`

Create a new document in the specified collection

`.insertDocuments(options)`

***Options:***

Name | Description | Type | Required |
-----|------------ |------|:----------:|
database| MongoDB database name | `String` | No |
collection| MongoDB collection name | `String` | Yes |
data| a document or array of documents to be inserted| `Object/Array` | Yes |

#### `updateDocuments`

Update one or more documents in the specified collection

`.updateDocuments(options)`

***Options:***

Name | Description | Type | Required |
-----|------------ |------|:----------:|
database| MongoDB database name | `String` | No |
collection| MongoDB collection name | `String` | Yes |
data| replacement document or update modifiers | `Object` | Yes |
query| only update document(s) matching the specified JSON query | `Object` | No |
all| update all documents collection or query (if specified). By default only one document is modified | `Boolean` | No |
upsert| insert the document defined in the request body if none match the specified query | `Boolean` | No |

#### `deleteDocuments`

Replace the contents of some or all documents of a collection

`.deleteDocuments(options)`

***Options:***

Name | Description | Type | Required |
-----|------------ |------|:----------:|
database| MongoDB database name | `String` | No |
collection| MongoDB collection name | `String` | Yes |
query| only replace the document(s) matching the specified JSON query | `Object` | No |

#### `viewDocument`

View a single document

`.viewDocument(options)`

***Options:***

Name | Description | Type | Required |
-----|------------ |------|:----------:|
database| MongoDB database name | `String` | No |
collection| MongoDB collection name | `String` | Yes |
id| the document's id | - | Yes |

#### `updateDocument`

Update a single document

`.updateDocument(options)`

***Options:***

Name | Description | Type | Required |
-----|------------ |------|:----------:|
database| MongoDB database name | `String` | No |
collection| MongoDB collection name | `String` | Yes |
id| the document's id | - | Yes |
updateObject| object sent as replacement | `Object` | Yes |

#### `deleteDocument`

Delete a single document

`.deleteDocument(options)`

***Options:***

Name | Description | Type | Required |
-----|------------ |------|:----------:|
database| MongoDB database name | `String` | No |
collection| MongoDB collection name | `String` | Yes |
id| the document's id | - | Yes |

#### `runCommand`

Run a MongoDB database command

`.runCommand(options)`

***Options:***

Name | Description | Type | Required |
-----|------------ |------|:----------:|
database| MongoDB database name | `String` | No |
commands| MongoDB database command | `Object` | Yes |

### Notes
- **Creating a new collection**
  - As soon as you POST your first document you should see the collection appear
- **runCommands**
  - Only certain MongoDB commands are exposed through the Data API
  - The available commands are:
    - getLastError
    - getPrevError
    - ping
    - profile
    - repairDatabase
    - resetError
    - whatsmyuri
    - convertToCapped
    - distinct
    - findAndModify
    - geoNear
    - reIndex
    - collStats
    - dbStats
    
## Requirements

- [mLab](https://mlab.com/) account w/API key.
- node.js v7.10.0+ (7.10.0 is the version I used to develop this module.  I'm
  unsure if it will work with previous ones.  If you run a previous version, and
  it works, let me know and I'll update this)
- [axios](https://github.com/mzabriskie/axios) 0.16.2+

## Disclaimer

### [From the official mLab Data API documentation](http://docs.mlab.com/connecting/#methods):

> mLab databases can be accessed by your application code in two ways.

> The first method - the one we strongly recommend - is to connect using one of the MongoDB drivers (as described above). You do not need to use our API if you use the driver. In fact, using a driver provides better performance, better security, and more functionality.

> The second method is to connect via mLab’s RESTful Data API. Use this method only if you cannot connect using a MongoDB driver.

> ***Visit mLab's official documentation if you have any security concerns about using the Data API***

## Contributions

If you run into problems, have questions, or whatever else you can open an
issue on this repository. If you'd like to submit
a patch, shoot me a pull request.  I'd like to keep this module simple, so if
you want to add all kinds of crazy functionality - you might want to fork.
When in doubt, send a pull request - the worst that can happen is that I won't
merge it.

## Related

[mongolab-data-api](https://github.com/gamontalvo/mongolab-data-api): A node.js module for mLab (PKA MongoLab)

## License

[MIT](https://github.com/bgrusnak/mlab-data-api/blob/master/LICENSE) © Ilya Shlyakhovoy