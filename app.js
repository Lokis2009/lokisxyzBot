var TelegramBot = require('node-telegram-bot-api');
var request = require('request');
var token = '329363508:AAEP1DnJnpI-3imX2GEmVKplOO5WshxUl3c';  //old token 316403403:AAEXBWg1j2NZcR22Ccwp017Gfb5fCjWjG9w

var bot = new TelegramBot(token, {
	polling: true
});

var renameJson = {};
var URL = 'http://rename.dp.ua/rename.json'; // all constants should be in CAPS
var MINRESPONCELENGTH = 3;


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
	var objects;
	var requestMsg = [];

	if (chatResponce === "/start") {
		bot.sendMessage(chatId, "Вiдправте стару назву вулицi чи будь-якого обьекту, або кiлька букв i ми спробуємо знайти нову назву");
	} else {

		if (chatResponce.length < MINRESPONCELENGTH) {
			bot.sendMessage(chatId, ("Додайте ще букв, будь ласка"))
		} else {
			for (var key in renameJson) {
				if (key !== "lastUpdate") {
					objects = renameJson[key].objects;
					for (var i = 0; i < objects.length; i++) {
						if (objects[i].oldName.toLowerCase().indexOf(chatResponce) !== -1) {
							requestMsg.push(`Район: ${renameJson[key].oldAreaName} \n (${renameJson[key].newAreaName} ) \n Нова назва: ${objects[i].newName} \n (${objects[i].oldName}) \n [Інфо: ](${objects[i].link.href})`)
						}
					}
				}

			}

			if (requestMsg.length === 0) {
				bot.sendMessage(chatId, ("Даних про перейменування не знайдено (("))

			} else {

				var requestSms = requestMsg.toString().replace(/\,/g, "");
				bot.sendMessage(chatId, requestSms);
			}
		}
	}


});
