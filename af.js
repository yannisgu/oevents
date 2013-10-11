#!/usr/bin/env node
var deployd = require('deployd');
console.log(process.env.OPENSHIFT_APP_NAME);


var server = deployd({
    port: process.VCAP_APP_PORT || 12334,
    env: process.env.NODE_ENV || 'production',
    db: {
        host: "ds049888.mongolab.com",
        port: 49888,
        name:  "oevents",
        credentials: {
            username: "oevents",
            password: process.env.MONGOHQ_PASSWORD
        },
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
    /*process.nextTick(function() { // Give the server a chance to return an error
        process.exit();
    });*/
});