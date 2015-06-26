// use the express middleware
var express = require('express')
    , pg = require('pg').native
    , connectionString = process.env.DATABASE_URL
    , start = new Date()
    , port = process.env.PORT || 5000
    , client;
    
var hat = require('hat');

var bcrypt = require('bcrypt');

var morgan = require('morgan');


// make express handle JSON and other requests
var bodyParser = require('body-parser');

// use cross origin resource sharing
var cors = require('cors');

var app=express();

// make sure we can parse JSON
//app.use(bodyParser.urlencoded());		// needed to parse the AJAX requests from browsers.
//app.use(bodyParser.json());				//parse curl requests.

app.use(bodyParser.json({limit: '50mb'}));//increased the limit to 50mb to avoid code 413
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(morgan('dev')); // log every request to the console


// make sure we use CORS to avoid cross domain problems
app.use(cors());

//options to configure express.static.
var staticOptions = {
	maxAge: 86400000		//set maxage of static resources. 
};
// serve up static files from this directory.. such as jquery libraries.. images, etc. 
app.use(express.static(__dirname, staticOptions));

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
	console.log("DB Connected with port: " + port);
	var queryTokenValid = clientIn.query("SELECT userid, username FROM users WHERE token = $1;", [token]);
	queryTokenValid.on("row", function(row){
		response = {"user": row.username};
		callbackFunction( response );
	});
	queryTokenValid.on("end", function(result){  
		if(result.rowCount < 1){
			console.log("Invalid token provided: "+ token);		//comes up when someone provides a token that is not recognized.
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
    video = req.body.video;
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
        console.log("DB Connected with port: " + port);
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


/* GET /memory/get/timeline/:userid/:token - API interface
 * To use: 
 * Gets the entire timeline of the currently logged in user.    
 *  an array memory object in JSON representation from the database. 
 * CURL tester:  curl -X GET http://team23-project.herokuapp.com/memory/get/timeline/1
 * old: curl -H "Content-Type: application/json" -X POST -d '{"userid":"1"}' http://team23-project.herokuapp.com/memory/get/timeline
 curl -X GET http://team23-project.herokuapp.com/memory/get/1/f95490db8edba56eb33f9cc46f662fed
 */
app.get('/memory/get/timeline/:userid/:token', function(req, res){
	//TODO check if userid matches token.
	//parse userid from json object
	var userid = req.params.userid;
	var token = req.params.token;
	
	//Lazy loading stuff handle start id. Only returns higher than this ID. 
	//These come from after the URL e.g.   ?start=date
	//Its used to only return memories with a higher ID than this one. 
	var startID = 95151;		//default to starting with highest id possible. //this limits scalability. 
	if(req.query.start != undefined){
		startID = req.query.start;		//if the request wants we can start higher. 
	}	
	
	if(userid == undefined){res.status(400).send("Bad Request. No userID provided."); return;}
	pg.connect(connectionString, function (err, client, done) {
	    console.log("DB Connected with port: " + port);
		var getTimelineQuery = client.query("SELECT * FROM memory WHERE userid=$1 AND memoryid < $2 ORDER BY creationDate DESC LIMIT 10;", [userid, startID]);
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


app.get('/emotionCount/:userid', function(req, res){

    var userid = req.params.userid;
	var result = [];
	pg.connect(connectionString, function(err, client, done){
		var query = client.query("SELECT circlecolor, creationdate, CURRENT_TIMESTAMP FROM memory WHERE userID = $1 AND creationdate > (CURRENT_TIMESTAMP - interval '5 days')", [userid]);

		query.on('row', function(row){
				result.push(row);
		});

		query.on('end', function(row){
			if (result.length<1) {
				res.status(404).send("NOT FOUND");
			}
			else{
				res.send(result);
			}
		});
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
				console.log("DB Connected with port: " + port);
				//Perform query to database. Fields to return specified here, and id specified in URL. 
				query = client.query('SELECT memoryid, title, text, textSad, userid, image, emotion, tagid, hashtags, circleColor, creationDate FROM memory WHERE memoryid=$1', [req.params.id]);
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


/* GET /memory/get/homepage/:userid/[happy|sad]/:count/:token - API interface
 * To use: 
 * Gets the entire homepage of the currently logged in user.    
 *  an array memory object in JSON representation from the database. 
 called: by : 
https://team23-project.herokuapp.com/memory/get/timeline/" + userInfo.userID + "/happy/5/"+userInfo.token 

 */
app.get('/memory/get/homepage/:userid/:happyOrSad/:count/:token', function(req, res){
	//token check...?
	var token = req.params.token;
	//parse userid from json object
	var userid = req.params.userid;
	var happyOrSad = req.params.happyOrSad;
	var memCount = req.params.count;
	
	if(happyOrSad == "happy") {happyOrSad = 1;}
	if(happyOrSad == "sad") {happyOrSad = 0;}
	
	//TODO check if userid is authenticated for this request.
	
	if(userid == undefined){res.status(400).send("Bad Request. No userID provided."); return;}
	pg.connect(connectionString, function (err, client, done) {
	    var getTimelineQuery = client.query(
		"SELECT * FROM memory WHERE userid=$1 AND circlecolor=$2 ORDER BY creationDate DESC LIMIT $3;",
		[userid, happyOrSad, memCount]);
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
	var username = req.body.username;
	var password = req.body.password;
    console.log("Proccessing login: (username/password):" +username +"/" +password );

	//Connect to database
	pg.connect(connectionString, function (err, client, done) {
		var queryLogin = client.query("SELECT * FROM users WHERE username = $1;", [username]);

		queryLogin.on("error", function(errorMsg){
			console.log("Debug: database error:" + errorMsg);
			client.end();
			res.status(400).send({"error": "database error"});
		});

		queryLogin.on('end', function(result) {
		    if(result.rows[0] == undefined){
				res.status(404).send('No data found');	// 404 NOT FOUND
				client.end();
				console.log("Username not found in DB.");
		    } else { // this user was found in database.
				var token = hat();		//create token to store in DB
				if(bcrypt.compareSync(password, result.rows[0].password)){
					var innerQuery = client.query("UPDATE users SET token = $1 WHERE username = $2", [token, username]);
					innerQuery.on("error", function(e){ console.log("Update query caused: " + e); });
					innerQuery.on("end", function() { client.end(); });
					res.send( {"token":token, "username": username, "userID":result.rows[0].userid} );
					console.log("Accepted user: " +username + " token given:" + token);
				} else {
					client.end();	
					res.status(401).send("Unauthorized user");
					console.log("Rejected user: " +username);
				}
			}
		});
		if (err) { console.log(err);  }
	});
});

/*  SEARCH memories by hashtag API endpoint
 *  GET /search/:hashtag/?userid=1&token=fji3f2di2g4333g3z
 *  must provide userid and token. 
 * sql: SELECT memoryid, userid, creationdate, hashtags, title, length(image) FROM memory WHERE hashtags ILIKE $$%ngry%$$;
 * curl: curl https://team23-project.herokuapp.com/search/appy/1?token=5f7b22080edc6a2dce737640a1d8e4ed
 */
app.get('/search/:searchstr/:userid', function(req, res){
	//token check...?
	var token = req.query.token;
	// console.log("debug search(token): "+ token);
	// console.log("debug search(searchstr): "+ req.params.searchstr);
	// console.log("debug search(userid): "+ req.params.userid);
	isTokenValid(token, function(resp){
	    if(resp.error){
			//send feedback if auth needed.
			res.status(401).send("Authentication required: "+ resp.error);
			return;
		} else { 
			var userid = req.params.userid;
			if(userid == undefined){res.status(400).send("Bad Request. No userID provided."); return;}

			pg.connect(connectionString, function (err, client, done) {
			    console.log("Doing a search for user:" + userid + " with search string: " + req.params.searchstr);
			    var getTimelineQuery = client.query(
				"SELECT * FROM memory WHERE userid=$1 AND hashtags ILIKE $2 ORDER BY creationDate DESC;",
				[userid, "%" + req.params.searchstr.split("?")[0] + "%"]);			//percentage is part of the postgres wildcards regex.
				var timeline = [];		//storage for each row that we retrieve from DB. 
				console.log("inside request");
				//Manage events that this query could cause. 
				getTimelineQuery.on('error', function(error){
					console.log("DB error:"+error);
					res.send("DB error. Something broke in the database rectum.");
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
		}
	});
});



/** REGISTER API CALL */

// curl -H "Content-Type: application/json" -X POST -d '{"username":"april", "password":"1", "firstname":"s", "lastname":"last", "rityQuestion":"{}"}' http://team23-project.herokuapp.com/register
// Registers a new user in the database. 
app.post('/register', function (req, res) {
	var username = req.body.username;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var securityQuestion = JSON.stringify(req.body.securityQuestion);

	var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(req.body.password, salt);

	pg.connect(connectionString, function (err, client, done) {
		var queryRegister = client.query("INSERT INTO users (username, firstname, lastname, password, email, question) VALUES ($1, $2, $3, $4, $5, $6); ", 
										[username, firstname, lastname, hashedPassword, email, securityQuestion]);
		queryRegister.on("error", function(error){ 
			console.log ("Error with query: " + error); 
			client.end(); 
		});
		queryRegister.on("end", function(result) {
			client.end();
			return res.send({"msg": "Registration completed.", "username": username});
		});
	});
});


app.post('/logout', function (req, res){

	var token = req.body.token;
	var userId = req.body.userId;


	console.log("logging out user " + userId);


	//Connect to database
	pg.connect(connectionString, function (err, client, done) {
		var queryLogout = client.query("UPDATE users SET token = '' WHERE userid = $1 AND token = $2 returning *", [userId, token]);

		queryLogout.on("error", function(errorMsg){
			console.log("Debug: database error:" + errorMsg);
			client.end();
			res.status(400).send({"error": "database error"});
		});


		queryLogout.on('end', function(result) {
			//console.log(JSON.stringify(result));
			console.log("user id from the db is: "+ result.rows[0].userid +" token after update: " + result.rows[0].token);
			if(result.rows.length < 1) {
				client.end();
				return res.status(404).send('No data found');	// 404 NOT FOUND
			}

			else{

				//console.log(result);
				client.end();
				res.send({msg: "Logout is completed."});

			}

		});

		if (err) { console.log(err);  }

	});
});



/* Begin listening for incoming connections. Make it interact with the world. */
app.listen(port, function() {
  console.log('Listening on:', port);
});
