const { Find_data_guild_id } = require("../Command_Library/sqlite");

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
    name:"messageCreate",
    async execute(client, message) {
        let res = await Find_data_guild_id(message.channel.id, "CommandChannel")
        if (!res) return;
        message.react('<:Second:1008994179810074724>')
        .then(msg => {
            setTimeout(() => message.delete(), res.Second * 1000);
        })
    }   
}
