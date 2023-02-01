import { BaseInteraction } from 'discord.js';

export default {
    name: 'interactionCreate',
    /**
     * @param {BaseInteraction} interaction 
    */
    async execute(client, interaction) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(client, interaction)
            } catch (error) {
                console.log(error)
                interaction.reply({ content: 'Something went wrong', ephemeral: true })
            }
        }
    }
}