var prompt = require('cli-prompt');

module.exports = function (app) {
  (function mainMenu () {
    console.log();
    prompt('main menu.\n\n1) enter code\n2) enter prize\n3) check prizes\n\nenter number: ', function (num) {
      console.log();
      switch (parseInt(num, 10)) {
        case 1:
          enterPrefix(mainMenu);
          break;
        case 2:
          enterPrize(mainMenu);
          break;
        case 3:
          checkPrizes(mainMenu);
          break;
        default:
          console.error('bad input!');
          mainMenu();
      }
    });
  })();

  var ticket_prefix = '';
  var added = 0;
  function enterPrefix (cb) {
    prompt('enter ticket prefix: ', function (prefix) {
      if (!prefix) return enterCode(cb);
      ticket_prefix = prefix.toUpperCase();
      (function enterCode () {
        prompt('enter code: ', function (code_id) {
          var code = {
            id: code_id.toUpperCase(),
            added: new Date().getTime(),
            ticket_prefix: ticket_prefix
          };
          app.codes.save(code.id, code, function (err, code) {
            if (err) {
              console.error(err);
              return enterCode(cb);
            }
            console.log('code addded!');
            console.log(JSON.stringify(code, null, 2));
            if (++added === 4) {
              added = 0;
              prompt('new prefix? ', function (new_prefix) {
                if (new_prefix) ticket_prefix = new_prefix.toUpperCase();
                enterCode();
              });
            }
            else enterCode();
          });
        });
      })();
    });
  }

  function checkPrizes (cb) {
    app.codes.select(function (err, results) {
      if (err) {
        console.error(err);
        return cb();
      }
      var codes = {};
      results.forEach(function (code) {
        codes[code.id] = code;
      });
      app.prizes.select({sort: {num_available: -1}}, function (err, results) {
        if (err) {
          console.error(err);
          return cb();
        }
        var has_any = false;
        var collected = 0;
        var total = 0;
        results.forEach(function (prize) {
          var has = true;
          var have = 0;
          prize.codes.forEach(function (code_id) {
            if (!codes[code_id]) has = false;
            else {
              have++;
              collected++;
            }
            total++;
          });
          console.log(prize.title + ' (' + prize.num_available + ' available)');
          console.log('    ' + have + '/' + prize.codes.length + ' collected');
          if (has) {
            console.log('\n          YOU WON!!!!!', prize);
            has_any = true;
          }
        });
        if (!has_any) console.log('\n          better luck next time...');
        console.log('          ' + collected + '/' + total + ' (' + Math.round(collected / total * 100) + '%) codes collected');
        cb();
      });
    });
  }

  function enterPrize (cb) {
    prompt.multi([
      {
        key: 'id',
        label: 'letter prefix'
      },
      {
        key: 'title',
        label: 'prize title',
        required: true
      },
      {
        key: 'num_available',
        label: '# prizes available'
      }
    ], function (prize) {
      prize.id = prize.id.toUpperCase();
      prize.num_available = parseInt(prize.num_available, 10);
      prize.codes = [];
      var code_num = 1;
      (function enterCode () {
        prompt('enter code #' + (code_num++) + ': ', function (code_id) {
          if (!code_id) return savePrize();
          code_id = code_id.toUpperCase();
          prize.codes.push(code_id);
          enterCode();
        });
      })();
      function savePrize () {
        app.prizes.save(prize.id, prize, function (err, prize) {
          if (err) {
            console.error(err);
            return enterCode(cb);
          }
          console.log('prize addded!');
          console.log(JSON.stringify(prize, null, 2));
          prompt('enter another one? (y): ', function (no) {
            if (!no) return enterPrize(cb);
            cb();
          });
        });
      }
    });
  }
};
