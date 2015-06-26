/**
 * Created by selemon on 18/05/15.
 *  Michael 27/5/15.
 */
var pg = require('pg').native
    , connectionString = process.env.DATABASE_URL
    , client
    , query;
    
//DROP if exists... for all tables... if we add another table below... also add it to this list. 
console.log("Dropping previous tables...");
client1 = new pg.Client(connectionString);
client1.connect();
var query1 = client1.query('DROP TABLE IF EXISTS memory, tags, users CASCADE');
query1.on('end', function(result) { client1.end(); });

//CREATE table for storing users and login details. 
console.log("Creating TABLE users...");
client2 = new pg.Client(connectionString);
client2.connect();
var query2 = client2.query('CREATE TABLE users(' +
		'userID SERIAL PRIMARY KEY, ' +
		'username varchar(64), ' +
		'firstname varchar(64), ' +
		'lastname varchar(64),' +
		'password varchar(64),' +
		'email varchar(64)' +
		')'
	);
query2.on('end', function(result) { client2.end(); });

//CREATE table for tags.. each tag has a memory id which represents which memory it is for
console.log("Creating TABLE tags...");
client3 = new pg.Client(connectionString);
client3.connect();
var query3 = client3.query('CREATE TABLE tags('+
		'tagID SERIAL PRIMARY KEY,' +
		'text varchar(255)' +
		')'
	);
query3.on('end', function(result) { client3.end(); });

//CREATE table for storing memories
console.log("Creating TABLE memory...");
client4 = new pg.Client(connectionString);
client4.connect();
var query4 = client4.query('CREATE TABLE memory(' +
		'memoryID SERIAL NOT NULL PRIMARY KEY, ' +
		'title varchar(255), ' +
		'text varchar(255), ' +
		'userID int references users(userID), ' +
		'image varchar(255), ' +
		'emotion varchar(64), '+ 
		'tagID INTEGER references tags(tagID)' +
		')'
	);
query4.on('end', function(result) { client4.end(); });

//INSERT DEMO DATA.
console.log("Adding test data. ");
client5 = new pg.Client(connectionString);
client5.connect();
var query5 = client5.query("INSERT INTO users (userID, username, firstname, lastname, password, email) VALUES (1, 'jack', 'Jack', 'Son', '123', 'jack@jack.com');");
query5.on('end', function(result) { client5.end(); });

client6 = new pg.Client(connectionString);
client6.connect();
var query6 = client6.query("INSERT INTO tags (tagID, text) VALUES (1, 'fun');");
query6.on('end', function(result) { client6.end(); });

client7 = new pg.Client(connectionString);
client7.connect();
var query7 = client7.query("INSERT INTO memory (memoryID, text, userID, image, emotion, tagID) VALUES (1, 'Trip to the zoo.', 1, 'http://media-cdn.tripadvisor.com/media/photo-s/02/ca/6c/38/australia-zoo.jpg', 'happy', 1);");
query7.on('end', function(result) { client7.end(); });


console.log("Finished everything.");


