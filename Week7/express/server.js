var express = require('express'),
    http = require("http"),
    app;
port = 3000;
var counterID = 1;
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

http.createServer(app).listen(port);

var handrepository = new Array();

// Search function used to find the index for  app.get(s) and app.put routes
function Indexsearch(handId, handrepository) {
    for (var i = 0; i < handrepository.length; i++) {
        // Check to see handid(passed in) matches this particular id in handrepository
        if (handrepository[i].id == handId) {
            // Success, a match was found
            return i;
        }
    }
	// return a '-1' if no match was found in handrepository for this id
    return -1;
}

// app.get route for when the handid is given.
app.get('/hands/:handid', function(req, res) {
	var objecthand = req.body;
    var handId = req.params.handid;
    var handindex = Indexsearch(handId, handrepository);
    // Check for a valid handid
    if (handindex === -1) {
		    // No Match for id
            res.status(404).send('Handid not found');
            return;
    }
	// Display the index and cards 
    res.json(handrepository[handindex]);
});

// app.get route for when the handid/cards is given.
app.get('/hands/:handid/cards', function(req, res) {
	var objecthand = req.body;
    var handId = req.params.handid;
    var handindex = Indexsearch(handId, handrepository);
   // Check for a valid handid
    if (handindex === -1) {
		// No Match for id
        res.status(404).send('Handid not found');
        return;
    } 
    // Display just the cards for the corresponding index
    res.json(handrepository[handindex].cards);
});

//app.post route to populate the array of objects
app.post('/hands/', function(req, res) {

    var objecthand = req.body;

    temporaryHand = {};
    temporaryHand.id = counterID; // set ID in object
    var tempjson = JSON.stringify(temporaryHand);
    counterID++; // increment for next ID
    temporaryHand.cards = objecthand; // put card data into the object

    handrepository.push(temporaryHand); // append to end of array

    // Display the index and cards that were just read in and put in array.
    res.send(tempjson); 
});

//app.put route is used to replace the cards for given handid
app.put('/hands/:handid', function(req, res) {
    var objecthand = req.body;
    var handId = req.params.handid;
    var handindex = Indexsearch(handId, handrepository);
    
    // Check for a valid handid
    if (handindex === -1) {
        res.status(404).send('Handid not found');
        return;
    }
    // Replace the old card data with the new card data that was read in with the 'put'
    handrepository[handindex].cards = objecthand.slice();
    res.status(204).send('Updated sucessfully');
});

app.use(function(req, res) {
    res.status(204).send('No Content on Success');
});