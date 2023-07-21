import {SlashCommandBuilder, CommandInteraction} from 'discord.js';
import Instance from '../handlers/appHandler';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setNameLocalizations({
            'cs': 'omne'
        })
        .setDescription('Display of basic information about bot.')
        .setDescriptionLocalizations({
            'cs': 'Zobrazení základních informací o botovi.'
        }),
    ephemeral: true,
    async execute(interaction: CommandInteraction) {
        const instance = new Instance();
        const lang = instance.getLangFiles(interaction.locale);

        await interaction.editReply({
            embeds: [{
                color: 0x3399ff,
                author: {
                    name: (await instance.getInstance()).author,
                    icon_url: (await instance.getInstance()).authorIcon
                },
                title: lang['Hello this is'],
                description: lang['About_Bot'],
                fields: [
                    {
                        name: lang['🏁 Version'],
                        value: (await instance.getInstance()).version,
                        inline: true,
                    },
                    {
                        name: lang['📅 Published'],
                        value: new Date(Number((await instance.getInstance()).gitCommit.committedOn) * 1000).toLocaleDateString(),
                        inline: true,
                    },
                    {
                        name: lang['⌛ Short Hash'],
                        value: (await instance.getInstance()).gitCommit.shortHash,
                        inline: true,
                    },
                    {
                        name: lang['💬 Latest Message'],
                        value: (await instance.getInstance()).gitCommit.subject,
                        inline: false,
                    },
                ],
                footer: {
                    text: (await instance.getInstance()).footer
                },
                timestamp: new Date().toISOString(),
            }]
        });
    }
}