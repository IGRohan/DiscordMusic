export default {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} has Logged in`);
        client.manager.init(client.user.id);
    }
}