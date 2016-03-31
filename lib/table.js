var sosa_mongo = require('sosa_mongo');

module.exports = function (app) {
  return {
    mount: function (cb) {
      app.table = sosa_mongo({db: app.db});
      cb();
    }
  };
};
