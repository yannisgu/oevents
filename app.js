#!/usr/bin/env node
var deployd = require('deployd');


var server = deployd({
    port: process.env.PORT || 12334,
    env: process.env.NODE_ENV || 'production',
    db: {
        host: "localhost",
        name:  "oevents_old",
        options: {auto_reconnect: true}
    }
});

server.listen();

server.on('listening', function() {
    console.log("Server is listening");
});

server.on('error', function(err) {
    console.log("error at " + new Date());
    console.error(err);
    process.nextTick(function() { // Give the server a chance to return an error
        process.exit();
    });
});
