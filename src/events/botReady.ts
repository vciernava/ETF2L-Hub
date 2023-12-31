import {ActivityType, Client, Events, Routes} from 'discord.js'
import {REST} from '@discordjs/rest';
import dotenv from 'dotenv';
import Commands from '../handlers/commandHandler';
import Bot from '../handlers/botHandler';
import Instance from '../handlers/appHandler';

dotenv.config();
const config = process.env;

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute: async (bot: Client ) => {
        const instance = new Instance();
        console.info('Logged in as %s', bot.user.tag);

        const rest = new REST({
            version: '10'
        }).setToken(config.TOKEN);

        try {
            // await rest.put(Routes.applicationGuildCommands(bot.user.id, config.GUILD_ID), {
            //     body: Commands.commands
            // });
            // await rest.put(Routes.applicationGuildCommands(bot.user.id, "1116610823054430271"), {
            //     body: Commands.commands
            // });
            // console.info('All commands have been registered (locally)');
            await rest.put(Routes.applicationCommands(bot.user.id), {
                body: Commands.commands
            });
            console.info('All commands have been registered');

            bot.user.setStatus('online');
            Bot.setActivity(`${bot.guilds.cache.size} servers`, ActivityType.Listening);

        } catch (error) {
            console.error(error);
        }
    }
}