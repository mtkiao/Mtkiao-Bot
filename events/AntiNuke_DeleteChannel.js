const { Find_data_guild_id } = require("../Command_Library/sqlite");

module.exports = {
    name:"channelDelete",
    async execute(client, channel) {
        var res = await Find_data_guild_id(channel.guildId,"antinuke");
        if (!res || !res.channel_protect) return;
        var channel_delete_executor;
        channel.guild.fetchAuditLogs()
        .then(logs => {
            channel_delete_executor = logs.entries
                .filter(e => e.action === 'CHANNEL_DELETE' && e.executor.id != 994114876815446027)
                .sort((a, b) => b.createdAt - a.createdAt)
                .first()
            let whitelist = JSON.parse(res.whitelist);
            let UserId = channel_delete_executor.executor.id;
            let NukeUser = client.antinuke;
            try{ if (whitelist[channel.guildId][UserId].indexOf('Channel_Delete') != -1) return } catch{}
            if (!NukeUser[channel.guildId]) { NukeUser[channel.guildId] = {}; }
            if (!NukeUser[channel.guildId][UserId]) { NukeUser[channel.guildId][UserId] = {time : 1, second: Math.round(new Date().getTime()/1000) }; }
            else NukeUser[channel.guildId][UserId]["time"] = NukeUser[channel.guildId][UserId]["time"] + 1;
            if (NukeUser[channel.guildId][UserId]["time"] >= res.time && Math.round(new Date().getTime()/1000) - NukeUser[channel.guildId][UserId]["second"] <= res.second) {
                let member = channel.guild.members.cache.get(UserId);
                try{
                    console.log(`違規用戶: ${member.user.tag} ${channel.guildId}`)
                    member.kick(reason="防炸群防護生效 違規內容:刪除頻道")
                } catch {}
                delete NukeUser[channel.guildId][UserId]
            }
            else if (Math.round(new Date().getTime()/1000) - NukeUser[channel.guildId][UserId]["second"] >= res.second) delete NukeUser[channel.guildId][UserId]
        })
    }
}