module.exports = {
    name: 'remove',
    description: 'Remove a user from the SubBattle',
    async execute(message, args, mongoClient) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            console.log('You don\'t have permission to use that');
            return 'You don\'t have permission to use that';
        }
        // If user is in SubBattle delete them, otherwise return not found
    }
}