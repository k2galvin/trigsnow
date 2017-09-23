// index.js

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var token;

var request = require('request');
var pdRequest = request.defaults({
	headers: { 
		"Content-type": "application/json",
		"Accept": "application/vnd.pagerduty+json;version=2",
		"Authorization": "Token token=" + token
	}
});

var message_type_strings = {
	'incident.trigger': 'triggered',
	'incident.acknowledge': 'acknowledged',
	'incident.escalate': 'escalated',
	'incident.resolve': 'resolved',
	'incident.unacknowledge': 'unacknowledged',
	'incident.assign': 'reassigned',
	'incident.delegate': 'delegated'
};

var AWS = require('aws-sdk');


app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());

function getTriggerLE(token, triggerURL, callback) {
	var options = {
		headers: { 
			"Content-type": "application/json",
			"Accept": "application/vnd.pagerduty+json;version=2",
			"Authorization": "Token token=" + token
		},
		uri: triggerURL,
		method: "GET",
		qs: {
			"include[]": "channels"
		}
	}
	request(options, function(error, response, body) {
		if ( ! response.statusCode || response.statusCode < 200 || response.statusCode > 299 ) {
			console.log("Error getting trigger log entry: " + error + "\nResponse: " + JSON.stringify(response, null, 2) + "\nBody: " + JSON.stringify(body, null, 2));
		} else {
			var trigger = JSON.parse(body);
			callback(trigger);
		}
	});
}


//added kieran
function addTag(token, incident,tag){
	console.log("Calling addTag method");
	var body = {
		"incident": {
		    "type": "incident_reference",
		    "priority": {
		    "id": tag,
		    "type": "priority",
		    "self": "https://api.pagerduty.com/priorities/" + tag
			}
			}
		};
	var options = {
		headers: { 
			"Content-type": "application/json",
			"Accept": "application/vnd.pagerduty+json;version=2",
			"From":"kieran@pagerduty.com",
			"Authorization": "Token token=" + token
		},
		uri: "https://api.pagerduty.com/incidents/" + incident.id,
		//uri: "https://api.pagerduty.com/incidents/PG34N9G",
		method: "PUT",
		json: body
	};
	
	console.log("uri for post "+ "https://api.pagerduty.com/incidents/" + incident.id);
	console.log("options "+JSON.stringify(options));
	
	
	request(options, function(error, response, body) {
		if ( ! response.statusCode || response.statusCode < 200 || response.statusCode > 299 ) {
			console.log("Error adding priority: " + error + "\nResponse: " + JSON.stringify(response, null, 2) + "\nBody: " + JSON.stringify(body, null, 2));
		}
	});
}

app.post('/addtag_cxo', function(req, res) {
	//add the tag for CXO w/ID PWR861O
	
	console.log("calling add tag");
	var incident = req.body.messages[0].incident;
	var token = req.query.token;
	var event = req.body.messages[0].event;
	console.log("this is my incident "+incident.id);
	console.log("this is my event "+incident.trigger);
	
	//addTag(token, incident);
	

	//I don't need this extra code KG
	getTriggerLE(token, incident.first_trigger_log_entry.self, function(logEntry) {
		console.log("event type: " + event );
		
		if ( event == 'incident.trigger' ) {
			addTag(token, incident, "PWR861O");
		
		} else {
			res.end();
			return;
		}
		
		
	});

	res.end();
});

//end kieran

app.listen(app.get('port'), function() {
	console.log('AddTags listening on port', app.get('port'));
});
