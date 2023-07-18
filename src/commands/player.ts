import {SlashCommandBuilder, CommandInteraction, SlashCommandStringOption, EmbedBuilder, RestOrArray, APIEmbedField,} from 'discord.js';
import Instance from '../handlers/appHandler';
import lang from '../lang/en.json';
import axios from 'axios';

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
        .setDescription('Find a player by their steamID.')
        .setDescriptionLocalizations({
            'cs': 'Najdi hráče pomocí jejich steamID.'
        })
        .addStringOption(playerOptions),
    ephemeral: true,
    async execute(interaction: CommandInteraction) {
        const instance = new Instance();
        const id = interaction.options.data.find(item => item.name === 'id').value.toString();
        const fields: RestOrArray<APIEmbedField> = [];
        try {
            const response = await axios.get(`https://api-v2.etf2l.org/player/${id}`);

            const teamsNameArray = [];
            const teamsArray = [];
            response.data.player.teams.forEach(team => {
                teamsNameArray.push(team.name);
            });
            const teamsURLArray = [];
            response.data.player.teams.forEach(team => {
                teamsURLArray.push(team.id);
            });
            teamsNameArray.forEach((team, index) => {
                teamsArray.push(`[${team}](https://etf2l.org/teams/${teamsURLArray[index]})`);
            });
            const modifiedTeamsArray = teamsArray.map((item) => item.replace(/"/g, ''))
            const modifiedTeams = modifiedTeamsArray.join(', ');

            const classesArray = [];
            response.data.player.classes.forEach(className => {
                classesArray.push(className);
            });
            const modifiedClassesArray = classesArray.map((item) => item.replace(/"/g, ''))
            const modifiedClasses = modifiedClassesArray.join(', ');

            const breaker: APIEmbedField = {inline: true, name: "\u200B", value: "\u200B"};

            const name: APIEmbedField = {inline: true, name: lang['Name'], value: response.data.player.name};
            const country: APIEmbedField = {inline: true, name: lang['Country'], value: response.data.player.country};
            const teams: APIEmbedField = {inline: true, name: lang['Teams'], value: `${modifiedTeams}`};
            const classes: APIEmbedField = {inline: true, name: lang['Classes'], value: `${modifiedClasses}`};
            fields.push(name);
            fields.push(country);
            fields.push(breaker);
            fields.push(teams);
            fields.push(classes);
            fields.push(breaker);
        } catch (err) {
            if(err.response.status === 500) {
                const field: APIEmbedField = {inline:false, name: lang['404 Not found'], value: lang['No player has been found.']};
                fields.push(field);
            }
        }
        
        const embed = new EmbedBuilder()
            .setTitle(lang['Player lookup'])
            .setDescription(lang['Player info:'])
            .addFields(fields)
            .setFooter({text: `${(await instance.getInstance()).footer}`})
            .setColor(0x3399ff)
            .setTimestamp();
        await interaction.editReply({embeds: [embed]});
    }
}