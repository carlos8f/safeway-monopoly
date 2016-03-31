module.exports = function (app) {
  return {
    mount: function (cb) {
      app.prizes = app.table('prizes');
      cb();
    }
  };
};
