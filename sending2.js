var r      = require('rethinkdb');
var stdrpc = require('stdrpc');

// internal libs
var db     = require('./lib/db.js');
var config = require('./config.js');

const rpc = stdrpc("http://localhost:8232", {
        req: {
                auth: {
                        username: config.rpcuser,
                        password: config.rpcpass
                }
        }
});

async function findInputs() {
  var info = await rpc.getinfo();
  console.log(`Current Balance: ${info.balance}`);

  var inputs = await rpc.listunspent();
  if (inputs.length) {
    console.log(`Number of Inputs: ${inputs.length}`);

    console.log(`First Input Amount: ${inputs[0].amount}`);
    console.log(`First Input Address: ${inputs[0].address}`);

    return inputs[0].address;
  }
  else {
    console.log(`Number of Inputs: 0`);
    console.log(`Exiting...`);
    process.exit();
  }

  console.log(inputs);

}

findInputs().then(sendingAddress => {
  console.log('sendAddress');
});
