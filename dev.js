#!/usr/bin/env node
var deployd = require('deployd');


var server = deployd({
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    db: {
        host: "widmore.mongohq.com",
        port: 10010,
        name:  "oevents_test2",
        credentials: {
            username: "oevents_test2",
            password: "oevents_test2"
        }
    }});

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