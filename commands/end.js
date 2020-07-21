// Cost:
//     1 DB D

module.exports = {
    name: 'end',
    description: 'Terminate a sub battle pool',
    async execute(message, args, mongoClient) {
        // TODO: Check if user has permissions
        try {
            const collection = mongoClient.db('SubBattle').collection('Pools');
            await collection.findOneAndDelete({
                guildId: message.guild.id,
                channelId: message.channel.id,
            });
            console.log('The SubBattle has ended thanks for joining!');
            res = 'The SubBattle has ended thanks for joining!';
        } catch (err) {
            console.log('Failed in db updates ' + err);
            res = 'There was a database error, contact @Blind#6910';
        } finally {
            return res;
        }
    },
};