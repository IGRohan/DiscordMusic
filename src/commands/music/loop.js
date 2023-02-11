import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription("Sets the currently playing song on loop"),
    name: 'loop',
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

        if (player.trackRepeat) {
            player.setTrackRepeat(false);
            return await interaction.reply({ content: `Song loop has been disabled.` })
        } else {
            player.setTrackRepeat(true);
            return await interaction.reply({ content: `Song loop has been enabled.` })
        }
    }
}