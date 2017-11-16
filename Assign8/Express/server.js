// Rich Brockman
// Assignment 8
// ITMD462

// ***************************************
// BASIC SETUP
// ***************************************

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json());


// read env variable DEBUG_MODE_ON, if not set
// then default it to false, no console output
if (typeof(process.env.DEBUG_MODE_ON) === 'undefined') {
	process.env.DEBUG_MODE_ON = false;
}
console.log('DEBUG_MODE_ON is set to: '+ process.env.DEBUG_MODE_ON);
var LOG = process.env.DEBUG_MODE_ON === 'true' ? console.log.bind(console) : function () {};

// Misc. variables
var counterID = 1;  // start IDs at 1
var userStore = []; // stores the user objects

// ***************************************
// START SERVER
// ***************************************

console.log('Server Running on port: '+port+''); 

// searchID - will search an array and return the
// index if found, if not found return -1
function searchID(ArrayToSearch, key, value) { // 1 2
	for (var i = 0; i < ArrayToSearch.length; i++) {
		LOG("inside: "+ ArrayToSearch.length);
		if (ArrayToSearch[i][key] === parseInt(value)) {
			return i; // found it 
		}
	}
	return -1; // not found
}

// ************************************************
// ROUTES
// ************************************************
// POST route - /users
// Testcase(s): Test01, Test15
// ************************************************

app.post('/users/', function (req, res) {
	// get body from URL
	var userObj = req.body;
	
	// check for empty object, send status 400 
	if (Object.keys(userObj).length === 0) {
		LOG('POST: Body is empty');
		LOG('Sending HTTP Error - 400 for request: ' + req.url);
		// send status 400, no data supplied
		res.status(400).json('Error: Data required for this operation');
		LOG('--> debug POST /users body contents check END \n');
		return;
	}

	var tempUserIdObj = {};  // temp userid object
	var tempUserObj = {};    // temp name and email object

	var tempUserIdJsonObj = {};
	tempUserIdJsonObj.id = counterID; 	// set global userid counter
		
	// build userid object
	tempUserObj.name = userObj.user.name;
	tempUserObj.email = userObj.user.email;
	
	tempUserIdObj.id = counterID;
	tempUserIdObj.user = tempUserObj;

	tempUserIdObj.reminderCounter = 1; // initialize reminderCounter and place into object

	counterID++; 	// increment for next userid
	userStore.push(tempUserIdObj); 	// add to end of array

	// LOG output
	//LOG('--> POST /users debug dump BEGIN');
	userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				LOG(key +':', eachUser[key]);
			}
		}
	});
	
	// send status 200 and just userid object
	res.status(200).json(tempUserIdJsonObj);
});


// POST route - /users/{userid}/reminders
// Testcase(s): Test02, Test16, Test17
// ************************************************

app.post('/users/:userid/reminders', function (req, res) {
	
	var reminderObj = req.body;
	var userid = req.params.userid;

	// check for empty object, send status 400 
	if (Object.keys(reminderObj).length === 0) {
		LOG('POST: Body is empty');
		LOG('ending HTTP Error - 400 for request: ' + req.url);
		// send status 400, no data supplied
		res.status(400).json('Error: Data required for this operation');
		return;
	}

	// check for valid userid
	var index = searchID(userStore, 'id', userid);
	if (index === -1) {
		LOG('ID ' + userid + ' was not found');
		LOG('Sending HTTP Error - 404 for request: ' + req.url);
		res.status(404).json('Sorry, userid ' + userid + ' was not found');
		LOG('--> POST /users/:userid/reminder POST check users END\n');
		return;
	} else {
		LOG('Found userid = ' + (index+1) + ':');
		userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				LOG(key + ':', eachUser[key]);
			}
		}
	});
		
	}	

	// build reminder object
	var tempReminder = {}; // empty temp object
	var tempReminderIdObj = {}; // empty temp object for send

	tempReminderIdObj.reminderid = userStore[index].reminderCounter; // get current counter
		
	tempReminder.reminderID = userStore[index].reminderCounter;  // insert counter
	tempReminder.title = reminderObj.reminder.title;             // insert title
	tempReminder.description = reminderObj.reminder.description; // insert description
	var reminderTimeStamp = new Date();
	tempReminder.created =  reminderTimeStamp.toISOString();    // insert timestamp
	
	// check if reminder array exists (i.e. first reminder)	
	if (typeof userStore[index].reminder === 'undefined'){
		// does not exist, create array and add to index 0
		userStore[index].reminder = [];
		userStore[index].reminder[0] = tempReminder;
	} else { 
		// array exists, push to array
		userStore[index].reminder.push(tempReminder);
	}

	userStore[index].reminderCounter++; // increment ReminderCounter

	// LOG output
	userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				LOG(key + ':', eachUser[key]);
			}
		}
	});
	
	// send status 200 and id
	res.status(200).json(tempReminderIdObj);
});

