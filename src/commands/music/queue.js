import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Player } from 'erela.js';
import progressBar from '../../utils/progressBar.js';
import prettyMilliseconds from 'pretty-ms';
import _ from 'lodash';
import buttonPages from '../../utils/pagination.js';

export default {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display list of songs in the queue'),
    name: 'queue',
    /**
     *  
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        /** @type {Player} */
        let player = await client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: '**There is nothing playing right now.**', ephemeral: true });

        if (!player.queue || !player.queue.length || player.queue === 0) {
            let nowPlayingEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Now Playing' })
                .setDescription(`[${player.queue.current.title}](${player.queue.current.uri})`)
                .addFields(
                    { name: 'Requested By', value: `${player.queue.current.requester}`, inline: true },
                    {
                        name: 'Duration', value: `${progressBar(player.position, player.queue.current.duration, 15).Bar}
                \`[${prettyMilliseconds(player.position, { colonNotation: true, })} / ${prettyMilliseconds(player.queue.current.duration, { colonNotation: true, })}]\``
                    }
                )
                .setThumbnail(player.queue.current.displayThumbnail())
                .setColor('Random')

            await interaction.reply({ embeds: [nowPlayingEmbed] });
            return;
        }

        let songs = player.queue.map((track, index) => {
            track.index = index;
            return track;
        });

        let chunkedSongs = _.chunk(songs, 10);

        let embeds = [];

        chunkedSongs.map((tracks) => {
            let songsDescription = tracks.map((t) => `\`${t.index + 1}.\` [${t.title}](${t.uri}) \n\`${prettyMilliseconds(t.duration,
                { colonNotation: true })}\` **|** Requested by: ${t.requester}\n`
            ).join("\n");

            let embed = new EmbedBuilder()
                .setAuthor({ name: 'Queue' })
                .setDescription(`**Currently Playing:** \n[${player.queue.current.title}](${player.queue.current.uri}) \n\n**Up Next:** \n${songsDescription}\n\n`)
                .addFields(
                    { name: 'Total songs: \n', value: `\`${player.queue.totalSize - 1}\``, inline: true },
                    { name: 'Total Length: \n', value: `\`${prettyMilliseconds(player.queue.duration, { colonNotation: true })}\``, inline: true },
                    { name: 'Requested By', value: `${player.queue.current.requester}`, inline: true },
                    {
                        name: 'Current Song Duration: \n', value: `${progressBar(player.postion, player.queue.current.duration, 15).Bar} 
                    \`${prettyMilliseconds(player.position, { colonNotation: true })}\` / \`${prettyMilliseconds(player.queue.current.duration, { colonNotation: true })}\``, inline: true
                    }
                )
                .setThumbnail(player.queue.current.displayThumbnail())
                .setColor('Random')

            embeds.push(embed)
        });

        buttonPages(interaction, embeds);
    }
}