import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Array} pages 
 * @param {Number} time 
 */
async function buttonPages(interaction, pages, time = 15000) {
    await interaction.deferReply();

    if (pages.length === 1) {
        const page = await interaction.editReply({
            embeds: pages,
            components: [],
            fetchReply: true
        });

        return page;
    };

    const prev = new ButtonBuilder()
        .setCustomId('prev')
        .setEmoji('⬅')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true)

    const next = new ButtonBuilder()
        .setCustomId('next')
        .setEmoji('➡')
        .setStyle(ButtonStyle.Primary)

    const buttonRow = new ActionRowBuilder().addComponents(prev, next);
    let index = 0;

    const currentPage = await interaction.editReply({
        embeds: [pages[index]],
        components: [buttonRow],
        fetchReply: true
    });

    const collector = currentPage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time
    });

    collector.on('collect', async (i) => {
        if (i.user.id !== interaction.user.id) {
            return i.reply({
                content: `You can't use these buttons`,
                ephemeral: true
            })
        };

        await i.deferUpdate();

        if (i.customId === 'prev') {
            if (index > 0) index--;
        } else if (i.customId === 'next') {
            if (index < pages.length - 1) index++;
        };

        if (index === 0) prev.setDisabled(true)
        else prev.setDisabled(false);

        if (index === pages.length - 1) next.setDisabled(true)
        else next.setDisabled(false);

        await currentPage.edit({
            embeds: [pages[index]],
            components: [buttonRow]
        });

        collector.resetTimer();
    });

    collector.on('end', async (i) => {
        await currentPage.edit({
            embeds: [pages[index]],
            components: []
        });
    });
    return currentPage;
}

export default buttonPages;