/*
Rich Brockman
ITMD-462
Assignment 6
*/

var express = require('express'),
    http = require("http"),
    app;
port = 3000;
var counterID = 1;

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

http.createServer(app).listen(port);

var userrepository = new Array();
var objStore = [];



// Search function used to find the index for  app.get(s), app.post(s) and app.delete(s) routes
function Indexsearch(searchArray, key, value) {
    for (var i = 0; i < searchArray.length; i++) {
       
        if (searchArray[i][key] == parseInt(value)) {
            // Success, a match was found
            return i;
        }
    }
	// return a '-1' if no match was found in objStore for this id
    return -1;
}

//app.post route to populate the array of objects

app.post('/users/', function(req, res) {

    var objectuser = req.body;
    console.log("\nThe JSON.stringify(objectuser) is: \n\n" + JSON.stringify(objectuser) + "\n");
	
	if (Object.keys(objectuser).length === 0) {
		
		// send status 400, no data supplied
		res.status(400).send;
		
		return;
	}
	
    temporaryUserIdObj = {};  // temporary userid object
	temporaryUserObj ={};     // temporary name and email object
	
	temporaryUser = {};
    temporaryUser.id = counterID; // set ID in object
    var tempjson = JSON.stringify(temporaryUser);
    
	// build userid object
    temporaryUserObj.name = objectuser.user.name;
    temporaryUserObj.email = objectuser.user.email;
    
    temporaryUserIdObj.id = counterID;
    temporaryUserIdObj.user = temporaryUserObj;

    temporaryUserIdObj.reminderCounter = 1; // initialize reminderCounter and place into object

    counterID++;     // increment for next userid
    

    objStore.push(temporaryUserIdObj); // append to end of array
// console.log output
	objStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
	
    // Display the id.
     // send status 200 and just userid object
	res.status(200).send(tempjson);
	
});

//app.post route to populate the array of objects

app.post('/users/:userid/reminders', function(req, res) {

    var objReminder = req.body;
	var userid = req.params.userid;
	
    console.log("\nThe JSON.stringify(objectuser) is: \n\n" + JSON.stringify(objReminder) + "\n");
	// check for empty object, send status 400 
	if (Object.keys(objReminder).length === 0) {
		
		// send status 400, no data supplied
		res.status(400).send;
		
		return;
	}

	// check for valid userid
	var index = Indexsearch(objStore, "id", userid);
	
	if (index === -1) {
		res.status(404).send("Sorry, userid \"" + userid + "\" was not found");
		
		return;
	} else {
		console.log("Found userid = " + (index+1) + ":"); 
		objStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
		
	}
    temporaryReminder = {};  // empty temporary  object
	temporaryReminderIdObj = {};     // empty temporary object for send
	
	temporaryReminderIdObj.reminderid = objStore[index].reminderCounter; // get current counter
    var tempjson = JSON.stringify(temporaryReminderIdObj); // save JSON for sending
    
    temporaryReminder.reminderid = objStore[index].reminderCounter;  // insert counter
    temporaryReminder.title = objReminder.reminder.title;             // insert title
    temporaryReminder.description = objReminder.reminder.description; // insert description
    reminderTimeStamp = new Date();
    temporaryReminder.created =  reminderTimeStamp.toISOString();    // insert timestamp
	
// check if reminder array exists (i.e. first reminder)	
	if (typeof objStore[index].reminder === "undefined"){
		// does not exist, create array and add to index 0
		objStore[index].reminder = [];
		objStore[index].reminder[0] = temporaryReminder;
	} else { 
		// array exists, push to array
		objStore[index].reminder.push(temporaryReminder);
	}

	objStore[index].reminderCounter++; // increment ReminderCounter

	// console.log output
	
	objStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
	// send status 200 and id
	res.status(200).send(tempjson);
});
    

// GET route - /users/{userId}

app.get('/users/:userid', function (req, res) {
	// get userid from URL	
	var userid = req.params.userid;

	// check for valid userid
	var index = Indexsearch(objStore, "id", userid);
	
	if (index === -1) {
		
		res.status(404).send;
		
	} else {
		console.log("Found userid = " + (index+1) + "\n"); 
		for (var key in objStore[index].user){
			if (objStore[index].user.hasOwnProperty(key)){
				console.log(objStore[index].user[key]);
			}
		}
		// send response and user object
		res.status(200).json(objStore[index].user);
	}
});


// GET route - /users/{userId}/reminders

