#!/usr/bin/env node

var app = new (require('events').EventEmitter);
app.setMaxListeners(0);

app.conf = require('./conf.json');
app.system = require('./lib/system')(app);

app.system.invoke('mount', function () {
  require('./lib/main')(app);
});
