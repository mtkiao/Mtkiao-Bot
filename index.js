require('dotenv').config()
const { Client, Collection, Intents } = require('discord.js')
const Discord = require("discord.js")
const path = require('node:path')
const fs = require('node:fs')
const winston = require('winston')
const { printf } = winston.format;
const token = process.env.TOKEN

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

const LogFormat = printf(({ level, message, label, timestamp }) => {
  return `${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: LogFormat,
  transports: [
    new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
    new winston.transports.Console()
  ],
})

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const evebtsPath = path.join(__dirname, 'events');

// Load commands
for (const filePath of client.ReadFiles(commandsPath)) {
  try {
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    logger.info("\033[40;32m" + `[ ${new Date().toLocaleString()} ]: ` + 'Successfully load command \033[42;32m' + command.data.name + '\033[0m');
  } catch (e) {
    logger.error("\033[40;31m" + `[ ${new Date().toLocaleString()} ]: ` + 'Failed to load command \033[41;31m' + filePath + '\033[0m' + `\n(ERROR) : ${e})`);
  }
}

// Load events
const commands = []
for (const filePath of client.ReadFiles(evebtsPath)) {
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => {
      try{
        logger.info(`[ ${new Date().toLocaleString()} ]: event > ${event.name} `);
        event.execute(client, ...args, commands)
      } catch (error) {
        logger.error(`[ ${new Date().toLocaleString()} ]: event > ${event.name} (ERROR): ${error}`);
      }
    });

    logger.info("\033[40;32m" + `[ ${new Date().toLocaleString()} ]: ` + 'Successfully load event \033[42;32m' + event.name + '\033[0m');
  }
  else if (!event.once && event.name != undefined) {
    client.on(event.name, (...args) => {
      try{
        logger.info(`[ ${new Date().toLocaleString()} ]: event > ${event.name}`);
        event.execute(client, ...args, commands)
      } catch (error) {
        logger.error(`[ ${new Date().toLocaleString()} ]: event > ${event.name} (ERROR): ${error}`);
      }
    });
    
    logger.info("\033[40;32m" + `[ ${new Date().toLocaleString()} ]: ` + 'Successfully load event \033[42;32m' + event.name + '\033[0m');
  }
  else {
    logger.error("\033[40;31m" + `[ ${new Date().toLocaleString()} ]: ` + 'Failed to load event \033[41;31m' + filePath + '\033[0m');
  }
}

client.once('ready', async () => {
  logger.info(`[ ${new Date().toLocaleString()} ]: Ready! Login Bot: ${client.user.tag}`);
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
  logger.error(`[ ${new Date().toLocaleString()} ]: ${error}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
    logger.info(`[ ${new Date().toLocaleString()} ]: ${interaction.user.tag} > /${interaction.commandName}`);
  } catch (error) {
    logger.error(`[ ${new Date().toLocaleString()} ]: ${interaction.user.tag} > /${interaction.commandName} (ERROR): ${error}`);
    await interaction.reply({ content: `發生錯誤，原因: ${error}`, ephemeral: true });
  }
});

client.login(token);