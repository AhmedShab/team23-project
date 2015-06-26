var pg = require('pg').native
    , connectionString = process.env.DATABASE_URL
    , client
    , query;
var bcrypt = require('bcrypt');
	
console.log("Dropping previous tables...");
client1 = new pg.Client(connectionString);
//connect to client. 
client1.connect();

//build the query. Everything between BEGIN and COMMIT has to happen as one, or nothing does.

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("123", salt);
var hash2 = bcrypt.hashSync("n", salt);

var queryTxt = 
'BEGIN; '+
'DROP TABLE IF EXISTS memory, tags, users CASCADE; '+
'CREATE TABLE users(' +
		'userID SERIAL PRIMARY KEY, ' +
		'username varchar(64) NOT NULL, ' +
		'firstname varchar(64), ' +
		'lastname varchar(64), ' +
		'password varchar(64) NOT NULL, ' +
		'email varchar(64), ' +
		'question varchar, ' +
		'token varchar, ' +
		'expire TIMESTAMP DEFAULT CURRENT_TIMESTAMP + interval \'1 hour\' ' +
		'); '+
		
'CREATE TABLE tags('+
	'tagID SERIAL PRIMARY KEY,' +
	'text varchar(255)' +
	'); '+
	
'CREATE TABLE memory(' +
		'memoryID SERIAL PRIMARY KEY, ' +
		'title varchar(255), ' +
		'text varchar(255), ' +
		'userID int references users(userID) NOT NULL, ' +
		'image varchar, ' +
		'emotion text, '+ 
		'tagID INTEGER references tags(tagID), ' +
		'hashtags text, ' +
		'textSad text, ' +
		'circleColor text, ' +
		'creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ' +
		'); '+
		
    'INSERT INTO users (username, firstname, lastname, password, email) VALUES ($$jack$$, $$Jack$$, $$Son$$, $$'+hash+'$$, $$jack@jack.com$$); '+
    'INSERT INTO users (username, firstname, lastname, password, email) VALUES ($$n$$, $$jsk$$, $$d$$, $$'+hash2+'$$, $$mk@m.com$$); '+

'INSERT INTO tags (text) VALUES ($$fun$$); '+
'INSERT INTO tags (text) VALUES ($$happy$$); '+
'INSERT INTO tags (text) VALUES ($$wizardly$$); '+

'INSERT INTO memory (title, text, userID, image, emotion, tagID, hashtags) '+
   'VALUES ($$Zoo outing.$$, $$Trip to the zoo with family.$$, 1, $$http://thefamilyjules.com/wp-content/uploads/2010/08/zoo-trip.jpg$$, $$$$, 1, $$#Dancing$$); ' +
'COMMIT; ';

console.log("Running: \n " + queryTxt + "\n");

var q1 = client1.query(queryTxt); //perform query. 

//attach callbacks. 
q1.on('end', function(result) { 
	console.log("Success.");
	client1.end(); 
});
q1.on('error', function(result) { 
	console.log("There was an error.");
	client1.end();
 });

console.log("Finished. Closing connection to database.");
