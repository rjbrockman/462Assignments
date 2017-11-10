
// BASIC SETUP

var express = require("express");
var	http = require("http");
var	app;
var port = process.env.port || 3000;

var counterID = 1;  // start IDs at 1
var userStore = []; // stores the user objects

app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('../public'));
// Only necessary if serving a static file at the root route.
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// START SERVER

http.createServer(app).listen(port);
console.log("Server Running on "+port+".\nLaunch http://localhost:"+port);

// searchID - will search an array and return the
// index if found, if not found return -1
function searchID(ArrayToSearch, key, value) { // 1 2
	for (var i = 0; i < ArrayToSearch.length; i++) {
		if (ArrayToSearch[i][key] === parseInt(value)) {
			return i; // found it 
		}
	}
	return -1; // not found
}

// POST route - /users

app.post('/users/', function (req, res) {
	// get body from URL
	var userObj = req.body;
	
	// check for empty object 
	if (Object.keys(userObj).length === 0) {
		console.log("POST: Body is empty");
		res.status(400).json("Error: Data required for this operation");
		return;
	}

	tempUserIdObj = {};  // temp userid object
	tempUserObj = {};    // temp name and email object

	tempUserIdJsonObj = {};
	tempUserIdJsonObj.id = counterID; 	// set global userid counter
		
	// build userid object
	tempUserObj.name = userObj.user.name;
	tempUserObj.email = userObj.user.email;
	
	tempUserIdObj.id = counterID;
	tempUserIdObj.user = tempUserObj;

	tempUserIdObj.reminderCounter = 1; // initialize reminderCounter and place into object

	counterID++; 	// increment for next userid
	userStore.push(tempUserIdObj); 	// add to end of array

	// console.log output
	userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
	// send status 200 and just userid object
	res.status(200).json(tempUserIdJsonObj);
});


// POST route - /users/{userid}/reminders


app.post('/users/:userid/reminders', function (req, res) {
	
	var reminderObj = req.body;
	var userid = req.params.userid;

	// check for empty object 
	if (Object.keys(reminderObj).length === 0) {
		console.log("POST: Body is empty");
		res.status(400).send("Error: Data required for this operation");
		return;
	}

	// valid userid check
	var index = searchID(userStore, "id", userid);
	if (index === -1) {
		console.log("ID " + userid + " was not found");
		res.status(404).send("Sorry, userid " + userid + " was not found");
		return;
	} else {
		console.log("Found userid = " + (index+1) + ":"); 
		userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
	}	

	// build reminder object
	tempReminder = {}; // empty temp object
	tempReminderIdObj = {}; // empty temp object for send

	tempReminderIdObj.reminderid = userStore[index].reminderCounter; // get current counter
		
	tempReminder.reminderID = userStore[index].reminderCounter;  // insert counter
	tempReminder.title = reminderObj.reminder.title;             // insert title
	tempReminder.description = reminderObj.reminder.description; // insert description
	reminderTimeStamp = new Date();
	tempReminder.created =  reminderTimeStamp.toISOString();    // insert timestamp
	
	// check if reminder array exists (i.e. first reminder)	
	if (typeof userStore[index].reminder === "undefined"){
		// does not exist, create array and add to index 0
		userStore[index].reminder = [];
		userStore[index].reminder[0] = tempReminder;
	} else { 
		// array exists, push to array
		userStore[index].reminder.push(tempReminder);
	}

	userStore[index].reminderCounter++; // increment ReminderCounter

	// console.log output
	userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
	// send status 200 and id
	res.status(200).json(tempReminderIdObj);
});


// GET route - /users/{userId}

app.get('/users/:userid', function (req, res) {
	// get userid	
	var userid = req.params.userid;

	// check for valid userid
	var index = searchID(userStore, "id", userid);
	if (index === -1) {
		console.log("userId " + userid + " was not found");
		res.status(404).send("Sorry, userid " + userid + " was not found");
	} else {
		console.log("Found userid = " + (index+1) + "\n"); 
		for (var key in userStore[index].user){
			if (userStore[index].user.hasOwnProperty(key)){
				console.log(userStore[index].user[key]);
			}
		}
	// send response and user object
	res.status(200).json(userStore[index].user);
	}
});


// GET route - /users/{userId}/reminders