// GET route - /users/{userId}


app.get('/users/:userid',	function (req, res) {
	// get userid from URL	
	var userid = req.params.userid;

	// check for valid userid
	var index = searchID(userStore, 'id', userid);
	if (index === -1) {
		LOG('userId ' + userid + ' was not found');
		LOG('Sending HTTP Error - 404 for request: ' + req.url);
		res.status(404).json('Sorry, userid ' + userid + ' was not found');
	} else {
		LOG('Found userid = ' + (index+1) + '\n'); 
		for (var key in userStore[index].user){
			if (userStore[index].user.hasOwnProperty(key)){
				LOG(userStore[index].user[key]);
			}
		}
		
	// send response and user object
	res.status(200).json(userStore[index].user);
	}
});


// GET route - /users/{userId}/reminders
//
// Testcase(s): Test05, Test10, Test11
// ************************************************
app.get('/users/:userid/reminders', function (req, res) {
	// get userid from URL	
	var userid = req.params.userid;

	// check for valid userid
	var index = searchID(userStore, 'id', userid);
	if (index === -1) {
		LOG('ID ' + userid + ' was not found');
		LOG('Sending HTTP Error - 404 for request: ' + req.url);
		res.status(404).json('Sorry, userid ' + userid + ' was not found');
		
		return;
	} else {
		LOG('Found userid = ' + (index +1) + ':'); 
		userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				LOG(key +':', eachUser[key]);
			}
		}
	});
		
	}

	// check if user has reminders
	
	if (typeof userStore[index].reminder === 'undefined' ||  userStore[index].reminder.length < 1){
		LOG('ID '+ userid + ' has no reminders');
		LOG('Sending HTTP Error - 404 for request: ' + req.url);
		res.status(404).json('Sorry, userid ' + userid + ' has no reminders');
		
		return;
	} else {
		LOG('ID ' + userid +  ' has reminders');
		
	}

	// need to repack the array and remove the "reminderID" key from all the reminders
	var reminderArray = [];
	userStore[index].reminder.forEach(function (eachReminder) {
		// get each key except reminderID
		var reminderArrayObj = {};
		reminderArrayObj.title = eachReminder.title;
		reminderArrayObj.description = eachReminder.description;
		reminderArrayObj.created = eachReminder.created;
		
		reminderArray.push(reminderArrayObj);  // push to temp array
	});

	// send 200 and the modified reminder array
	res.status(200).json(reminderArray);
});


// GET route - /users/{userId}/reminders/{reminderID}
//
// Testcase(s): Test04, Test12, Test13, Test14
// ************************************************
app.get('/users/:userid/reminders/:reminderid', function (req, res) {
	// get userid and reminderid from URL	
	var userid = req.params.userid;
	var reminderid = req.params.reminderid;

	// check for valid userid
	var index = searchID(userStore, 'id', userid);
	if (index === -1) {
		LOG('ID ' + userid + ' was not found');
		LOG('Sending HTTP Error - 404 for request: ' + req.url);
		res.status(404).json('Sorry, userid ' + userid + ' was not found');
		return;
	} else {
		LOG('Found userid = ' + userid + ':'); 
		userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				LOG(key + ':', eachUser[key]);
			}
		}
	});
		
	}

	// check if user has any reminders
	if (typeof userStore[index].reminder === 'undefined' ||  userStore[index].reminder.length < 1){
		LOG('ID ' + userid + ' has no reminders');
		LOG('Sending HTTP Error - 404 for request: ' + req.url);
		res.status(404).json('Sorry, userid ' + userid + ' has no reminders');
		return;
	} else {
		LOG('ID ' + userid + ' has reminders');
		
	}

	// check for valid reminderID
	var reminderIndex = searchID(userStore[index].reminder, 'reminderID', reminderid);
	
	if (reminderIndex === -1) {
		LOG('reminderID ' + reminderid + ' was not found');
		LOG('Sending HTTP Error - 404 for request: ' + req.url);
		res.status(404).json('Sorry, reminderid ' + reminderid + ' was not found');
		
		return;
	} else {
		LOG('Found reminderid = ' + reminderid + ', for userid = ' + userid + ':'); 
		
	}

	// build new send object without the "reminderID" key
	var reminderObj = {};
	reminderObj.title = userStore[index].reminder[reminderIndex].title;
	reminderObj.description = userStore[index].reminder[reminderIndex].description;
	reminderObj.created = userStore[index].reminder[reminderIndex].created;

	// send 200 + reminderObj
	res.status(200).json(reminderObj);
});


