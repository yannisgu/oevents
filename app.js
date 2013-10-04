#!/usr/bin/env node
var deployd = require('deployd');
console.log(process.env.OPENSHIFT_APP_NAME);


var server = deployd({
    port: process.env.OPENSHIFT_NODEJS_PORT || 5000,
    host: process.env.OPENSHIFT_NODEJS_IP,
    env: process.env.NODE_ENV,
    db: {
        host: "widmore.mongohq.com",
        port: 10010,
        name:  "oevents",
        credentials: {
            username: "yannisgu",
            password: process.env.MONGODB_PASSWORD
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