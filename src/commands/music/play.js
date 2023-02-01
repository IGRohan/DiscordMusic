import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
import { Player } from 'erela.js';
import prettyMilliseconds from 'pretty-ms';

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song or add it in the queue')
        .addStringOption((option) => option.setName('songquery').setDescription('Song name/url').setRequired(true)),
    name: 'play',
    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const voiceChan = interaction.member.voice.channel;
        if (!voiceChan) return interaction.reply({ content: 'You need to be in a voice channel to play music.', ephemeral: true })

        let searchQuery = interaction.options.getString('songquery');
        /** @type {Player} */
        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: true
        });
        if (player.state != 'CONNECTED') player.connect();

        try {
            let searchRes = await player.search(searchQuery, interaction.member);
            if (searchRes.loadType === 'NO_MATCHES') {
                let noResultEmbed = new EmbedBuilder()
                    .setDescription(`No result found for ${searchQuery}`)
                    .setColor('Random')

                return interaction.reply({ embeds: [noResultEmbed], ephemeral: true })
            } else if (searchRes.loadType === 'PLAYLIST_LOADED') {
                player.queue.add(searchRes.tracks);
                if (!player.playing && !player.paused && player.queue.totalSize === searchRes.tracks.length) player.play();
                const playlistAddedEmbed = new EmbedBuilder()
                    .setAuthor({ name: 'Playlist added to Queue' })
                    .setThumbnail(searchRes.tracks[0].displayThumbnail())
                    .setDescription(`[${searchRes.playlist.name}](${searchRes.playlist.name})`)
                    .addFields(
                        { name: 'Enqueued', value: `\`${searchRes.tracks.length}\` songs.`, inline: true },
                        { name: 'Playlist Duration', value: `\`${prettyMilliseconds(searchRes.playlist.duration, { colonNotation: true })}\`` }
                    )
                    .setColor('Random')

                return interaction.reply({ embeds: [playlistAddedEmbed] })
            } else {
                player.queue.add(searchRes.tracks[0]);
                if (!player.playing && !player.paused && !player.queue.size) await player.play()

                let trackAddedEmbed = new EmbedBuilder()
                    .setAuthor({ name: 'Added to Queue' })
                    .setDescription(`[${searchRes.tracks[0].title}](${searchRes.tracks[0].uri})`)
                    .addFields({ name: 'Author', value: searchRes.tracks[0].author, inline: true })
                    .setColor('Random')

                if (player.queue.totalSize > 1) {
                    trackAddedEmbed.addFields({ name: 'Position in queue', value: `${player.queue.size - 0}`, inline: true });
                }

                return interaction.reply({ embeds: [trackAddedEmbed] });
            }
        } catch (error) {
            console.log(error)
            return interaction.reply({ content: 'Something went wrong', ephemeral: true })
        }
    }
}