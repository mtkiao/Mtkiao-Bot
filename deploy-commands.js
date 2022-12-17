require('dotenv').config()
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')
const { clientId } = require('./Config/config.json')
const token = process.env.TOKEN
const fs = require('node:fs')
const path = require('node:path')

function ReadFiles(Path) {
	if (!fs.existsSync(Path)) return []
  
	let AllFiles = []
	const Files = fs.readdirSync(Path)
	for (const file of Files) {
		const filePath = path.join(Path, file)
		const fileStat = fs.lstatSync(filePath)
		if (fileStat.isDirectory()) {
			AllFiles = AllFiles.concat(ReadFiles(path.join(Path, file)))
		}
		if (filePath.endsWith('.js')) {
			AllFiles.push(filePath)
		}
	}
	return AllFiles
}

const commands = [];
const commandPath = path.join(__dirname, 'commands');

for (const file of ReadFiles(commandPath)) {
	const command = require(file);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();