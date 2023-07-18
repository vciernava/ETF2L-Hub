import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from 'discord.js';
import dotenv from 'dotenv';
import lang from '../lang/cs.json';

dotenv.config();
const config = process.env;

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction: ButtonInteraction) => {
        const Modal = new ModalBuilder()
            .setCustomId('SubmitTicket')
            .setTitle(lang['Support System']);

        const subjectInput = new TextInputBuilder()
            .setCustomId('ticketSubjectInput')
            .setLabel(lang['Ticket subject'])
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const descriptionInput = new TextInputBuilder()
			.setCustomId('ticketDescriptionInput')
			.setLabel(lang['Describe your problem'])
			.setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(subjectInput) as ActionRowBuilder<TextInputBuilder>;
        const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput) as ActionRowBuilder<TextInputBuilder>;

        Modal.addComponents(firstActionRow, secondActionRow);
    }
}