#!/usr/bin/env node
var deployd = require('deployd');
console.log(process.env.OPENSHIFT_APP_NAME);


var server = deployd({
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'production',
    db: {
        host: "widmore.mongohq.com",
        port: 10010,
        name:  "oevents",
        credentials: {
            username: "yannisgu",
            password: process.env.MONGOHQ_PASSWORD
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