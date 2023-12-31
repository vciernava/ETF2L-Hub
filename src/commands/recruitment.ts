import {SlashCommandBuilder, CommandInteraction, SlashCommandStringOption, APIEmbedField, RestOrArray, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandIntegerOption} from 'discord.js';
import Instance from '../handlers/appHandler';
import axios from 'axios';
import Bot from '../handlers/botHandler';
const wait = require('node:timers/promises').setTimeout;

const countryOptions: SlashCommandStringOption = new SlashCommandStringOption()
    .setName('country')
    .setDescription('Sort by country')
    .setRequired(false)
    .addChoices(
        { name: 'Czech Republic', value: "czechrepublic" },
        { name: 'Poland', value: "poland" },
        { name: 'Sweden', value: "sweden" },
        { name: 'Germany', value: "germany" },
        { name: 'France', value: "france" },
        { name: 'Russia', value: "russia" },
        { name: 'European', value: "european" },
        { name: 'International', value: "international" },
    )
const typeOptions: SlashCommandStringOption = new SlashCommandStringOption()
.setName('type')
.setDescription('Sort by type')
.setRequired(false)
.addChoices(
    { name: 'Highlander', value: "Highlander" },
    { name: '6v6', value: "6v6" },
)
const skillOptions: SlashCommandStringOption = new SlashCommandStringOption()
.setName('skill')
.setDescription('Sort by skill')
.setRequired(false)
.addChoices(
    { name: 'Open', value: "Open" },
    { name: 'Low', value: "Low" },
    { name: 'Mid', value: "Mid" },
    { name: 'High', value: "High" },
    { name: 'Prem', value: "Prem" },
)
const classOptions: SlashCommandStringOption = new SlashCommandStringOption()
.setName('class')
.setDescription('Sort by class')
.setRequired(false)
.addChoices(
    { name: 'Scout', value: "Scout" },
    { name: 'Soldier', value: "Soldier" },
    { name: 'Pyro', value: "Pyro" },
    { name: 'Demoman', value: "Demoman" },
    { name: 'Heavy', value: "Heavy" },
    { name: 'Engineer', value: "Engineer" },
    { name: 'Medic', value: "Medic" },
    { name: 'Sniper', value: "Sniper" },
    { name: 'Spy', value: "Spy" },
)
const limitOptions: SlashCommandIntegerOption = new SlashCommandIntegerOption()
.setName('limit')
.setDescription('How many do you want to feed?')
.setMinValue(1)
.setMaxValue(10)
.setRequired(true)
.addChoices(
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '5', value: 5 },
    { name: '6', value: 6 },
    { name: '7', value: 7 },
    { name: '8', value: 8 },
    { name: '9', value: 9 },
    { name: '10', value: 10 },
)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recruitment')
        .setNameLocalizations({
            'cs': 'nábor',
            'pl': 'rekrutacja'
        })
        .setDescription('Easily recruit players into your team.')
        .setDescriptionLocalizations({
            'cs': 'Jednoduše naber hráče do svého týmu.',
            'pl': 'Z łatwością rekrutuj graczy do swojego zespołu.'
        })
        .addIntegerOption(limitOptions)
        .addStringOption(typeOptions)
        .addStringOption(countryOptions)
        .addStringOption(classOptions)
        .addStringOption(skillOptions),
    ephemeral: true,
    async execute(interaction: CommandInteraction) {
        const instance = new Instance();
        const lang = await instance.getLangFiles(interaction.locale);

        const country = interaction.options.data.find(item => item.name === 'country')?.value ?? '';
        const type = interaction.options.data.find(item => item.name === 'type')?.value ?? '';
        const classp = interaction.options.data.find(item => item.name === 'class')?.value ?? '';
        const skill = interaction.options.data.find(item => item.name === 'skill')?.value ?? '';
        const limit = interaction.options.data.find(item => item.name === 'limit')?.value ?? 5;

        
        const recuritmentdata = await axios.get(`https://api-v2.etf2l.org/recruitment/players?country=${country}&type=${type}&class=${classp}&skill=${skill}`);
        await interaction.editReply({content: "Fetching..."});

        const recruitmentData = recuritmentdata.data.recruitment.data;

        for (const [index, recruitment] of recruitmentData.entries()) {
            if(index+1 > limit) {
                break
            }

            const fields: RestOrArray<APIEmbedField> = [];
        
            const playerdata = await axios.get(recruitment.urls.player);
            const id = playerdata.data.player.id;
            const steam_id = playerdata.data.player.steam.id64;

            const classesArray = [];
            recruitment.classes.forEach(className => {
                classesArray.push(className);
            });
            const modifiedClassesArray = classesArray.map((item) => item.replace(/"/g, ''))
            const modifiedClasses = modifiedClassesArray.join(', ');

            const forumId: APIEmbedField = {inline: true, name: lang['ETF2L ID'], value: `${id}`};
            const country: APIEmbedField = { inline: true, name: lang['Country'], value: playerdata.data.player.country };
            const type: APIEmbedField = { inline: true, name: lang['Type'], value: recruitment.type };
            const classes: APIEmbedField = {inline: true, name: lang['Classes'], value: `${modifiedClasses}`};
            const skill: APIEmbedField = { inline: true, name: lang['Skill'], value: recruitment.skill };
            fields.push(forumId);
            fields.push(country);
            fields.push(type);
            fields.push(classes);
            fields.push(skill);
    
            const Row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    Bot.createLinkButton(lang['View Recruitment'], ButtonStyle.Link, recruitment.urls.recruitment)
                )
                .addComponents(
                    Bot.createLinkButton(lang['ETF2L Profile'], ButtonStyle.Link, `https://etf2l.org/forum/user/${id}`)
                )
                .addComponents(
                    Bot.createLinkButton(lang['Steam Profile'], ButtonStyle.Link, `http://steamcommunity.com/profiles/${steam_id}`)
                );
    
            const embed = new EmbedBuilder()
                .setTitle(`${recruitment.name} (${index+1}/${limit})`)
                .addFields(fields)
                .setFooter({ text: `${(await instance.getInstance()).footer}` })
                .setColor(0x3399ff)
                .setImage(recruitment.steam.avatar)
                .setTimestamp();

            await wait(2000);
            await interaction.followUp({ ephemeral: true, embeds: [embed], components: [Row] });
        }
        await interaction.editReply({content: "Fetched..."});
    }
}