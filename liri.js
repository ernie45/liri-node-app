/** Require dependencies */
var request = require("request");
var inquirer = require("inquirer");
var fs = require("fs");
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("node-spotify-api");

/** Grab the command line string */
var command = process.argv;

/** Prompt the user a message */
inquirer.prompt([
	{
		/** Input type prompt */
		type: "input",
		/** The name of this command */
		name: "command",
		/** Message to display to user */
		message: "For tweets, type: my-tweets \n" + "Search song, type: spotify-this-song,\"<song name here>\" \n" 
			+ "For movie, type: movie-this,\"<movie name here>\""
	}
]).then(function(order){
	/** Refer to the command above */
	var command = order.command;
	/** If the command is to search tweets */
	if (command === "my-tweets"){
		var consumerKey = keys.consumer_key;
		var consumerSecret = keys.consumer_secret;
		var accessTokenKey = keys.access_token_key;
		var accessTokenSecret = keys.access_token_secret;
		/** Create a user account for twitter api */
		var client = new twitter({
			consumer_key: consumerKey,
			consumer_secret: consumerSecret,
			access_token_key: accessTokenKey,
			access_token_secret: accessTokenSecret
		});
		/** Grab statuses from my timeline */
		client.get("statuses/user_timeline", {screen_name: "Ernie454"}, function(error, tweet, response){
			if (!error){
				/** Show every tweet */
				console.log(tweet.map(tweet => {return tweet.text}));	
			}
		});	
	}
	/** For any other command */
	else{
		/** Split the string at the commas */
		var commandStripped = command.split(",\"");
		/** If the first element in the array is the following */
		if (commandStripped[0] === "spotify-this-song"){
			var song;
			/** Access the spotify API */
			spot = new spotify({
				id: "b6b5adf6354a47b48f6a5a9f9fa29a64",
				secret: "e445d77ff5624b858d7089b83442125e"
			});
			/** If there is no following element in the array */
			if (commandStripped[1] === undefined){
				/** Default song to the following */
				song = "the sign ace of base";
			}
			else{
				/** If there is a following element, access it */
				song = commandStripped[1];
			}
			/** Search the spotify API */
			spot.search({type: "track", query: song, limit: 1}, function(error, data){
				console.log(`Artist/s ${JSON.stringify(data.tracks.items[0].album.artists[0].name)}`);
				console.log(`Song Name: ${JSON.stringify(data.tracks.items[0].name)}`);
				console.log(`Link: ${JSON.stringify(data.tracks.items[0].href)}`);
				console.log(`Album: ${JSON.stringify(data.tracks.items[0].name)}`);
			});
		}
		/** If the first eleemnt in the command is the following */
		else if (commandStripped[0] === "movie-this"){
			var movie;
			/** If there is no following command */
			if (commandStripped[1] === undefined){
				/** Default movie to the following */
				movie = "Mr. Nobody";
			}
			else{
				/** If there is a following command, access it */
				movie = commandStripped[1];
			}
			/** Use request to scrape the website */
			request(`http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=40e9cece`, function(error, response, body){
				if (!error && response.statusCode === 200){
					console.log(`Movie Title: ${JSON.parse(body).Title}`);
					console.log(`Year: ${JSON.parse(body).Year}`);
					console.log(`The IMDB rating is: ${JSON.parse(body).imdbRating}`);

					var rottenTomatoes = JSON.parse(body).Ratings[1].Value;

					console.log(`Rotten Tomatoes Rating: ${JSON.stringify(rottenTomatoes)}`);
					console.log(`Country: ${JSON.parse(body).Country}`);
					console.log(`Language: ${JSON.parse(body).Language}`);
					console.log(`Plot: ${JSON.parse(body).Plot}`);
					console.log(`Actors: ${JSON.parse(body).Actors}`);
				}
			});
			/** Read the file called keys.js in the utf8 format */
			/** Format is necessary */
			fs.readFile("keys.js", "utf8", function(error, data){
				if (error){
					return console.log(error);
				}
				console.log(data);
			});
		}
		/** If none of the commands above, then a command must be misspelled */
		else {
			console.log("Please check your spelling! thank you");
		}
	}
});

