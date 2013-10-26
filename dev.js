#!/usr/bin/env node
var deployd = require('deployd');


var server = deployd({
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    db: {
        host: "paulo.mongohq.com",
        port: 10013,
        name: "oevents",
        credentials: {
            username: "oevents",
            password: "0events1"
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