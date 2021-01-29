module.exports = {
    name: 'remove',
    description: 'Remove a user from the SubBattle',
    async execute(message, args, mongoClient) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            console.log('You don\'t have permission to use that');
            return 'You don\'t have permission to use that';
        }
        const chessUsername = args[0];
        try {
            const collection = mongoClient.db('SubBattle').collection('Pools');
            const subBattlePool = await collection.findOne({
                guildId: message.guild.id,
                channelId: message.channel.id,
            });
            if (!subBattlePool.members || !subBattlePool.members.some(member => member.username === chessUsername)) {
                console.log('That user is not in the SubBattle pool');
                res = 'That user is not in the SubBattle pool';
            } else {
                await collection.updateOne(subBattlePool,
                    {
                        $pull: {
                            members: {
                                username: chessUsername,
                            },
                        }
                    });
                console.log('Removed from the SubBattle pool');
                res = 'Removed from the SubBattle pool';
            }
        } catch (err) {
            console.log('Failed in db updates ' + err);
            res = 'There was a database error, contact @Blind#6910';
        } finally {
            return res;
        }
    }
}