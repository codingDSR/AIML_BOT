var bot = new RiveScript();
bot.loadFile("brain/main.rive", loading_done, function(){
	alert("loading error");
});

function loading_done(){
	bot.sortReplies();
	var reply = bot.reply("local-user", "hello");
	console.log("The bot says: " + reply);
}