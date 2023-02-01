import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the song currently paused.'),
    name: 'resume',
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const player = await client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: '**There is nothing playing right now.**', ephemeral: true })
        if (!interaction.member.voice.channel) return interaction.reply({ content: '**You need to be in a voice channel.**', ephemeral: true });
        if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
            return interaction.reply({ content: '**You need to be in the same voice channel as me.**', ephemeral: true })
        }
        if (player.playing) return interaction.reply({ content: '**The music is not paused.**', ephemeral: true })
        player.pause(false);
        await interaction.reply({ content: 'Resumed', ephemeral: true })
        return;
    }
}