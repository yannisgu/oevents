#!/usr/bin/env node
var deployd = require('deployd');

console.log(process.env.PORT || 45201)

var server = deployd({
    port: process.env.PORT || 45201,
    env: process.env.NODE_ENV || 'development',
    db: {
        host: "paulo.mongohq.com",
        port: 10006,
        name: "oevents_test",
        credentials: {
            username: "oevents_test",
            password: "oevents_test"
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