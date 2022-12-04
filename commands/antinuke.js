const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction } = require('discord.js');
const { Find_data_guild_id } = require("../Command_Library/sqlite");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antinuke')
    .setDescription('防炸群保護')
    .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("啟用防炸群保護")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("禁用防炸群保護")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add_whitelist")
        .setDescription("添加防炸群白名單")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove_whitelist")
        .setDescription("刪除防炸群白名單")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view_whitelist")
        .setDescription("查看防炸群白名單")
    ),
  async execute(interaction, client) {
    const bot = interaction.member.guild.members.cache.get(client.user.id);
    if (!bot.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: ":x:我缺少管理員權限!", ephemeral: true });
    let res = await Find_data_guild_id(interaction.guildId, "antinuke");
    if (interaction.options.getSubcommand() === "enable") {
      if (res == null) {
        embed = new MessageEmbed()
          .setColor(color = 0xE693CB)
          .setTitle('已開啟防炸群保護')
          .setDescription(`:white_check_mark:已開啟防炸群保護，您的群組處於保護狀態`)
          .setTimestamp()
          .setFooter({ text: `${client.user.tag} AntiNuke`, iconURL: client.user.displayAvatarURL() });
        interaction.reply({ embeds: [embed] });
        var insertQuery = db.prepare("INSERT INTO antinuke VALUES (?,?,?,?,?,?)");
        insertQuery.run(interaction.guildId, true, true, 5, 2, "{}");
        insertQuery.finalize();
      }
      else {
        embed = new MessageEmbed()
          .setColor(color = 0xE693CB)
          .setTitle('防炸群保護已經開啟了')
          .setDescription(`:x:防炸群保護已經開啟了`)
          .setTimestamp()
          .setFooter({ text: `${client.user.tag} AntiNuke`, iconURL: client.user.displayAvatarURL() });
        interaction.reply({ embeds: [embed] });
      }
    }
    else if (interaction.options.getSubcommand() === "disable") {
      if (!res) return interaction.reply(":x:目前沒有開啟防炸群保護")
      let embed = new MessageEmbed()
        .setColor(color = 0xE693CB)
        .setTitle('關閉防炸群保護')
        .setDescription(`您確定要關閉防炸群保護嗎? 這可能會讓您的群處於危險當中!`)
        .setTimestamp()
        .setFooter({ text: `${client.user.tag} AntiNuke`, iconURL: client.user.displayAvatarURL() });

      const Button = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('disable_true')
            .setLabel('確定關閉')
            .setStyle(3)
            .setEmoji("💫"),
        )
        .addComponents(
          new MessageButton()
            .setCustomId('disable_false')
            .setLabel('取消')
            .setStyle(2)
            .setEmoji("❌"),
        );
      interaction.reply({ embeds: [embed], components: [Button] });

      const filter = (m) => {
        return interaction.user.id === m.user.id
      }
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        max: 1,
        time: 1000 * 15
      })

      collector.on('collect', i => {
        if (i.user.id !== interaction.user.id) {
          i.reply({ content: `你點這個按鈕幹嘛! :<`, ephemeral: true });
        }
        else {
          i.deferUpdate();
        }
      });

      collector.on("end", async (collection) => {
        collection.forEach((click) => {
          console.log(click.user.tag, click.customId)
        })

        if (collection.first()?.customId === "disable_true") {
          embed = new MessageEmbed()
            .setColor(color = 0xFF0000)
            .setTitle('已關閉防炸群保護')
            .setDescription(`:white_check_mark:已關閉防炸群保護!`)
            .setTimestamp()
            .setFooter({ text: `${client.user.tag} AntiNuke`, iconURL: client.user.displayAvatarURL() });
          db.run("DELETE FROM antinuke WHERE guild_id=?", interaction.guildId, err => {
            if (err) return console.log(err.message);
          });
        }
        else if (collection.first()?.customId === "disable_false") {
          embed = new MessageEmbed()
            .setColor(color = 0xFF0000)
            .setTitle('已取消關閉防炸群保護')
            .setDescription(`:white_check_mark:已取消關閉防炸群保護!`)
            .setTimestamp()
            .setFooter({ text: `${client.user.tag} AntiNuke`, iconURL: client.user.displayAvatarURL() });
        }

        await interaction.editReply({ embeds: [embed] })
      })
    }
  },
};