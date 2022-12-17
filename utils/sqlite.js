var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
    async Find_data_guild_id(guild_id, sq_name) {
        let res = null;
        await new Promise((resolve, reject) => {
            db.each(`SELECT * FROM ${sq_name}`, function(err, row) {
                if(err) reject(err);
                if (row.guild_id == guild_id){
                    res = row;
                    resolve(null);
                } else{
                    resolve(null);
            }
        })});
        return res;
    },

    async Find_data_level(user_id, sq_name) {
        let res = null;
        await new Promise((resolve, reject) => {
            db.each(`SELECT * FROM ${sq_name}`, function(err, row) {
                if(err) reject(err);
                if (row.user_id == user_id){
                    res = row;
                    resolve(null);
                } else{
                    resolve(null);
            }
        })});
        return res;
    }
}