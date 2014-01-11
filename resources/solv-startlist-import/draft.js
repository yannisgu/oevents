var solvBase = "http://o-l.ch/cgi-bin/results?type=start&event=Auswahl&year=";
var baseUrl = "http://o-l.ch/cgi-bin/";
var async = require('async');
var ent = require("ent");
out.log("Begining SOLV Import.");

importYear((new Date()).getFullYear());

function importYear(year) {
    var url;
    overviewUrl = solvBase + year;
    request({encoding: null, url: overviewUrl}, function(error, response, buffer) {
        if(error) {
           console.error("Error while importing startlist: " + overviewUrl + "\n" + error.message); 
        }
        else {
            var body = "";
            for (var ii = 0; ii < buffer.length; ii++) {
                    body += String.fromCharCode( buffer.readUInt8(ii));
            }
            
            var reg = /<input .*> <a href="(.*)">/g

            var startlists = new Array();
            while (result = reg.exec(body)) {
                startlists.push({url: result[1]});
            };
            
            for(var i in startlists) {
                importStartlist(startlists[i])
            }
        }
    })
}

function importStartlist(options) {
     var url = baseUrl + options.url + "&kind=all";
    request({encoding: null, url: url}, function (error, response, buffer) {
        var body = "";
        if (!buffer) {
            console.log("buffer 2 is null")
        }
        for (var ii = 0; ii < buffer.length; ii++) {
            body += String.fromCharCode(buffer.readUInt8(ii));
        }
        body = ent.decode(body)
        var categories = new Array();

        var reg = /<b>(?:<p><.p>)?(.*?)<.b>\s<pre>\( (\d*?.\d*?) km,\s*?(\d*?) m,  ?(\d*?) Po.\)(.*\s*)*?<.pre>/g

        while (res = reg.exec(body)) {
            categories.push({sourceCode: res[0], name: res[1]});

        }

        if (!categories) {
            console.log("categories is null")
        }
        if (categories.length == 0) {
            console.log("error reading result categories: " + options.url)
            //fn(null, null);
        }
        else {
            var idRegex = /<a href=..cgi-bin.fixtures.mode=show&unique_id=(.*)/g
            var idResult = idRegex.exec(body);
            if(idResult && idResult[1]) {
                eventSourceId = idResult[1];
                dpd.events.get({idSource: eventSourceId, source: 'solv'}, function(result, err){
                    
                    if(result && result.length > 0) { 
                        var event = result[0];
                        event.urlStartlist = url;
                        dpd.events.post(event, function(result, err) {
                    var eventId = event.id;
                    for(var i = 0; i < categories.length; i++) {
                        var category = categories[i];
                        var runnerRegex = /.* (.{22,}) (\d\d) .{20,}(\d?\d:\d\d)/g;
                        var runners = [];
                        while(runnerRes = runnerRegex.exec(category.sourceCode)){
                            var item = {name: runnerRes[1].trim(), yearOfBirth: runnerRes[2], startTime: runnerRes[3]};
                            item.eventId = eventId;
                            item.category = category.name;
                            runners.push(item)
                        }
                        async.mapSeries(runners, function (item, callback) {
                                    dpd.people.get({name: item.name, yearOfBirth: item.yearOfBirth}, function (result, err) {
                                        if (!result) {
                                            console.log("result 2 is null")
                                        }
                                        if (result.length <= 0) {
                                            dpd.people.post(item, function (result, err) {
                                                item.personId = result.id;
                                                callback(null, item)
                                            })
                                        }
                                        else {
                                            item.personId = result[0].id;
                                            callback(null, item);
                                        }
                                    })
                                },
                                function (error, results) {
                                    async.map(results, function(runner, callback) {
                                        dpd.startlists.get({personId: runner.personId, eventId: runner.eventId }, function(result, err) {
                                           if(result && result.length == 0) {
                                                dpd.startlists.post(runner, callback);
                                            }
                                        })
                                    }, function (error, results) {
                                        //categoryFn(null, "");

                                    })
                                });
                        }
                        })
                    
                    }
                })
            }
            
        }
        
    })
}