const { Permissions,MessageEmbed } = require('discord.js');
const { Find_data_guild_id } = require("../../../utils/sqlite");

module.exports = {
    name:"messageCreate",
    async execute(client, message) {
        var res = await Find_data_guild_id(message.guildId, "antispam");
        if (!res) return;

        try{
            let UserId = message.author.id;
            let SpamUser = client.antispam;

            if (UserId == client.user.id) return;
            if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

            if (!SpamUser[message.guildId]) { SpamUser[message.guildId] = {}; }
            if (!SpamUser[message.guildId][UserId]) { SpamUser[message.guildId][UserId] = {time : 1, second: Math.round(new Date().getTime()/1000) }; }
            else SpamUser[message.guildId][UserId]["time"] += 1;
            console.log(SpamUser[message.guildId][UserId]["time"])
            if (SpamUser[message.guildId][UserId]["time"] >= res.spamtime && Math.round(new Date().getTime()/1000) - SpamUser[message.guildId][UserId]["second"] <= res.time) {
                console.log(`Spam違規用戶: ${message.author.tag} ${message.guildId}`);
                const memberTarger = message.guild.members.cache.get(message.author.id);
                memberTarger.timeout(res.mutetime, `防刷頻檢測 在${res.time}內發送了${res.spamtime}條訊息`);

                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle(`${message.author.tag}已被禁言`)
                .setDescription(`${message.author.tag}被禁言了**${res.mutetime / 1000}**秒 原因:_刷屏_`)
                .setTimestamp()
                message.channel.send({ embeds: [embed] });

            }
            else if (Math.round(new Date().getTime()/1000) -SpamUser[message.guildId][UserId]["second"] >= res.time) delete SpamUser[message.guildId][UserId]
        } catch (e){}
    }
}