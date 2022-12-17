const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../../config/config.json');
const package = require('../../package.json');
const os = require('os');
const path = require('node:path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('可以查看機器人的目前狀態'),
  async execute(interaction, client) {
    try {
      await interaction.deferReply()
      const commandsCount = client.ReadFiles(path.join(__dirname, '.')).length
      const cpu = os.cpus()

      const embed = new MessageEmbed()
        .setColor(color = 0xE693CB)
        .setTitle('機器人狀態')
        .addFields(
          { name: '總群組數', value: `**${client.guilds.cache.size}**`, inline: true },
          { name: '總指令數', value: `**${commandsCount}**`, inline: true },
          { name: 'API延遲', value: `**${client.ws.ping}ms**`, inline: true },
          { name: '機器人版本', value: `**${config.bot.version}**`, inline: true },
          { name: 'Discord.js版本', value: `**${package.dependencies['discord.js'].replace("^", "")}**`, inline: true },
          { name: 'Node.js版本', value: `**${process.versions['node']}**`, inline: true },
          { name: '系統版本', value: `**${os.version()}**`, inline: true },
        )
        .addFields(
          { name: 'Cpu型號', value: `**${cpu[0].model}**`, inline: true },
          { name: 'Cpu線程數', value: `**${cpu.length}**`, inline: true },
          { name: 'Cpu基礎頻率', value: `**${cpu[0].speed}ms**`, inline: true },
          { name: 'Ram總數', value: `**${Math.ceil(os.totalmem() / 1000 / 1000)}MB (實際只能使用4GB)**`, inline: true },
          { name: 'Ram剩餘數', value: `**${Math.ceil(os.freemem() / 1000 / 1000)}MB**`, inline: true },
        )
        .setFooter({ text: `${client.user.tag} (/botinfo)`, iconURL: client.user.displayAvatarURL() })
        .setTimestamp()
      interaction.editReply({ embeds: [embed] });
    } catch (e) {
      interaction.editReply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
    }
  },
};