// DELETE route - /users/{userid}
//
// Deletes the userid and all reminders
// ************************************************
app.delete('/users/:userid', function (req, res) {
	
	var userid = req.params.userid;
	
	// check for valid userid
	var index = searchID(userStore, 'id', userid);
	if (index === -1) {
		LOG('ID ' + userid + ' was not found');
		LOG('Sending HTTP Error - 404 for request: ' + req.url);
		res.status(404).json('Sorry, userid ' + userid + ' was not found');
		
		return;
	} else {
		LOG('Found userid = ' + (index+1) + ':'); 
		userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				LOG(key + ':', eachUser[key]);
			}
		}
	});
		LOG('\nDeleting userid ' + userid + ' and all reminders');
		
	}

	// delete userid from userStore array
	userStore.splice(index, 1);

	// send status 204 No Content
	res.sendStatus(204);
});


// DELETE route - /users/{userid}/reminders
//
// Deletes the all reminders for userid
// Testcase(s): Test07, Test19, Test20
// ************************************************
app.delete('/users/:userid/reminders', function (req, res) {
	
	var userid = req.params.userid;
	
	// check for valid userid
	var index = searchID(userStore, 'id', userid);
	
	if (index === -1) {
		LOG('ID ' + userid + ' was not found');
		LOG('Sending HTTP Error - 404 for request: ' + req.url);
		res.status(404).json('Sorry, userid ' + userid + ' was not found');
		
		return;
	} else {
		LOG('Found userid = ' + (index+1) + ':');
		userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				LOG(key + ':', eachUser[key]);
			}
		}
	});
		
	}

	// check if user has reminders
	
	if (typeof userStore[index].reminder === 'undefined'){
		LOG('ID ' + userid + ' has no reminders');
		LOG('Not an error, sending HTTP 204');
		res.sendStatus(204);
		
		return;
	} else {
		LOG('ID ' + userid + ' has reminders');
		LOG('Deleting all reminders associated with userid ' + userid);
		
	}

	// clear reminder array and reset reminderCounter
	userStore[index].reminder = [];
	userStore[index].reminderCounter = 1;

	// send status 204 No Content
	res.sendStatus(204);
});


// DELETE route - /users/{userid}/reminders/{reminderid}
//
// Testcase(s): Test08, Test21, Test22, Test23
// ************************************************
app.delete('/users/:userid/reminders/:reminderid', function (req, res) {
	
	var userid = req.params.userid;
	var reminderid = req.params.reminderid;
	
	// check for valid userid
	var index = searchID(userStore, 'id', userid);
	
	if (index === -1) {
		LOG('ID ' + userid + ' was not found');
		LOG('Sending HTTP Error - 404 for request: ' + req.url);
		res.status(404).json('Sorry, userid ' + userid + ' was not found');
		
		return;
	} else {
		LOG('Found userid = ' + (index+1) + ':');
		userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				LOG(key + ':', eachUser[key]);
			}
		}
	});
		
	}

	// check if user has reminders
	
	if (typeof userStore[index].reminder === 'undefined' ||  userStore[index].reminder.length < 1){
		LOG('ID ' + userid + ' has no reminders');
		LOG('Not an error, sending HTTP 204');
		LOG('Sending HTTP Error - 404 for request: ' + req.url);
		res.status(204).json('Sorry, userid ' + userid + ' was not found');
		
		return;
	} else {
		LOG('ID ' + userid + ' has reminders');
		
	}

	// check for reminder
	var reminderIndex = searchID(userStore[index].reminder, 'reminderID', reminderid);
	
	if (reminderIndex === -1) {
		LOG('reminderID ' + reminderid + ' was not found');
		LOG('Not an error, sending HTTP 204');
		LOG('Sending HTTP Error - 404 for request: ' + req.url);
		res.status(404).json('Sorry, reminderid ' + reminderid + ' was not found');
		
		return;
	} else {
		LOG('Found reminderid = ' + reminderid + ', for userid = ' + userid + ':');
		LOG('Deleting reminderid = ' + reminderid + ', for userid = ' + userid + ':'); 
		
	}

	// remove the reminder from the array	
	userStore[index].reminder.splice(reminderIndex, 1);

	// send status 204 No Content
	res.sendStatus(204);
});


app.use(function(req, res) {
	LOG('--- Bad Route begin ---');
	LOG('*** Sending HTTP Error - 404 for request: ' + req.url);
	LOG('--- Bad Route end ---\n');
	// send status 404, invalid route
	res.status(404).json('Sorry, Can not find that resource.');
});

// export for testing
module.exports = app.listen(port);