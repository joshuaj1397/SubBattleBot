const fs = require('fs');
const ChessWebAPI = require('chess-web-api');
const Discord = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const { prefix, token, mongouri } = require('./config');

const chessAPI = new ChessWebAPI({queue: true});
const mongoClient = new MongoClient(mongouri, { useUnifiedTopology: true });
const client = new Discord.Client();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();

mongoClient.connect(err => {
	if (err) {
		console.log('There was an error connecting to the database\n' + err);
	}
});

// Load commands
commandFiles.forEach(file => {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}

	if (!client.commands.has(commandName)) {
		message.reply('That command doesn\'t exist, use !help for assistance');
		return;
	} else {
		try {
			const command = await client.commands.get(commandName);
			const reply = await command.execute(message, args, mongoClient, chessAPI);
			message.reply(reply);
		} catch (err) {
			console.error(err);
			message.reply('There was an error trying to execute that command');
		}
	}
});

client.login(token);
