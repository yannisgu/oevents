var solvBase = "http://www.o-l.ch/cgi-bin/";
var resultsOld = solvBase + "abfrage?type=rang&event=Auswahl&year="
var resultsNew = solvBase + "results?type=rang&event=Auswahl&year="
var async = require('async');
var ent = require("ent");
var request = require("request")
out.log("Begining SOLV results import.");


var startYear = (new Date()).getFullYear();
var endYear = (new Date()).getFullYear();
for (var year = startYear; year <= endYear; year++) {
    importYear(year);
}


function importYear(year) {
    var url;
    if (year < 2008) {
        url = resultsOld + year;
    }
    else {
        url = resultsNew + year;
    }

    request({encoding: null, url: url}, function (error, response, buffer) {
        var body = "";
        for (var ii = 0; ii < buffer.length; ii++) {
            body += String.fromCharCode(buffer.readUInt8(ii));
        }
        body = ent.decode(body)
        if (!error && response.statusCode == 200) {
            var reg = /<input type=radio name=event value=".*?"> <a href="(.*?)">(.*)<\/a> (\d| )\d\. .{3,4} \d{4}(.*)/g

            var events = new Array();
            while (result = reg.exec(body)) {
                events.push({url: result[1], year: year, name: result[4].trim() || result[2]});
            }

            async.mapSeries(events, importResults, function (err, results) {
            });

        }
        else {
            out.error('Error while importing SOLV ' + error);
        }

    });


}

function importResults(options, fn) {
    var url = solvBase + options.url + "&kind=all";
    request({encoding: null, url: url}, function (error, response, buffer) {
        var body = "";
        for (var ii = 0; ii < buffer.length; ii++) {
            body += String.fromCharCode(buffer.readUInt8(ii));
        }
        body = ent.decode(body)
        var categories = new Array();

        var reg = /<b>(?:<p><.p>)?(.*?)<.b>\s<pre>\( ?(\d*?.\d*?) km,\s*?(\d*?) m,  ?(\d*?) Po.\)(.*\s*)*?<.pre>/g

        while (res = reg.exec(body)) {
            categories.push({sourceCode: res[0], name: res[1]});

        }

        if (categories.length == 0) {
            out.log("error reading result categories: " + options.url)
            fn(null, null);
        }
        else {
            dpd.events.get({source: 'solvResults', urlSource: url}, function (result, err) {
                var res;
                if (options.year < 2008) {
                    var regex = /<td valign=top>\s<pre>(.*)/g
                    var res = regex.exec(body);
                    var eventLine = res[1].replace(/(<b>|<\/b>|<\/a>|<a href=".*">)/g, "");
                    var regex;
                    regex = /(?:<b>)?(?:<a href=".*?">)?((?:[^ <]+\s)*(?:\S*[^ ,<] ))(?:<.a>)?(.*?) +((?:\S+ )*(?:[^\s,]+))? +(?:((?:\S+\s?)+), )?((?:\d| )\d)\.(.*)(\d\d\d\d)(?:<.b>)*/g
                    res = regex.exec(eventLine);
                }
                else {
                    regex = /<h2>(.*?)(?:<a href=".*?(?:(?:unique_id=)(\d*))?".*>.*)?<.h2>(?:\s.*){4}\s<tr><td .*?>(?:.*?)<.td><td .*?>(.*?)<.td><td .*?>(?:(.*),) *(\d?\d). *(\S*) *(\d\d\d\d)<.td>/g
                    res = regex.exec(body)
                }
                if (!res) {
                    out.error("error reading result page:" + options.url)
                    fn(null, null)
                }
                else {
                    if (err) {
                        out.log(err)
                    }
                    var obj = {};
                    if (result.length > 0) {
                        obj.id = result[0].id;
                    }
                    obj.urlSource = url;
                    obj.source = 'solvResults';
                    obj.name = options.name;
                    obj.map = res[3] ? res[3].trim() : null;
                    obj.eventCenter = res[4] ? res[4].trim() : null;
                    if (res[5] && res[6] && res[7]) {
                        obj.date = (new Date(res[7], getMonth(res[6]), res[5])).getTime()
                    }

                    dpd.events.post(obj, function (res, err) {
                        importResultsOneEvent(res.id, obj);
                    });

                    var originalId = res[2];
                    if(originalId) {
                        dpd.events.get({source : 'solv', idSource: originalId, urlResults: {'$exists': false}}, function(solvEvents, err) {
                            if(solvEvents.length > 0) {
                                var solvEvent = solvEvents[0];
                                solvEvent.urlResults = url;
                                dpd.events.post(solvEvent, function(){});
                            }
                        })
                    }

                }

            });

            function importResultsOneEvent(id, event) {
                var regex = /(?:(?:(\d+)\.)|(?:  )) (.{22}\w*?) (\d\d)?  (.{18,}) (.{19,}) (?:(?:(?:(\d?\d):)?(\d?\d):(\d\d))|.*)/g
                async.mapSeries(categories, function (category, categoryFn) {
                        dpd.results.get({eventId: id, category: category.name}, function (results, err) {
                            //console.log(event.name + category.name);

                            var currentItems = {};
                            for (var k = 0; k < results.length; k++) {
                                currentItems[results[k].name] = 1;
                            }
                            var items = [];
                            while (res = regex.exec(category.sourceCode)) {
                                var resultItem = {
                                    eventId: id,
                                    category: category.name,
                                    name: res[2].trim(),
                                    club: res[5] ? res[5].trim() : null,
                                    rank: res[1],
                                    yearOfBirth: res[3],
                                    eventName: event.name,
                                    date: event.date
                                }
                                if (!currentItems[resultItem.name]) {
                                    items.push(resultItem)
                                }
                            }

                            async.mapSeries(items, function (item, callback) {
                                dpd.people.get({name: item.name, yearOfBirth: item.yearOfBirth}, function (result, err) {
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

                                    async.map(results, dpd.results.post, function (error, results) {
                                        categoryFn(null, "");

                                    })
                                })


                        })
                    },
                    function (err, results) {
                        fn(null, options.name);
                    })
            }

        }
    });
}

var months = {
    "Jan.": 0,
    "Feb.": 1,
    "März": 2,
    "Apr.": 3,
    "Mai": 4,
    "Juni": 5,
    "Juli": 6,
    "Aug.": 7,
    "Sep.": 8,
    "Okt.": 9,
    "Nov.": 10,
    "Dez.": 11
};

function getMonth(monthString) {
    return months[monthString.trim()];
}

