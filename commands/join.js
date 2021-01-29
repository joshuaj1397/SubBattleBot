// Cost:
//     1 DB R
//     1 DB U
//     1 chessAPI call

module.exports = {
    name: 'join',
    description: 'Join a sub battle pool',
    async execute(message, args, mongoClient, chessAPI) {        
        const chessUsername = args[0];
        if (!chessUsername) {
            console.log('Enter a chess.com username');
            return 'Enter a chess.com username';
        }
        let playerStats;
        let chessErr;
        await chessAPI.getPlayerStats(chessUsername).then(res => {
            playerStats = res.body;
        }, err => {
            if (err) {
                chessErr = err;
            }
        });
        if (!playerStats) {
            switch (chessErr.statusCode) {
                case 404:
                    console.log('Chess user not found');
                    return 'Chess user not found';
                default:
                    console.log('Chess API Error ' + err);
                    return 'Chess API is broken :(';
            }
        }
        if (playerStats.chess_blitz) {
            normalizedPlayerStats = {
                username: chessUsername,
                rating: playerStats.chess_blitz.last.rating,
                discordUserId: message.author.id,
                discordUserName: message.author.username
            }
        } else {
            console.log('You are unrated in blitz');
            return 'You are unrated in blitz';
        }
        
        // TODO: Check sandbagging
        try {
            const collection = mongoClient.db('SubBattle').collection('Pools');
            const subBattlePool = await collection.findOne({
                guildId: message.guild.id,
                channelId: message.channel.id,
            });
            // If theres no one in the pool or the user hasn't entered via chess.com username or discord add them to the pool
            if (subBattlePool.members && subBattlePool.members.some(member => member.username === chessUsername || member.discordUserId === message.author.id)) {
                console.log('You are already in the SubBattle pool');
                res = 'You are already in the SubBattle pool';
            } else {
                await collection.updateOne(subBattlePool,
                    {
                        $push: {
                            members: {
                                $each: [normalizedPlayerStats],
                                $sort: { rating: -1 },
                            }
                        },
                    });
                console.log('Joined SubBattle pool')
                res = 'Joined SubBattle pool';
            }
        } catch (err) {
            console.log('Failed in db updates ' + err);
            res = 'There was a database error, contact @Blind#6910';
        } finally {
            return res;
        }
    },
};