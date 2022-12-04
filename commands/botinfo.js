const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const getSystem = require('../Command_Library/os.js')
const os = require('os');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('可以查看機器人的目前狀態'),
  async execute(interaction, client) {
    try {
      await interaction.deferReply();
      const cpu = os.cpus();
      const commandsPath = path.join(__dirname, '.');
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
      let commands = 0;
      for (const file of commandFiles) {
        commands++;
      }
      const embed = new MessageEmbed()
        .setColor(color = 0xE693CB)
        .setTitle('機器人狀態')
        .setDescription(`
總群組數: **${client.guilds.cache.size}**
總指令數: **${commands}**
API延遲: **${client.ws.ping}ms**
機器人版本: **v2.0.5**
Discord.js版本: **13.10.2**
Node.js版本: **${process.versions['node']}**
系統版本: **${os.version()}**
            `)
        .addFields({
          name: '硬體狀態', value: `
Cpu型號: **${cpu[0].model}**
Cpu線程數: **${cpu.length}**
Cpu基礎頻率: **${cpu[0].speed}MHz**
Cpu使用率: **${Math.ceil(getSystem.getAverageUsage())}%**
Ram總數: **${Math.ceil(os.totalmem() / 1000 / 1000)}MB (實際只能使用4GB)**
Ram剩餘數: **${Math.ceil(os.freemem() / 1000 / 1000)}MB**
            `})
        .setTimestamp()
        .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
      interaction.editReply({ embeds: [embed] });
    } catch (e) {
      interaction.editReply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
    }
  },
};