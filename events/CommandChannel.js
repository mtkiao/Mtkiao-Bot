const { MessageEmbed } = require('discord.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
    name:"messageCreate",
    async execute(client,message) {
        let res = null
        await new Promise((resolve, reject) => {
            db.each("SELECT * FROM CommandChannel", function(err, row) {
                if(err) reject(err);
                if (row.guild_id == message.guildId && row.channel_id == message.channel.id){
                    res = row;
                    resolve(null);
                }
                else{
                    resolve(null);
                }
            });
        });
        if (!res) return;
        message.react('<:Second:1008994179810074724>')
        .then(msg => {
            setTimeout(() => message.delete(), res.Second * 1000);
        })
    }   
}
