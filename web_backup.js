// use the express middleware
var express = require('express')
    , pg = require('pg').native
    , connectionString = process.env.DATABASE_URL
    , start = new Date()
    , port = process.env.PORT || 5000
    , client;
    
var hat = require('hat');

var bcrypt = require('bcrypt');

// make express handle JSON and other requests
var bodyParser = require('body-parser');

// use cross origin resource sharing
var cors = require('cors');

var app=express();

// make sure we can parse JSON
app.use(bodyParser.urlencoded());		// needed to parse the AJAX requests from browsers. 
app.use(bodyParser.json());				//parse curl requests. 

// make sure we use CORS to avoid cross domain problems
app.use(cors());

// serve up static files from this directory.. such as jquery libraries.. images, etc. 
app.use(express.static(__dirname));

//Support methods. 
//Check to see if a token is indeed valid.
//runs function callback if valid, else nothing. 
function isTokenValid(token, callbackFunction){
	//base case: don't allow null tokens... ever!
	var response = {};
	if(token == "" || token == undefined){
		response = { "error":"Invalid token provided" };
		callbackFunction( response );
		return;
	}
	//db setup..
	clientIn = new pg.Client(connectionString); 
	clientIn.connect();
	var queryTokenValid = clientIn.query("SELECT userid FROM users WHERE token = $1;", [token]);
	queryTokenValid.on("row", function(row){
		response = {"user": row.username};
		callbackFunction( response );
	});
	queryTokenValid.on("end", function(result){  
		if(result.rowCount < 1){
			response = { "error":"Invalid token provided" };
			callbackFunction( response );
		}			
		clientIn.end(); 
	});
	queryTokenValid.on("error", function(error){
		console.log("Error looking up token: " + error);
		clientIn.end();
		response = { "error":"database error" };
		callbackFunction( response );
	});
}


///////////API calls...
/* POST /memory/store - API interface
 * To use: it
 * pass a json object representing the memory to be stored in the body. Use a post request. 
 * returns the newly created memory in the database. 
 * CURL tester: curl -H "Content-Type: application/json" -X POST -d '{"title":"Test Title","text":"Fun time at park.(curl test)","userid":"1", "image":"shortURL1.jpg", "emotion":"happy", "tagid":"1"}' http://team23-project.herokuapp.com/memory/store 
 */
app.post('/memory/store', function(req, res) {
	//TODO check if user is authenticated for this request.
  isTokenValid(req.body.token, function(resp){
	
    if(resp.error){
			res.status(401).send("Authentication required: "+ resp.error);
			return;
		} else { 
		
	console.log("body contents: " + JSON.stringify(req.body)); //debug
	// Grab elements from body JSON object. 
	title = req.body.title;
    text = req.body.text;
    userid = req.body.userid;
    image = req.body.image;
    emotion = req.body.emotion;
    tagid = req.body.tagid;
    hashtags = req.body.hashtags;
    textSad = req.body.textSad;
    circleColor = req.body.circleColor;
	// Basic sanity checking. Is this even going to work? 
	if(	 title == undefined ||
		 text == undefined || 
    	 userid == undefined || 
    	 image == undefined || 
    	 emotion == undefined ||
    	 tagid == undefined
    	 ){
    	res.status(400).send("Bad request. Some parameter not defined or missing. I recieved this body:" + req.body);
    	return;
    }
	//Connect to database. 
    pg.connect(connectionString, function (err, client, done) {
        // SQL parameterized query to insert entry. 
        query = client.query('INSERT INTO memory (title, text, userID, image, emotion, tagID, hashtags, textSad, circleColor) '+
        	'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) '+
        	'RETURNING memoryid, title, text, userID, image, emotion, tagID;', [title, text, userid, image, emotion, tagid, hashtags, textSad, circleColor]);
         
        var results = [];  //stores results.. in this case should just be one. 
		//handle database events. errors first.  		
		query.on('error', function (errorMsg) {
            console.log("Debug: database error:" + errorMsg);
            res.status(400).send({"error": "database error"});
			client.end();
        });
		// Stream results back one row at a time
		query.on('row', function (resultRow) {
            console.log("Debug: (/memory/store) returning obejct: " + resultRow);
			results.push(resultRow);
        });
		// After all data is returned, close connection and return results
		query.on('end', function () {
			client.end();
			res.status(200).send(results);
		});
		// Handle Errors - by console display
		if (err) {	console.log(err);  }
    });
		}
  });
});

/* GET /memory/get/:id - API interface
 * To use:
 * specify a valid memory ID in the URL above.  
 * GET a memory object in JSON representation from the database. 
 * returns empty array if memoryid does not exsist. 
 * CURL tester:  curl -X GET http://team23-project.herokuapp.com/memory/get/2
 */
