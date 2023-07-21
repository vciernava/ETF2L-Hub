import {SlashCommandBuilder, CommandInteraction, EmbedBuilder, RestOrArray, APIEmbedField, ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandStringOption,} from 'discord.js';
import Instance from '../handlers/appHandler';
import axios from 'axios';
import Bot from '../handlers/botHandler';

const playerOptions: SlashCommandStringOption = new SlashCommandStringOption()
    .setName('id')
    .setNameLocalizations({
        'cs': 'id'
    })
    .setDescription('Write players steamID or ETF2L ID')
    .setDescriptionLocalizations({
        'cs': 'Napiš steamID nebo ETF2L ID uživatele'
    })
    .setRequired(true);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setNameLocalizations({
            'cs': 'hrac'
        })
        .setDescription('Find a player by their steamID or ETF2L ID.')
        .setDescriptionLocalizations({
            'cs': 'Najdi hráče pomocí jejich steamID nebo ETF2L ID.'
        })
        .addStringOption(playerOptions),
    ephemeral: true,
    async execute(interaction: CommandInteraction) {
        const lang = await import(`../lang/${interaction.locale}.json`)
        const instance = new Instance();
        const id = interaction.options.data.find(item => item.name === 'id').value.toString();
        const fields: RestOrArray<APIEmbedField> = [];
        let steam_id = "";
        let etfid = "";
        try {
            const playerdata = await axios.get(`https://api-v2.etf2l.org/player/${id}`);

            etfid = playerdata.data.player.id;
            steam_id = playerdata.data.player.steam.id64;

            const teamsNameArray = [];
            const teamsArray = [];
            playerdata.data.player.teams.forEach(team => {
                teamsNameArray.push(team.name);
            });
            const teamsURLArray = [];
            playerdata.data.player.teams.forEach(team => {
                teamsURLArray.push(team.id);
            });
            teamsNameArray.forEach((team, index) => {
                teamsArray.push(`[${team}](https://etf2l.org/teams/${teamsURLArray[index]})`);
            });
            const modifiedTeamsArray = teamsArray.map((item) => item.replace(/"/g, ''))
            const modifiedTeams = modifiedTeamsArray.join(', ');

            const classesArray = [];
            playerdata.data.player.classes.forEach(className => {
                classesArray.push(className);
            });
            const modifiedClassesArray = classesArray.map((item) => item.replace(/"/g, ''))
            const modifiedClasses = modifiedClassesArray.join(', ');

            const breaker: APIEmbedField = {inline: true, name: "\u200B", value: "\u200B"};

            const forumId: APIEmbedField = {inline: true, name: lang['ETF2L ID'], value: `${etfid}`};
            const country: APIEmbedField = {inline: true, name: lang['Country'], value: playerdata.data.player.country};
            const teams: APIEmbedField = {inline: true, name: lang['Teams'], value: `${modifiedTeams}`};
            const classes: APIEmbedField = {inline: true, name: lang['Classes'], value: `${modifiedClasses}`};
            fields.push(forumId);
            fields.push(country);
            fields.push(breaker);
            fields.push(teams);
            fields.push(classes);
            fields.push(breaker);

            const Row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    Bot.createLinkButton(lang['ETF2L Profile'], ButtonStyle.Link, `https://etf2l.org/forum/user/${etfid}`)
                )
                .addComponents(
                    Bot.createLinkButton(lang['Steam Profile'], ButtonStyle.Link, `http://steamcommunity.com/profiles/${steam_id}`)
                );

            const embed = new EmbedBuilder()
                .setTitle(playerdata.data.player.name)
                .addFields(fields)
                .setFooter({text: `${(await instance.getInstance()).footer}`})
                .setColor(0x3399ff)
                .setImage(playerdata.data.player.steam.avatar)
                .setTimestamp();
            await interaction.editReply({embeds: [embed], components: [Row]});

        } catch (err) {
            if(err.response.status === 500) {
                const field: APIEmbedField = {inline:false, name: lang['404 Not found'], value: lang['No player has been found.']};
                fields.push(field);

                const embed = new EmbedBuilder()
                    .setTitle(lang['Player lookup'])
                    .addFields(fields)
                    .setFooter({text: `${(await instance.getInstance()).footer}`})
                    .setColor(0x3399ff)
                    .setTimestamp();
                await interaction.editReply({embeds: [embed]});
            }
        }
    }
}