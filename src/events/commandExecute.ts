import {CommandInteraction} from 'discord.js';
import Bot from '../handlers/botHandler';
import dotenv from 'dotenv';
import lang from '../lang/cs.json';

dotenv.config();
const config = process.env;

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction: CommandInteraction) => {
        const command = Bot.client.commands.get(interaction.commandName);

        if (!interaction.isCommand() || !command) return;


        try {
            await interaction.deferReply({ephemeral: command.ephemeral})
            await command.execute(interaction, Bot.client);
        } catch (error) {
            if (error) console.error(error.message);
            await interaction.editReply({
                embeds: [
                    {
                        color: 0xdb6262,
                        title: lang['Oh no...'],
                        description: lang['There has been an error during processing the request.'],
                        timestamp: new Date().toISOString(),
                    },
                ]
            });

        }
    }
}
