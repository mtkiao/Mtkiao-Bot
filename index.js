const fs = require('node:fs');
const path = require('node:path');
const Discord = require("discord.js")
const { Client, Collection, Intents } = require('discord.js');
const { token } = require("./Data/data.json")
const axios = require('axios')

axios.get('https://discord.com', {
}).then((response) => {
  console.log("網路連線正常:", response.status)
}).catch((request) => {
  console.log("網路連線異常:", request.response.status)
})

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES]
});

client.antinuke = {};
client.antispam = {};
client.cooldowns = new Discord.Collection();
client.COOLDOWN_SECONDS = 50;
// client.antinuke = new Discord.Collection();
// client.antinuke_second = 10;

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventsFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}
const commands = [];
for (const file of eventsFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args, commands))
  }
  else {
    client.on(event.name, (...args) => event.execute(client, ...args, commands))
  }
}

client.once('ready', async () => {
  console.log('Ready!');
  const { sleep } = require("./Command_Library/wait.js")
  while (1) {
    client.user.setPresence({
      status: "idle",
      activities: [{
        name: `${client.guilds.cache.size}個伺服器 | /help`,
        type: 1,
        url: 'https://www.youtube.com/watch?v=yPYZpwSpKmA',
      }]
    });
    await sleep(60000)
  }
});

process.on('unhandledRejection', error => {
  if (error.code == 10008) {
    console.log('無法刪除訊息');
  }
  else {
    console.error('Unhandled promise rejection:', error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
  }
});

client.login(token);