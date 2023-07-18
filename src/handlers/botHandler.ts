import Discord, {ButtonBuilder, ButtonStyle, Client, ColorResolvable, EmbedBuilder, Emoji, GatewayIntentBits, GuildEmoji, GuildMember } from 'discord.js';
import _Instance from './appHandler';

export default class Bot {
    public static client : Client = new Discord.Client(
        {
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers
            ]
        }
    );
    
    public static setActivity = (message: string, type: Discord.ActivityType.Playing | Discord.ActivityType.Streaming | Discord.ActivityType.Listening | Discord.ActivityType.Watching | Discord.ActivityType.Competing) => this.client.user.setActivity(message, {type: type});

    public static createEmbed = async (title: string, message: string, color: ColorResolvable) => {
        const Instance = new _Instance();

        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(message)
            .setFooter({text: (await Instance.getInstance()).footer})
            .setColor(color)
            .setTimestamp();
    }

    public static createEmbedAuthor = async (title: string, message: string, color: ColorResolvable, author: GuildMember) => {
        const Instance = new _Instance();

        return new EmbedBuilder()
            .setAuthor({name: author.user.username, iconURL: author.user.avatarURL()})
            .setTitle(title)
            .setDescription(message)
            .setFooter({text: (await Instance.getInstance()).footer})
            .setColor(color)
            .setTimestamp();
    }

    public static createButton = (customID: string, label: string, style: ButtonStyle, emoji: string) => {
        return new ButtonBuilder()
            .setCustomId(customID)
            .setLabel(label)
            .setStyle(style)
            .setEmoji(emoji)
    }

    public static currentDateMillisecondsToUUID(): string {
        const milliseconds = Date.now().toString(18);
        var result = '';

        for (let i = 0; i < milliseconds.length; i++) {

            result += milliseconds[i].toUpperCase();

            if (i % 4 === 3 && i !== milliseconds.length - 1) {
              result += '-';
            }
          }
      

        return `${result}`;
      }
}