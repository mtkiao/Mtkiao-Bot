const { Find_data_guild_id } = require("../../utils/sqlite");

module.exports = {
    name:"messageCreate",
    async execute(client, message) {
        let res = await Find_data_guild_id(message.guildId, "CommandChannel")
        if (!res) return;
        
        message.react('<:Second:1008994179810074724>')
        .then(msg => {
            setTimeout(() => message.delete(), res.Second * 1000);
        })
    }   
}
