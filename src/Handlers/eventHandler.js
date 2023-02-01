import fs from 'fs';

const eventHandler = (client) => {
    client.handleEvents = async () => {
        const eventFolder = fs.readdirSync(`./src/events`).filter(file => file.endsWith('.js'));
        for (const files of eventFolder) {
            let event = await import(`../events/${files}`);
            event = event.default;
            if (event.once) {
                client.once(event.name, (...args) => event.execute(client, ...args))
            } else {
                client.on(event.name, (...args) => event.execute(client, ...args))
            }
        }
    }
};

export default eventHandler;