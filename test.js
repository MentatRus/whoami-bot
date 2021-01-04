const { Telegraf } = require('telegraf')
const bot = new Telegraf('1422127712:AAEDAidGssnpAbo11c3cel4c3PUoug9d3AE');

const rooms = [{
	id: '1',
	players: [],
	words: []
}]

function getUserRoom(userId){
	return rooms.find(({players}) => players.some(({id}) => id === userId))
}

function joinRoom(ctx){
	const text = ctx.update.message.text;
	const receivedId = text.match(/[\d]+/)[0];
	const room = rooms.find(({id}) => id === receivedId);
	if (!room.players.some(({id}) => id === ctx.from.id)){
		room.players.push(ctx.from);
	}
	console.log(JSON.stringify(room));

	return ctx.reply(`Вы присоединились к комнате ${receivedId}`);
}

function getRoomInfo(ctx){
	const room = getUserRoom(ctx.from.id);
	if (!room){
		return ctx.reply('Вы пока не присоединились к  комнате')
	}
	const links = room.players.map((player, index) => `${index}: [${player.username || player.first_name}](tg://user?id=${player.id})`);

	return ctx.replyWithMarkdown(links.join('\n'));
}

bot.start((ctx) => ctx.reply('Привет'))
bot.help((ctx) => ctx.reply('Сам думай'))
bot.command('room', getRoomInfo)
bot.command('join', joinRoom);
bot.command('test', (ctx) => ctx.replyWithMarkdown(`1\r2\n3`));



bot.launch().then(() => {
	console.log('launched');
})
