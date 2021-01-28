// Cost:
//     1 DB D

module.exports = {
    name: 'end',
    description: 'Terminate a sub battle pool',
    async execute(message, args, mongoClient) {
        // TODO: Check if user has permissions
        try {
            const collection = mongoClient.db('SubBattle').collection('Pools');
            const subBattlePool = await collection.findOne({
                guildId: message.guild.id,
                channelId: message.channel.id,
            });
            const res = subBattlePool ? 'The SubBattle has ended thanks for joining!' : 'There is no active SubBattle.';
            if (subBattlePool) {
                await collection.delete(subBattlePool);
            }
            console.log(res);
        } catch (err) {
            console.log('Failed in db updates ' + err);
            res = 'There was a database error, contact @Blind#6910';
        } finally {
            return res;
        }
    },
};