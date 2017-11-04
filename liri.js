var request = require("request");
var inquirer = require("inquirer");
var fs = require("fs");
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var command = process.argv;
inquirer.prompt([
	{
		type: "input",
		name: "command",
		message: "For tweets, type: my-tweets \n" + "Search song, type: spotify-this-song,\"<song name here>\" \n" 
			+ "For movie, type: movie-this,\"<movie name here>\""
	}
]).then(function(order){
	var command = order.command;
	if (command === "my-tweets"){
		var consumerKey = keys.consumer_key;
		var consumerSecret = keys.consumer_secret;
		var accessTokenKey = keys.access_token_key;
		var accessTokenSecret = keys.access_token_secret;
		var client = new twitter({
			consumer_key: consumerKey,
			consumer_secret: consumerSecret,
			access_token_key: accessTokenKey,
			access_token_secret: accessTokenSecret
		});
		client.get("statuses/user_timeline", {screen_name: "Ernie454"}, function(error, tweet, response){
			if (!error){
				for (var i = 0; i < tweet.length; i++){
					console.log(tweet[i].text);
				}	
			}
		});	
	}
	else{
		var commandStripped = command.split(",\"");
		if (commandStripped[0] === "spotify-this-song"){
			var song;
			spot = new spotify({
				id: "b6b5adf6354a47b48f6a5a9f9fa29a64",
				secret: "e445d77ff5624b858d7089b83442125e"
			});
			if (commandStripped[1] === undefined){
				console.log("zero");
				song = "the sign ace of base";
			}
			else{
				song = commandStripped[1];
			}
			spot.search({type: "track", query: song, limit: 1}, function(error, data){
				console.log("Artist/s " + JSON.stringify(data.tracks.items[0].album.artists[0].name));
				console.log("Song Name: " + JSON.stringify(data.tracks.items[0].name));
				console.log("Link: " + JSON.stringify(data.tracks.items[0].href));
				console.log("Album: " + JSON.stringify(data.tracks.items[0].name));
			});
		}
		else if (commandStripped[0] === "movie-this"){
			var movie;
			if (commandStripped[1] === undefined){
				movie = "Mr. Nobody";
			}
			else{
				movie = commandStripped[1];
			}
			request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece", function(error, response, body){
				if (!error && response.statusCode === 200){
					console.log("Movie Title: " + JSON.parse(body).Title);
					console.log("Year: " + JSON.parse(body).Year);
					console.log("The IMDB rating is: " + JSON.parse(body).imdbRating);
					var rottenTomatoes = JSON.parse(body).Ratings[1].Value;
					console.log("Rotten Tomatoes Rating: " + JSON.stringify(rottenTomatoes));
					console.log("Country: " + JSON.parse(body).Country);
					console.log("Language: " + JSON.parse(body).Language);
					console.log("Plot: " + JSON.parse(body).Plot);
					console.log("Actors: " + JSON.parse(body).Actors);
				}
			});
			fs.readFile("keys.js", "utf8", function(error, data){
				if (error){
					return console.log(error);
				}
				console.log(data);
			});
		}
		else {
			console.log("Please check your spelling! thank you");
		}
	}
});

