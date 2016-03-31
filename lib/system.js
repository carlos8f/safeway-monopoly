var async = require('async');

module.exports = function (app) {
  return {
    invoke: function (ev, cb) {
      async.eachSeries(app.conf.modules, function (p, done) {
        var mod = require('./' + p)(app);
        if (typeof mod[ev] === 'function') {
          mod[ev](function (err) {
            if (err) throw err;
            setImmediate(done);
          });
        }
        else setImmediate(done);
      }, cb);
    }
  };
};
