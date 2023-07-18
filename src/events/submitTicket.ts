import {ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, Guild, GuildMember, ModalSubmitInteraction} from 'discord.js';
import Bot from '../handlers/botHandler';
import dotenv from 'dotenv';
import lang from '../lang/cs.json';

dotenv.config();
const config = process.env;

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction: ModalSubmitInteraction) => {
        if(interaction.isModalSubmit && interaction.customId === 'SubmitTicket') {
            const guild: Guild = interaction.guild;
            const ticketUser = interaction.member as GuildMember;
            const ticketCategory = guild.channels.resolve(config.TICKETS_CATEGORY_ID) as CategoryChannel;
            const ticketCategoryChild = ticketCategory.children;
            const interactionFields = interaction.fields;
            const ticketChannel = ticketCategoryChild.create({ 
                name: `🟢・${Bot.currentDateMillisecondsToUUID()}`,
                type: ChannelType.GuildText,
                topic: interactionFields.getTextInputValue('ticketSubjectInput'),
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        deny: ['ViewChannel', 'SendMessages']
                    }
                ]
            });

            const Row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
                Bot.createButton('CloseTicket', lang['Close Ticket'], ButtonStyle.Primary, '🔒')
			);

            if(guild.roles.cache.get(config.SUPPORT_ROLE)) {
                (await ticketChannel).permissionOverwrites.create(config.SUPPORT_ROLE , {
                    ViewChannel: true,
                    SendMessages: true
                });
            } else {
                await interaction.reply({embeds: [await Bot.createEmbed(lang['Support System'], lang['Sorry. but there was an error while submitting your ticket!\n\n Please contact bot developer about this issue.'], 0xdb6262)], ephemeral: true});
            }

            (await ticketChannel).permissionOverwrites.create(ticketUser, {
                ViewChannel: true,
                SendMessages: true
            }).then(async () => {
                await interaction.reply({embeds: [await Bot.createEmbed(lang['Support System'], `${lang['Your ticket has been successfully submitted!\nYou can check your ticket status at']} <#${(await ticketChannel).id}>`, 0x14e069)], ephemeral: true});
                await (await ticketChannel).send({embeds: [await Bot.createEmbedAuthor(interactionFields.getTextInputValue('ticketSubjectInput'), interactionFields.getTextInputValue('ticketDescriptionInput'), 0x3399ff, ticketUser)], components: [Row]});
            })
            .catch(async () => {
                await interaction.reply({embeds: [await Bot.createEmbed(lang['Support System'], lang['Sorry. but there was an error while submitting your ticket!\n\n Please contact bot developer about this issue.'], 0xdb6262)], ephemeral: true});
            });
        }
    }
}