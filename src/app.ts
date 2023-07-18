/* COLOR PALLETE
 * Hub Primary     0x3399ff
 * Hub Sucessfull  0x14e069
 * Hub Alert       0xdb6262
*/

import Discord from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import Commands from './handlers/commandHandler';
import Bot from './handlers/botHandler';


dotenv.config();
const config = process.env;
const bot = Bot.client;

bot.commands = new Discord.Collection();
const commands = new Commands();

const commandFiles = fs.readdirSync(__dirname + '/commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
    if(file === "configure.ts") {
        
    } else {
        const command = require(`./commands/${file}`);
        console.log(`command ${file} has been registered`);
        commands.addCommand(command.data.toJSON());
        bot.commands.set(command.data.name, command);
    }
}

const eventsFiles = fs.readdirSync(__dirname + '/events').filter(f => f.endsWith('.js'));
for (const file of eventsFiles) {
    const event = require(`./events/${file}`);
    console.log(`event ${file} has been registered`);
    if (event.once) {
        bot.once(event.name, (...args) => event.execute(...args));
    } else {
        bot.on(event.name, (...args) => event.execute(...args));
    }
}

try {
    bot.login(config.TOKEN)
        .then(() => {
            console.info('successfully logged into Discord API');
        })
} catch (error) {
    console.error(error);
}
