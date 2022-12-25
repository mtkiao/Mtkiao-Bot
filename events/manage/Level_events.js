const { Find_data_guild_id, Find_data_level } = require("../../utils/sqlite");
const { MessageEmbed } = require('discord.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
    name:"messageCreate",
    async execute(client, message) {
        if (message.author.bot) return

        let res = await Find_data_guild_id(message.guildId, "level")
        if (!res) return

        res = await Find_data_level(`${message.guildId}.${message.author.id}`, "level_2")
        if (!res){
            let insertQuery = db.prepare("INSERT INTO level_2 VALUES (?,?,?,?)")
            insertQuery.run(`${message.guildId}.${message.author.id}`, 1, 1 ,50)
            insertQuery.finalize();
        }
        else{
            const level_random = Math.round(Math.random() * 15)

            let updateQuery="update level_2 set level = ? where user_id = ?" 
            db.run(updateQuery, [res.level + level_random, `${message.guildId}.${message.author.id}`]); 
             
            if (res.level + level_random >= res.level_next) {
                let updateQuery="update level_2 set level = ?, level_large = ?, level_next = ? where user_id = ?" ;
                db.run(updateQuery, [res.level + level_random - res.level_next, res.level_large + 1, res.level_next + 150, `${message.guildId}.${message.author.id}`]); 

                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle(`${message.author.tag}已經到**${res.level_large + 1}**等級了!`)
                    .setDescription(`${message.author}的等級已經來到了${res.level_large + 1}，距離下次升級還要${res.level_next + 150 - (res.level - res.level_next)}個經驗值!`)
                    .setTimestamp()
                message.channel.send({ embeds: [embed] })
                    .then((m) => {
                        setTimeout(() =>{
                            m.delete().catch(() => {});
                        }, 1 * 5000)
                })
            }
        }
    }   
}
