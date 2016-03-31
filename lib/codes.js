module.exports = function (app) {
  return {
    mount: function (cb) {
      app.codes = app.table('codes');
      cb();
    }
  };
};
