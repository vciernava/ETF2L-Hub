import {
    SlashCommandBuilder,
    CommandInteraction,
    EmbedBuilder,
    RestOrArray,
    APIEmbedField,
    SlashCommandNumberOption
} from 'discord.js';
import Commands from '../handlers/commandHandler';
import Instance from '../handlers/appHandler';
import lang from '../lang/cs.json';

const paginationOption: SlashCommandNumberOption = new SlashCommandNumberOption()
    .setName('page')
    .setNameLocalizations({
        'cs': 'stránka'
    })
    .setDescription('Select page number')
    .setDescriptionLocalizations({
        'cs': 'Vyberte číslo stránky'
    })
    .setRequired(false);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setNameLocalizations({
            'cs': 'pomoc'
        })
        .setDescription('Display of all available commands.')
        .setDescriptionLocalizations({
            'cs': 'Zobrazení všech dostupných příkazů.'
        })
        .addNumberOption(paginationOption),
    ephemeral: true,
    async execute(interaction: CommandInteraction) {
        const instance = new Instance();
        const commands = Commands.commands;
        const numberOfItems = commands.length;
        const showPerPage = 9;

        const countPages = Math.ceil((numberOfItems / showPerPage));
        let currentPage = 1;
        if (interaction.options.data.length != 0) {
            currentPage = Number(interaction.options.data.find(item => item.name === 'page').value);
            currentPage = currentPage == 0 ? 1 : currentPage;
        }
        const startFrom = (currentPage - 1) * showPerPage;
        const endAt = startFrom + showPerPage;
        const fields: RestOrArray<APIEmbedField> = [];

        if(countPages < currentPage) {
            const field: APIEmbedField = {inline:false, name: lang['404 Not found'], value: lang['There are no more commands found...']};
            fields.push(field);
        }
        for (let i = startFrom; i < endAt && i < commands.length; i++) {
            if(commands[i].default_member_permissions === undefined) {
                const field: APIEmbedField = {inline: true, name: commands[i].name, value: commands[i].description};
                fields.push(field);
            } else if(interaction.memberPermissions.has(commands[i].default_member_permissions)) {
                const field: APIEmbedField = {inline: true, name: commands[i].name, value: commands[i].description};
                fields.push(field);
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(lang['Need support? Message me.'])
            .setDescription(lang['All available commands:'])
            .addFields(fields)
            .setFooter({text: `${lang.Page} ${currentPage}/${countPages} - ${(await instance.getInstance()).footer}`})
            .setColor(0x3399ff)
            .setTimestamp();
        await interaction.editReply({embeds: [embed]});
    }
}