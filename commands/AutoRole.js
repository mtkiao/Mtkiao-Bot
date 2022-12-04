const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('auto_role')
        .setDescription('可以設定或關閉進來的新成員給予指定身分組')
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_ROLES)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("enable")
                .setDescription("可以啟用自動給予的身分組功能")
                .addRoleOption(option => option.setName('身分組').setDescription('請指定一個身分組').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("view")
                .setDescription("可以查看目前是否有無設定")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("disabled")
                .setDescription("可以禁用自動給予身分組功能")
        ),
    async execute(interaction,client) {
        const Role = interaction.options.getRole('身分組');
        const bot = interaction.member.guild.members.cache.get(client.user.id);
        if (!bot.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return interaction.reply({ content: ":x:我沒有管理身分組的權限!", ephemeral: true });

        let res = null
        await new Promise((resolve, reject) => {
            db.each("SELECT * FROM joinrole", function(err, row) {
                if(err) reject(err);
                if (row.guild_id == interaction.guildId){
                    res = row;
                    resolve(null);
                }
                else{
                    resolve(null);
                }
            });
        });

        if (interaction.options.getSubcommand() === "enable") {
            if (res == null) {
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('已啟用自動給予身分組功能')
                .setDescription(`:white_check_mark:已成功的將${Role}設定為加入時所給予的身分組`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                var insertQuery = db.prepare("INSERT INTO joinrole VALUES (?,?)");
                insertQuery.run(interaction.guildId, Role.id);
                insertQuery.finalize();
                interaction.reply({ embeds: [embed] })
            }
            else {
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('已經有設定自動給予身分組功能!')
                .setDescription(`:x:這個群已經有設定<@&${res.Role_id}>為加入時所給予的身分組了!`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                interaction.reply({ embeds: [embed] });
            }
        }
        if (interaction.options.getSubcommand() === "disabled") {
            if (res != null) {
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('已禁用自動給予身分組')
                .setDescription(`:x:已禁用給予新成員身分組的功能`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                db.run("DELETE FROM joinrole WHERE guild_id=?", interaction.guildId, err =>{
                    if(err) return console.log(err.message);
                });
                interaction.reply({ embeds: [embed] });
            }
            else {
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('沒有啟用自動給予身分組功能!')
                .setDescription(`:x:這個群沒有自動給予身分組功能!`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                interaction.reply({ embeds: [embed] });
            }
        }
        if (interaction.options.getSubcommand() === "view") {
            if (res == null) {
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('目前沒有啟用自動給予身分組')
                .setDescription(`:x:目前伺服器沒有啟用自動給予身分組`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                interaction.reply({ embeds: [embed] })
            }
            else {
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('已經有啟用自動給予身分組!')
                .setDescription(`:white_check_mark:這個群已經有設定<@&${res.Role_id}>為加入時所給予的身分組了!`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                interaction.reply({ embeds: [embed] });
            }
        }
	},
};