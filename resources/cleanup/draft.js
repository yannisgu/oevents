out.log("asdf")

var events = dpd.events.get({source: 'solv'}, function(res, error) {
    var ids = {};
    for(var i in res) {
        var event = res[i];
        var id = event.idSource;
        if(!ids[id]) {
            ids[id] = [event];
        }
        else {
            ids[id].push(event)
        }
    }
    
    for(var i in ids) {
        var es = ids[i];
        if(es.length > 1) {
            for(var j = 1; j < es.length; j++) {
                out.log(es[j])
                dpd.events.del(es[j].id, function(res, err) {
                    console.log(res)
                    console.log(err)
                })
            }
        }
    }
    
})

