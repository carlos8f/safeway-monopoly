var MongoClient = require('mongodb').MongoClient;

module.exports = function (app) {
  return {
    mount: function (cb) {
      MongoClient.connect(app.conf.mongo_url, function (err, db) {
        if (err) return cb(err);
        app.db = db;
        cb();
      });
    },
    unmount: function (cb) {
      app.db && app.db.close();
      cb();
    }
  };
};
