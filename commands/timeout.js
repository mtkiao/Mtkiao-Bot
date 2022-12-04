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
    const member = interaction.options.getUser('成員');
    const time = interaction.options.getString('時間');
    const reason = interaction.options.getString('原因');
    const bot = interaction.member.guild.members.cache.get(client.user.id);
    const memberTarger = interaction.guild.members.cache.get(member.id);
    if (!bot.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: ":x:我沒有管理員的權限!", ephemeral: true });
    try {
      const timeInMs = ms(time);
      if (!timeInMs) return interaction.reply({ content: ":x:請輸入有效的時間格式!", ephemeral: true });
      memberTarger.timeout(timeInMs, reason);

      const embed = new MessageEmbed()
        .setColor(color = 0xE693CB)
        .setTitle('成員被禁言')
        .setDescription(`${interaction.user}使用了命令"/timeout"禁言了${member}${time}`)
        .setTimestamp()
        .setFooter({ text: `原因:${reason}`, iconURL: interaction.user.displayAvatarURL() })
      interaction.reply({ embeds: [embed] });
    } catch (e) {
      interaction.reply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
    }
  },
};