var deployd = require('deployd');


var env = JSON.parse(process.env.VCAP_SERVICES);
 var mongo = env['mongodb-1.8'][0]['credentials'];

var server = deployd({
  port: process.env.VCAP_APP_PORT || 5000,
  env: 'production',
  db: {
    host: mongo.hostname,
    port: mongo.port,
    name: mongo.db,
    credentials: {
      username: mongo.username,
      password: mongo.password
    }
  }
});

server.listen();

server.on('listening', function() {
  console.log("Server is listening");
});

server.on('error', function(err) {
  console.error(err);
  process.nextTick(function() { // Give the server a chance to return an error
    process.exit();
  });
});