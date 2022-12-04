const { MessageEmbed } = require('discord.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
    name:"guildMemberAdd",
    async execute(client,member) {
        let res = null
        await new Promise((resolve, reject) => {
            db.each("SELECT * FROM joinrole", function(err, row) {
                if(err) reject(err);
                if (row.guild_id == member.guild.id){
                    res = row;
                    resolve(null);
                }
                else{
                    resolve(null);
                }
            });
        });
        if (!res) return;
        const Role = member.guild.roles.cache.find(r => r.id === res.Role_id);
        member.roles.add(Role)
    }   
}