app.get('/memory/get/:id/:token', function(req, res){
	//TODO check if user is authenticated for this request.
	
  isTokenValid(req.params.token, function(resp){
	
    if(resp.error){
			res.status(401).send("Authentication required: "+ resp.error);
			return;
		} else { 
		  console.log(resp);
    //Connect to database
    pg.connect(connectionString, function (err, client, done) {
		//Perform query to database. Fields to return specified here, and id specified in URL. 
		query = client.query('SELECT memoryid, title, text, userid, image, emotion, tagid, creationDate FROM memory WHERE memoryid=$1', [req.params.id]);
		var results = [];  //stores results.. in this case should just be one or none. 

		//for each row add to the results array (above). 
		query.on('row', function(result){
			console.log("Debug: (/memory/get/:id) returning obejct: " + result);
			if (!result) {		//If there is no result then send back an error message. 
				res.status(404).send('No data found');	// 404 NOT FOUND
			} else {
				results.push(result);	//add to array. 
			}
		});
		query.on('end', function() {
            client.end();	//close DB connection.
            res.send(results);	//finally at the end of the query send all the results. 
        });
        if (err) {	console.log(err);  }
	});
		}
  });
});
/* GET /memory/get/timeline/:userid - API interface
 * To use: 
 * Gets the entire timeline of the currently logged in user.    
 *  an array memory object in JSON representation from the database. 
 * CURL tester:  curl -X GET http://team23-project.herokuapp.com/memory/get/timeline/1
 * old: curl -H "Content-Type: application/json" -X POST -d '{"userid":"1"}' http://team23-project.herokuapp.com/memory/get/timeline
 curl -X GET http://team23-project.herokuapp.com/memory/get/1/f95490db8edba56eb33f9cc46f662fed
 */
app.get('/memory/get/timeline/:userid', function(req, res){
	//parse userid from json object
	var userid = req.params.userid;
	
	//TODO check if userid is authenticated for this request.
	
	if(userid == undefined){res.status(400).send("Bad Request. No userID provided."); return;}
	pg.connect(connectionString, function (err, client, done) {
	    var getTimelineQuery = client.query("SELECT * FROM memory WHERE userid = $1 ORDER BY creationDate DESC;", [userid]);
		var timeline = [];		//storage for each row that we retrieve from DB. 
		console.log("inside request");
		//Manage events that this query could cause. 
		getTimelineQuery.on('error', function(error){
			console.log("DB error:"+error);
			res.send("DB error. Something broke in the database rectifier.");
			client.end();
		});
		getTimelineQuery.on('row', function(row){
			timeline.push(row);		//add to the memory array. 
		});
		getTimelineQuery.on('end', function(row){
			res.send(timeline);		//blast it over to the client. 
			client.end();			//close DB connection.
		});
	});
});

/* API login
 * 
 * curl -H "Content-Type: application/json" -X POST -d '{"username":"jack", "password":"123"}' http://team23-project.herokuapp.com/login
 */
app.post('/login', function (req, res) {
	console.log("in login API call");
	var username = req.body.username;
	var password = req.body.password;

	var results = [];

	console.log("username: " + username);
	console.log("password: " + password);

	//Connect to database
	pg.connect(connectionString, function (err, client, done) {

		console.log("Connected");
		var queryLogin = client.query("SELECT * FROM users WHERE username = $1;", [username]);

		queryLogin.on('error', function(errorMsg){
			console.log("Debug: database error:" + errorMsg);
			client.end();
			res.status(400).send({"error": "database error"});
		});

		//for each row add to the results array (above).
		queryLogin.on('row', function(row){
			//console.log(row); 
			results.push(row);
			console.log("Got a row");
		});
		
		queryLogin.on('end', function(result) {
		    if(results.length<1){
		      res.status(404).send('No data found');	// 404 NOT FOUND
		      client.end();
		      console.log("Username not returned from DB");
		      //res.status(401).send("unauthrized user");
		      return;
		    }
		    console.log(result.rows[0]);  
		    var h = hat();
		    console.log("token is: "+ h);
		    if(bcrypt.compareSync(password, results[0].password)){
			  console.log("attempt updating token in db.");
			  client.query("UPDATE users SET token = $1 WHERE username = $2", [h, username]);
			  client.end();	//close DB connection.
			  console.log("Sending user:" + JSON.stringify({"token":h, "username": username, "userID":results[0].userid}));
			  res.send( {"token":h, "username": username, "userID":results[0].userid} );
			  return;
		    } else {
			  client.end();	
			  res.status(401).send("unauthrized user");
			  return;
		    }
		});
		if (err) { console.log(err);  }
	});
});


/* Begin listening for incoming connections. Make it interact with the world. */
app.listen(port, function() {
  console.log('Listening on:', port);
});
