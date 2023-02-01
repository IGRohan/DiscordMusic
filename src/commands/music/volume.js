import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set volume')
        .addNumberOption((option) => option.setName('volume').setDescription('New volume')),
    name: 'volume',
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

        let volume = interaction.options.getNumber('volume');
        if (!volume) return interaction.reply({ content: `Volume is currently set to \`${player.volume}\``, ephemeral: true })
        if (volume > 100 || volume < 1) {
            return interaction.reply(`Volume can only be set from 1 to 100`)
        };
        await player.setVolume(volume)

        return interaction.reply({ content: `Volume was successfully set to ${player.volume}` });
    }
}