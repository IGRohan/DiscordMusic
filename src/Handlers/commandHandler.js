import fs from 'fs';
import { REST, Routes } from 'discord.js';

const { TOKEN, CLIENT_ID, TEST_GUILD_ID } = process.env;

const commandHandler = (client) => {
    client.handleCommands = async () => {
        const commandFolder = fs.readdirSync('./src/commands');
        for (const folder of commandFolder) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`);
            for await (const file of commandFiles) {
                let command = await import(`../commands/${folder}/${file}`);
                command = command.default;
                client.commands.set(command.data.name, command);
                client.commandsArray.push(command.data.toJSON());
            }
        };

        const rest = new REST({ version: '10' }).setToken(TOKEN)


        console.log(`Starting to load application (/) commands!`)
        if (!TEST_GUILD_ID) {
            await rest.put(Routes.applicationCommands(CLIENT_ID), { body: client.commandsArray });
        } else {
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID), {
                body: client.commandsArray
            });
        }
        console.log(`Successfully loaded application (/) commands`)
    }
}

export default commandHandler;