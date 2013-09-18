var deployd = require('deployd');

           /*
var env = JSON.parse(process.env.VCAP_SERVICES);
 var mongo = env['mongodb-1.8'][0]['credentials'];
              */
var server = deployd({
  port: process.env.OPENSHIFT_NODEJS_PORT || 5000,
  env: 'production',
  db: {
    host: process.env.OPENSHIFT_MONGODB_DB_HOST,
    port: process.env.OPENSHIFT_MONGODB_DB_PORT,
    name:  process.env.OPENSHIFT_APP_NAME,
    credentials: {
      username: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
      password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD
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