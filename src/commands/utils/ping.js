import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the response time of the bot'),
    name: 'ping',
    async execute(client, interaction) {
        interaction.reply({ content: `Bot's response time is ${client.ws.ping}ms` })
    }

}