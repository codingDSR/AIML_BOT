var bot = new RiveScript();
bot.loadFile("brain/main.rive?time="+Math.random(), loading_done, function(){
	alert("loading error");
});

function loading_done(){
	bot.sortReplies();
	var reply = bot.reply("local-user", "what is your name");
	console.log("The bot says: " + reply);
}
