import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip to the next song'),
    name: 'skip',
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        let player = await client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: '**There is nothing playing right now.**', ephemeral: true })
        if (!interaction.member.voice.channel) return interaction.reply({ content: '**You need to be in a voice channel.**', ephemeral: true });
        if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
            return interaction.reply({ content: '**You need to be in the same voice channel as me.**', ephemeral: true })
        };

        await player.stop();
        return interaction.reply({ content: 'Skipped', ephemeral: true })
    }
}