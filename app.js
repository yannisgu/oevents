#!/usr/bin/env node
var deployd = require('deployd');
console.log(process.env.OPENSHIFT_APP_NAME);


var server = deployd({
    port: process.env.OPENSHIFT_DIY_PORT || 5000,
    host: process.env.OPENSHIFT_DIY_IP,
    env: 'development',
    db: {
        host: process.env.OPENSHIFT_MONGODB_DB_HOST,
        port: parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT, 10),
        name:  process.env.OPENSHIFT_APP_NAME,
        credentials: {
            username: "admin",
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