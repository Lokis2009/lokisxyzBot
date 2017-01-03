var TelegramBot = require('node-telegram-bot-api'); // all requires should be in top of file
var request = require('request');
var token = '316403403:AAEXBWg1j2NZcR22Ccwp017Gfb5fCjWjG9w';
var bot = new TelegramBot(token, {
	polling: true
});

var renameJson = {};
var URL = 'http://rename.dp.ua/rename.json'; // all constants should be in CAPS

request.get({
	url: URL,
	json: true,
	headers: {
		'User-Agent': 'request'
	}
}, (err, res, data) => {

	if (err) {
		console.log('Error:', err);
	} else if (res.statusCode !== 200) {
		console.log('Status:', res.statusCode);
	} else {
		// data is already parsed as JSON:
		renameJson = data;
	}
});


bot.on('message', function (msg) {

	var chatResponce = msg.text.toLowerCase();
	var chatId = msg.chat.id;
	//var arr = renameJson; dont double variables!!!
	var flag = 0, objects;
	
	console.log(msg);

	if (chatResponce.length < 3) { // 3 - is the "magic number", this is antipattern
		bot.sendMessage(chatId, ("Додайте ще букв, будь ласка"))
	} else {
		for (var key in  renameJson) {
			if (key !== "lastUpdate") {
				objects = renameJson[key].objects;
				for (var i = 0; i < objects.length; i++) {
					if ( objects[i].oldName.toLowerCase().indexOf(chatResponce) !== -1) {
					// what about collect results to one object and send it all after full search?
						bot.sendMessage(chatId, ("Стара назва: " + objects[i].oldName + " \n" + "Нова назва: " + objects[i].newName), {
							caption: "I'm a bot!"
						});
						flag++;
					}
				};
			}
		}
		if (flag === 0) {
			bot.sendMessage(chatId, ("Нажаль, нiчого не змогли знайти (("))
		}
	}
});
