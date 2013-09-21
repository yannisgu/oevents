var solvBase = "http://www.o-l.ch/cgi-bin/";
out.log("Begining SOLV Import.");
 
var startYear = new Date().getFullYear();
var endYear = startYear + 2;
for(var year =  startYear; year <= endYear; year++)
{
    importYear(year);
}
    
function importYear(year) {
    var url = solvBase + "fixtures?kind=&csv=1&year=" + year;
    
    request({encoding: null, url: url}, function(error, response, buffer) {
        var body = "";
        for (var ii = 0; ii < buffer.length; ii++) {
                body += String.fromCharCode( buffer.readUInt8(ii));
        }
        if (!error && response.statusCode == 200) {
            
            var lines = body.split("\n");
            var titles  = null;
            for(var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if(i === 0) {
                    titles = line.split(";");
                }
                else {
                    if(line.trim()) {
                        importLine(line, titles);
                    }
                }
                
            }
        } 
        else { 
            out.error('Error while importing SOLV ' + error);
        }
        
    });
    
    
}

function importLine(line, titles) {
    var values = line.split(";");
    var object = {};
                    for(var j = 0; j < values.length; j++) {
                        object[titles[j]] = values[j];
                    }
                    
                    var map = {
                        event_name: "name",
                        unique_id: "idSource",
                        event_link: "url",
                        club: "organiser",
                        location: "eventCenter"
                        
                    }
                    
                    
                    for(var k in map){
                        object[map[k]] = object[k];
                        delete object[k];
                    }
                    object.source = 'solv'
                    
                    if(object.date) {
                        object.date = Date.parse(object.date);
                    }
                    if(object.type) {
                        var type = object.type;
                        if(["NOM","LOM", "MOM", "SPM", "SOM", "TOM"].indexOf(object.type) >= 0) {
                            // Championship
                            object.classification = 1;
                        }
                        if(type == "**A") {
                            // National
                            object.classification = 2
                        }
                        
                        if(!object.classification){
                            // Default regional
                            //TODO could be special event e.g. SOW 
                            object.classification = 3;
                        }
                    }
                    if( object.coord_x && object.coord_y) {
                        object.eventCenterLatitude = CHtoWGSlat( object.coord_x, object.coord_y);
                        object.eventCenterLongitude = CHtoWGSlng(object.coord_x,object.coord_y);
                    }
                    
                    object.day = object.day_night == "day";
                    object.night = object.day_night == "night";
                    
                    if(object.last_modification) {
                        object.lastModification = Date.parse(object.last_modification);
                    }
                    
                    dpd.events.get({source: 'solv', idSource: object.idSource}, function(result, err) {
                        if(result.length > 0) {
                            dpd.events.put(result[0].id, object, function(res, err){
                                out.log("updated::: " + res.name)
                            
                            })
                        }
                        else {
                            dpd.events.post(object, function(res, err) {
                                out.log("added::: " + res.name)
                            });
                            
                        }
                    })
}

// Convert WGS lat/long (∞ dec) to CH y
function WGStoCHy(lat, lng) {

  // Converts degrees dec to sex
  lat = DECtoSEX(lat);
  lng = DECtoSEX(lng);

  // Converts degrees to seconds (sex)
  lat = DEGtoSEC(lat);
  lng = DEGtoSEC(lng);
  
  // Axiliary values (% Bern)
  var lat_aux = (lat - 169028.66)/10000;
  var lng_aux = (lng - 26782.5)/10000;
  
  // Process Y
  y = 600072.37 
     + 211455.93 * lng_aux 
     -  10938.51 * lng_aux * lat_aux
     -      0.36 * lng_aux * Math.pow(lat_aux,2)
     -     44.54 * Math.pow(lng_aux,3);
     
  return y;
}

// Convert WGS lat/long (∞ dec) to CH x
function WGStoCHx(lat, lng) {
  
  // Converts degrees dec to sex
  lat = DECtoSEX(lat);
  lng = DECtoSEX(lng);
  
  // Converts degrees to seconds (sex)
  lat = DEGtoSEC(lat);
  lng = DEGtoSEC(lng);
  
  // Axiliary values (% Bern)
  var lat_aux = (lat - 169028.66)/10000;
  var lng_aux = (lng - 26782.5)/10000;

  // Process X
  x = 200147.07
     + 308807.95 * lat_aux 
     +   3745.25 * Math.pow(lng_aux,2)
     +     76.63 * Math.pow(lat_aux,2)
     -    194.56 * Math.pow(lng_aux,2) * lat_aux
     +    119.79 * Math.pow(lat_aux,3);
 
  return x;
  
}


// Convert CH y/x to WGS lat
function CHtoWGSlat(y, x) {

  // Converts militar to civil and  to unit = 1000km
  // Axiliary values (% Bern)
  var y_aux = (y - 600000)/1000000;
  var x_aux = (x - 200000)/1000000;
  
  // Process lat
  lat = 16.9023892
       +  3.238272 * x_aux
       -  0.270978 * Math.pow(y_aux,2)
       -  0.002528 * Math.pow(x_aux,2)
       -  0.0447   * Math.pow(y_aux,2) * x_aux
       -  0.0140   * Math.pow(x_aux,3);
    
  // Unit 10000" to 1 " and converts seconds to degrees (dec)
  lat = lat * 100/36;
  
  return lat;
  
}

// Convert CH y/x to WGS long
function CHtoWGSlng(y, x) {

  // Converts militar to civil and  to unit = 1000km
  // Axiliary values (% Bern)
  var y_aux = (y - 600000)/1000000;
  var x_aux = (x - 200000)/1000000;
  
  // Process long
  lng = 2.6779094
        + 4.728982 * y_aux
        + 0.791484 * y_aux * x_aux
        + 0.1306   * y_aux * Math.pow(x_aux,2)
        - 0.0436   * Math.pow(y_aux,3);
     
  // Unit 10000" to 1 " and converts seconds to degrees (dec)
  lng = lng * 100/36;
     
  return lng;
  
}


// Convert SEX DMS angle to DEC
function SEXtoDEC(angle) {

  // Extract DMS
  var deg = parseInt( angle );
  var min = parseInt( (angle-deg)*100 );
  var sec = (((angle-deg)*100) - min) * 100;
  
  // Result in degrees sex (dd.mmss)
  return deg + (sec/60 + min)/60;
  
}

// Convert DEC angle to SEX DMS
function DECtoSEX(angle) {

  // Extract DMS
  var deg = parseInt( angle );
  var min = parseInt( (angle-deg)*60 );
  var sec =  (((angle-deg)*60)-min)*60;   

  // Result in degrees sex (dd.mmss)
  return deg + min/100 + sec/10000;
  
}

// Convert Degrees angle to seconds
function DEGtoSEC(angle) {

  // Extract DMS
  var deg = parseInt( angle );
  var min = parseInt( (angle-deg)*100 );
  var sec = (((angle-deg)*100) - min) * 100;
  
  // Avoid rounding problems with seconds=0
  var parts = String(angle).split(".");
  if (parts.length == 2 && parts[1].length == 2) {
    min = Number(parts[1]);
    sec = 0;
  }
  
  // Result in degrees sex (dd.mmss)
  return sec + min*60 + deg*3600;
  
}