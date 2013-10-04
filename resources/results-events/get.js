
var result = this;


dpd.events.get(result.eventId, function(event) {
  if(event) result.event = event;
});