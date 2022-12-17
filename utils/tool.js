const os = require('os');

module.exports = {
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    CheckRoleIsHigher(interaction, CheckRoles, Role) {
        let IsHigher = false

        for (const i of CheckRoles) {
            if (interaction.member.guild.roles.cache.find(r => r.id == i).rawPosition > Role) {
                IsHigher = true
            }
        }
        return IsHigher
    }
}