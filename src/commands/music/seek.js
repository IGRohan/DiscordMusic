import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek/skip into a specific timestamp in the song')
        .addNumberOption((option) => option.setName('timestamp').setDescription('timestamp (in seconds)').setRequired(true)),
    name: 'seek',
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        let player = await client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: '**There is nothing playing right now.**', ephemeral: true })
        if (!interaction.member.voice.channel) return interaction.reply({ content: '**You need to be in a voice channel.**', ephemeral: true });
        if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
            return interaction.reply({ content: '**You need to be in the same voice channel as me.**', ephemeral: true })
        };

        if (!player.queue.current.isSeekable) {
            return interaction.reply({ content: `This song is not seekable`, ephemeral: true })
        };

        let seekAmount = interaction.options.getNumber('timestamp')
        await player.seek(seekAmount * 1000)
        return interaction.reply({ content: `Successfully sought ${seekAmount} seconds into the song` });
    }
}