app.get('/users/:userid/reminders', function (req, res) {
	// get userid from URL	
	var userid = req.params.userid;

	// check for valid userid
	var index = Indexsearch(objStore, "id", userid);
	
	if (index === -1) {
		res.status(404).send;
		return;
	} else {
		console.log("Found userid = " + (index +1) + ":"); 
		objStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
	}

	// check if user has reminders
	
	if (typeof objStore[index].reminder === "undefined"){
		res.status(404).send;
		
		return;
	} else {
		console.log("ID " + userid + " has reminders");
	}

	// need to repack the array and remove the "reminderID" key from all the reminders
	var reminderArray = [];
	objStore[index].reminder.forEach(function (eachReminder) {
		// get each key except reminderID
		var reminderArrayObj = {};
		reminderArrayObj.title = eachReminder.title;
		reminderArrayObj.description = eachReminder.description;
		reminderArrayObj.created = eachReminder.created;
		
		reminderArray.push(reminderArrayObj);  // push to temp array
	});

	// send 200 and the modified reminder array
	res.status(200).send(JSON.stringify(reminderArray));
});


// GET route - /users/{userId}/reminders/{reminderID}

app.get('/users/:userid/reminders/:reminderid', function (req, res) {
	// get userid and reminderid from URL	
	var userid = req.params.userid;
	var reminderid = req.params.reminderid;

	// check for valid userid
	var index = Indexsearch(objStore, "id", userid);
	
	if (index === -1) {
		res.status(404).send;
		return;
	} else {
		console.log("Found userid = " + userid + ":"); 
		objStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
		
	}

	// check if user has any reminders
	
	if (typeof objStore[index].reminder === "undefined"){
		res.status(404).send;
		return;
	} else {
		console.log("ID " + userid + " has reminders");
		
	}

	// check for valid reminderID
	var reminderIndex = Indexsearch(objStore[index].reminder, "reminderID", reminderid);
	
	if (reminderIndex === -1) {
		res.status(404).send;
		return;
	} else {
		console.log("Found reminderid = " + reminderid + ", for userid = " + userid + ":"); 
		
	}

	// build new send object without the "reminderID" key
	reminderObj = {};
	reminderObj.title = objStore[index].reminder[reminderIndex].title;
	reminderObj.description = objStore[index].reminder[reminderIndex].description;
	reminderObj.created = objStore[index].reminder[reminderIndex].created;

	// send 200 + reminderObj
	res.status(200).send(reminderObj);
});

// DELETE route - /users/{userid}

app.delete('/users/:userid', function (req, res) {
	
	var userid = req.params.userid;
	
	// check for valid userid
	var index = Indexsearch(objStore, "id", userid);
	
	if (index === -1) {
		
		res.status(404).send;
		
		return;
	} else {
		console.log("Found userid = " + (index+1) + ":"); 
		objStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
		console.log("\nDeleting userid " + userid + " and all reminders");
		
	}

	// delete userid from objStore array
	objStore.splice(index, 1);

	// send status 204 No Content
	res.sendStatus(204);
});


// DELETE route - /users/{userid}/reminders

app.delete('/users/:userid/reminders', function (req, res) {
	
	var userid = req.params.userid;
	
	// check for valid userid
	var index = Indexsearch(objStore, "id", userid);
	
	if (index === -1) {
		res.status(404).send;
		return;
	} else {
		console.log("Found userid = " + (index+1) + ":"); 
		objStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
		
	}

	// check if user has reminders
	
	if (typeof objStore[index].reminder === "undefined"){
		res.sendStatus(204);
		return;
	} else {
		console.log("ID " + userid + " has reminders");
		
	}

	// clear reminder array and reset reminderCounter
	objStore[index].reminder = [];
	objStore[index].reminderCounter = 1;

	// send status 204 No Content
	res.sendStatus(204);
});


// DELETE route - /users/{userid}/reminders/{reminderid}

app.delete('/users/:userid/reminders/:reminderid', function (req, res) {
	
	var userid = req.params.userid;
	var reminderid = req.params.reminderid;
	
	// check for valid userid
	var index = Indexsearch(objStore, "id", userid);
	
	if (index === -1) {
		res.status(404).send;
		
		return;
	} else {
		console.log("Found userid = " + (index+1) + ":"); 
		objStore.forEach(function (eachUser) {
	    for (var key in eachUser) {
			if (eachUser.hasOwnProperty(key)){
				console.log(key +":", eachUser[key]);
			}
		}
	});
		
	}

	// check if user has reminders
	
	if (typeof objStore[index].reminder === "undefined"){
		res.status(404).send;
		return;
	} else {
		console.log("ID " + userid + " has reminders");
		
	}

	// check for reminder
	var reminderIndex = Indexsearch(objStore[index].reminder, "reminderID", reminderid);
	
	if (reminderIndex === -1) {
		res.status(404).send;
		return;
	} else {
		console.log("Found reminderid = " + reminderid + ", for userid = " + userid + ":");
		
	}

	// remove the reminder from the array	
	objStore[index].reminder.splice(reminderIndex, 1);

	// send status 204 No Content
	res.sendStatus(204);
});
	

app.use(function(req, res) {
	console.log("--- Bad Route  ---");
	
	// send status 404, invalid route
	res.status(404).send;
});