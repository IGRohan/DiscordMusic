import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import progressBar from '../../utils/progressBar.js';
import prettyMilliseconds from 'pretty-ms';

export default {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Shows details of the currently playing song.'),
    name: 'nowplaying',
    /**
     *  
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        let player = await client.manager.get(interaction.guild.id);

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
}