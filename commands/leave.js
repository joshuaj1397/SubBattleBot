// Cost:
//     1 DB R
//     1 DB U

module.exports = {
    name: 'leave',
    description: 'Leave a sub battle pool',
    async execute(message, args, mongoClient) {
        // TODO: Check if user has permissions
        const chessUsername = args[0];
        try {
            const collection = mongoClient.db('SubBattle').collection('Pools');
            const subBattlePool = await collection.findOne({
                guildId: message.guild.id,
                channelId: message.channel.id,
            });
            if (!subBattlePool.members.some(member => member.username === chessUsername || member.discordUserId === message.author.id)) {
                console.log('That user is not in the SubBattle pool');
                res = 'That user is not in the SubBattle pool';
            } else {
                await collection.updateOne(subBattlePool,
                    {
                        $pull: {
                            members: {
                                discordUserId: message.author.id,
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
    },
};