app.get('/users/:userid/reminders', function (req, res) {
	// get userid	
	var userid = req.params.userid;

	// valid userid check
	var index = searchID(userStore, "id", userid);
	if (index === -1) {
		res.status(404).send("Sorry, userid " + userid + " was not found");
		return;
	} else {
		console.log("Found userid = " + (index +1) + ":"); 
		userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
	}

	// check if user has reminders
	
	if (typeof userStore[index].reminder === "undefined"){
		res.status(404).send("Sorry, userid " + userid + " has no reminders");
		return;
	} else {
		console.log("ID " + userid + " has reminders");
	}

	// pack the array and remove the "reminderID" key from all the reminders
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

app.get('/users/:userid/reminders/:reminderid', function (req, res) {
	// get userid and reminderid from URL	
	var userid = req.params.userid;
	var reminderid = req.params.reminderid;

	// check for valid userid
	var index = searchID(userStore, "id", userid);
	if (index === -1) {
		console.log("ID " + userid + " was not found");
		res.status(404).send("Sorry, userid " + userid + " was not found");
		return;
	} else {
		console.log("Found userid = " + userid + ":"); 
		userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
	}

	// Does the user have any reminders?
	if (typeof userStore[index].reminder === "undefined"){
		console.log("ID " + userid + " has no reminders");
		res.status(404).send("Sorry, userid " + userid + " has no reminders");
		return;
	} else {
		console.log("ID " + userid + " has reminders");
	}

	// Verify if reminderID is valid
	var reminderIndex = searchID(userStore[index].reminder, "reminderID", reminderid);
	if (reminderIndex === -1) {
		console.log("reminderID " + reminderid + " was not found");
		res.status(404).send("Sorry, reminderid " + reminderid + " was not found");
		return;
	} else {
		console.log("Found reminderid = " + reminderid + ", for userid = " + userid + ":"); 
		
	}

	// build new  object without the "reminderID" key
	reminderObj = {};
	reminderObj.title = userStore[index].reminder[reminderIndex].title;
	reminderObj.description = userStore[index].reminder[reminderIndex].description;
	reminderObj.created = userStore[index].reminder[reminderIndex].created;

	// send 200 + reminderObj
	res.status(200).json(reminderObj);
});


// DELETE route - /users/{userid}

app.delete('/users/:userid', function (req, res) {
	
	var userid = req.params.userid;
	
	// Verify if userid is valid
	var index = searchID(userStore, "id", userid);
	if (index === -1) {
		console.log("ID " + userid + " was not found");
		res.status(404).send("Sorry, userid " + userid + " was not found");
		return;
	} else {
		console.log("Found userid = " + (index+1) + ":"); 
		userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
		console.log("\nDeleting userid " + userid + " and all reminders");
	}

	// delete userid from userStore array
	userStore.splice(index, 1);

	// send status 204 No Content
	res.sendStatus(204);
});


// DELETE route - /users/{userid}/reminders

app.delete('/users/:userid/reminders', function (req, res) {
	
	var userid = req.params.userid;
	
	// Is userid valid?
	var index = searchID(userStore, "id", userid);
	
	if (index === -1) {
		console.log("ID " + userid + " was not found");
		res.status(404).send("Sorry, userid " + userid + " was not found");
		return;
	} else {
		console.log("Found userid = " + (index+1) + ":"); 
		userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
	}

	// check if user has reminders
	if (typeof userStore[index].reminder === "undefined"){
		console.log("ID " + userid + " has no reminders");
		res.sendStatus(204);
		return;
	} else {
		console.log("ID " + userid + " has reminders");
		}

	// clear reminder array and reset reminderCounter
	userStore[index].reminder = [];
	userStore[index].reminderCounter = 1;

	// send status 204 No Content
	res.sendStatus(204);
});


// DELETE route - /users/{userid}/reminders/{reminderid}

app.delete('/users/:userid/reminders/:reminderid', function (req, res) {
	
	var userid = req.params.userid;
	var reminderid = req.params.reminderid;
	
	// check for valid userid
	var index = searchID(userStore, "id", userid);
	if (index === -1) {
		console.log("ID " + userid + " was not found");
		//userid was not found send a 404
		res.status(404).send("Sorry, userid " + userid + " was not found");
		
		return;
	} else {
		console.log("Found userid = " + (index+1) + ":"); 
		userStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
	}

	// Does user have reminders?
	if (typeof userStore[index].reminder === "undefined"){
		console.log("ID " + userid + " has no reminders");
		res.status(404).send("Sorry, userid " + userid + " was not found");
		
		return;
	} else {
		console.log("ID " + userid + " has reminders");
	}

	// reminder check
	var reminderIndex = searchID(userStore[index].reminder, "reminderID", reminderid);
	if (reminderIndex === -1) {
		console.log("reminderID " + reminderid + " was not found");
		res.status(404).send("Sorry, reminderid " + reminderid + " was not found");
		return;
	} else {
		console.log("Deleting reminderid = " + reminderid + ", for userid = " + userid + ":"); 
	}

	// remove the reminder from the array	
	userStore[index].reminder.splice(reminderIndex, 1);

	// send status 204 No Content
	res.sendStatus(204);
});


app.use(function(req, res) {
	
	console.log('*** Sending HTTP Error - 404 for request: ' + req.url);
	res.status(404).send('Sorry, Can not find that resource.');
});
