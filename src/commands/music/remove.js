import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a song from the queue')
        .addNumberOption((option) => option.setName('songid').setDescription('Song queue position').setRequired(true)),
    name: 'remove',
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

        if (!player.queue || !player.queue.length || player.queue.length === 0) {
            return interaction.reply({ content: 'There is nothing in the queue to remove.', ephemeral: true })
        };

        let songId = interaction.options.getNumber('songid');

        if (songId > player.queue.length) {
            return interaction.reply({ content: `The queue has only ${player.queue.length} songs`, ephemeral: true })
        };

        let removedSong = await player.queue.remove(songId - 1);
        return interaction.reply({ content: `Removed \`${removedSong[0].title}\` from the queue` });
    }
}