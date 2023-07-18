import {Events, GuildMember} from 'discord.js';

module.exports = {
    name: Events.GuildMemberUpdate,
    execute: async (oldMember: GuildMember, newMember: GuildMember) => {
        if (oldMember.pending === true) {
            //await newMember.roles.add(['1033489574837620777', '1033489463210426489', '1033457482682605669', '918157625554768012'], 'User has passed verification.');
        }
    }
}