var TelegramBot = require('node-telegram-bot-api');
var token = '316403403:AAEXBWg1j2NZcR22Ccwp017Gfb5fCjWjG9w';
var bot = new TelegramBot(token, {
	polling: true
});

var renameJson1 = {};

var request = require('request');

var url = 'http://rename.dp.ua/rename.json';

request.get({
	url: url,
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

	console.log(msg);

	var arr = renameJson;

	var flag = 0;

	if (chatResponce.length < 3) {
		bot.sendMessage(chatId, ("Додайте ще букв, будь ласка"))
	} else {
		for (var key in arr) {

			if (key != "lastUpdate") {

				for (var i = 0; i < arr[key].objects.length; i++) {

					if (arr[key].objects[i].oldName.toLowerCase().indexOf(chatResponce) != -1) {

						bot.sendMessage(chatId, ("Стара назва: " + arr[key].objects[i].oldName + " \n" + "Нова назва: " + arr[key].objects[i].newName), {
							caption: "I'm a bot!"
						})

						flag = flag + 1;
					}
				};



			}
		}

		if (flag === 0) {

			bot.sendMessage(chatId, ("Нажаль, нiчого не змогли знайти (("))
		}


	}
});