const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const ms = require("ms")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('可以禁言指定的成員')
    .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR)
    .addUserOption(option => option.setName('成員').setDescription('指定一位成員').setRequired(true))
    .addStringOption(option => option.setName('時間').setDescription('請寫出禁言的時間').setRequired(true))
    .addStringOption(option => option.setName('原因').setDescription('請寫出禁言此成員的原因(可不寫)')),
  async execute(interaction, client) {
    const member = interaction.options.getUser('成員')
    const time = interaction.options.getString('時間')
    const reason = interaction.options.getString('原因')
    const bot = interaction.member.guild.members.cache.get(client.user.id)
    const memberTarger = interaction.guild.members.cache.get(member.id)
    
    if (!bot.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: ":x:我沒有管理員的權限!", ephemeral: true });
    try {
      const timeInMs = ms(time)
      if (!timeInMs) return interaction.reply({ content: ":x:請輸入有效的時間格式!", ephemeral: true })
      
      const embed = new MessageEmbed()
        .setColor(color=0xE693CB)
        .setTitle('成員已禁言')
        .setDescription(`${member}被**禁言**了`)
        .addFields(
          { name: '詳細資訊:', value: [
            `命令使用者: ${interaction.user}`,
            `禁言原因: ${!reason ? "無" : reason}`,
            `禁言時間: ${time}`
          ].join('\n') },
        )
        .setFooter({ text: `${client.user.tag} (/timeout)`, iconURL: client.user.displayAvatarURL() })
        .setTimestamp()
      memberTarger.timeout(timeInMs, reason)
      interaction.reply({ embeds: [embed] })
    } catch (e) {
      interaction.reply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
    }
  },
};