import { Client, GatewayIntentBits, Collection, EmbedBuilder } from 'discord.js';
import 'dotenv/config';
import fs from 'fs';
import { Manager } from 'erela.js';

const { TOKEN, LAVALINK_HOST, LAVALINK_PASSWORD, LAVALINK_PORT } = process.env;
const { Guilds, GuildMessages, GuildVoiceStates } = GatewayIntentBits;
const client = new Client({ intents: [Guilds, GuildMessages, GuildVoiceStates] });

client.commands = new Collection();
client.commandsArray = [];
client.events = new Collection();

let nodes = [
    {
        host: LAVALINK_HOST,
        password: LAVALINK_PASSWORD,
        port: parseInt(LAVALINK_PORT),
        secure: true
    }
];

const manager = new Manager({
    nodes,
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload)
    }
});
client.manager = manager;

(async () => {
    try {
        const handlerFiles = fs.readdirSync('./src/Handlers').filter(file => file.endsWith('.js'));
        for (const files of handlerFiles) {
            const file = await import(`./Handlers/${files}`);
            file.default(client);
        };

        client.handleEvents();
        client.handleCommands();

    } catch (error) {
        console.error(error);
    }
})();

client.on('raw', d => client.manager.updateVoiceState(d))

client.login(TOKEN);

// Music events
manager
    .on('nodeConnect', (node) => {
        console.log(`Node ${node.options.identifier} connected!`)
    })
    .on("nodeError", (node, error) => {
        console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
    })
    .on('trackStart', (player, track) => {
        let trackStartEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Now Playing:' })
            .setThumbnail(player.queue.current.displayThumbnail())
            .setDescription(`[${track.title}](${track.uri})`)
            // .addFields({ name: "Duration", value: track.duration })
            .setColor("Random")

        client.channels.cache.get(player.textChannel).send({ embeds: [trackStartEmbed] })
    })
    .on('queueEnd', () => { return })
