import {
    SlashCommandBuilder,
    CommandInteraction,
    Guild,
    PermissionFlagsBits,
    TextChannel,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    BaseGuildVoiceChannel,
} from 'discord.js';
import dotenv from 'dotenv';
import Bot from '../handlers/botHandler';
import _Instance from '../handlers/appHandler';
import lang from '../lang/cs.json';
import {db} from '../handlers/databaseHandler';

dotenv.config();
const config = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configure')
        .setNameLocalizations({
            'cs': 'konfigurace'
        })
        .setDescription('Automatic server configuration.')
        .setDescriptionLocalizations({
            'cs': 'Automatická konfigurace serveru.'
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    ephemeral: true,
    async execute(interaction: CommandInteraction) {
        const Client = Bot.client;
        const Guild: Guild = interaction.guild;
        const defaultRoles = config.DEFAULT_ROLES.split(',');

        /* Checking and Updating User Roles to Default Values */
        try {
            defaultRoles.forEach(role => {
                if(!Guild.roles.cache.get(role)) throw Error;

                Guild.members.fetch().then(members => {
                    members.forEach(async member => {
                        if (member.pending === false && !member.user.bot && !member.roles.cache.has(role)) {
                            await member.roles.add(role);
                            await interaction.editReply({embeds: [await Bot.createEmbed(lang['Configuring your server settings.'], `${member.user.username}${lang['\'s roles have been updated.']}`, 0x3399ff)]});
                        }
                    });
                });
            });
        } catch {
            await interaction.editReply({embeds: [await Bot.createEmbed(lang['Configuring your server settings.'], lang['Oh no! Seems like one of the default roles does not exist.'], 0xdb6262)]});
        };

        /* Clearing Ticket Action Button Message !(if exists) */
        const TicketChannel : TextChannel = Client.channels.resolve(config.TICKETS_CREATION_ID) as TextChannel;

        if(TicketChannel) {
            TicketChannel.bulkDelete(1).catch(console.error);
        }

        /* Creating Ticket Action Button */
        const Row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
                Bot.createButton('CreateTicket', lang['Create Ticket'], ButtonStyle.Primary, '📩')
			);

        await TicketChannel.send({embeds: [
            await Bot.createEmbed(lang['Support System'], 'If you require support, please press the button below.\n\n**Be Aware!**\n*If you require support outside of active hours, chances are your request will not be answered!*\n\n**Active hours:** `13:00` - `18:30` (GMT+1)', 0x3399ff)
        ], components: [
            Row
        ]});

        /* Creating guild population channel */
        var queryString = 'SELECT user_count FROM guilds WHERE guild_id = ?';
        const [user_count] = await db.promise().query(queryString, Guild.id);

        if(user_count[0]['user_count']) {
            queryString = 'SELECT user_count_id FROM guilds WHERE guild_id = ?';
            const [user_count_id] = await db.promise().query(queryString, Guild.id);

            const user_count_channel = Guild.channels.resolve(user_count_id[0]['user_count_id']);

            if(user_count_channel === null || user_count_id[0]['user_count_id'] === null) {
                queryString = 'UPDATE guilds SET user_count_id = ? WHERE guild_id = ?';
                Guild.channels.create({ 
                    name:`📊﹕${Guild.memberCount} Members`, 
                    type: ChannelType.GuildVoice, 
                    permissionOverwrites: [
                        {
                            id: Guild.roles.everyone, 
                            deny: [
                                PermissionFlagsBits.Connect, 
                                PermissionFlagsBits.SendMessages
                            ]
                        }
                    ] 
                }).then((channel) => {
                    db.query(queryString, [channel.id, Guild.id], async (err) => {
                        if (err) {console.error(err)};

                        await interaction.editReply({embeds: [await Bot.createEmbed(lang['Configuring your server settings.'], lang['Creating user count channel.'], 0x3399ff)]});
                    });
                });
            } else {
                user_count_channel.setName(`📊﹕${Guild.memberCount} Members`);
            }
        } else {
            
        }
        
        
        /* Sending confirmation message when configuration is done */
        setTimeout(async () => {
            await interaction.editReply({embeds: [await Bot.createEmbed(lang['Server is ready to use.'], lang['The new configuration has been successfully applied.'], 0x14e069)]});
        }, 500);
    }
}