require('dotenv').config()
const axios = require('axios')
const fs = require('node:fs')
const path = require('node:path')
const Discord = require("discord.js")
const { Client, Collection, Intents } = require('discord.js')
const token = process.env.TOKEN

axios.get('https://discord.com/', {
  }).then((response) => {
    console.log(`Successfully connected to Discord API ${response.status}`)
  }).catch((request) => {
    console.log(`Failed connect to Discord API ${request}`)
  })

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES]
});

client.antinuke = {};
client.antispam = {};
client.cooldowns = new Discord.Collection();
client.ReadFiles = function(Path) {
    if (!fs.existsSync(Path)) return []
  
    let AllFiles = []
    const Files = fs.readdirSync(Path)
    for (const file of Files) {
        const filePath = path.join(Path, file)
        const fileStat = fs.lstatSync(filePath)
        if (fileStat.isDirectory()) {
            AllFiles = AllFiles.concat(this.ReadFiles(filePath))
        }
        if (filePath.endsWith('.js')) {
            AllFiles.push(filePath)
        }
    }
    return AllFiles
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const evebtsPath = path.join(__dirname, 'events');

// Load commands
for (const filePath of client.ReadFiles(commandsPath)) {
  try {
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    console.log('\033[40;32m Successfully loaded command \033[42;32m' + command.data.name + '\033[0m')
  } catch (e) {
    console.log('\033[40;31m Failed to load command \033[41;31m' + filePath + '\033[0m')
    console.log(e)
  }
}

// Load events
const commands = []
for (const filePath of client.ReadFiles(evebtsPath)) {
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args, commands))
  }
  else {
    client.on(event.name, (...args) => event.execute(client, ...args, commands))
  }
  console.log('\033[40;32m Successfully loaded event \033[42;32m' + event.name + '\033[0m')

}

client.once('ready', async () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  const { sleep } = require("./utils/tool.js")
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

process.on('unhandledRejection', (error) => {
  console.error(error);
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