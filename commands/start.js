// Cost:
//     1 DB R
//     1 DB C

module.exports = {
    name: 'start',
    description: 'Create a sub battle pool',
    async execute(message, args, mongoClient) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            console.log('You don\'t have permission to use that');
            return 'You don\'t have permission to use that';
        }
        let poolId = "";
        let res = "";
        let opponent = args[0] ? args[0] : null;
        try {
            const collection = mongoClient.db('SubBattle').collection('Pools');
            let doc = await collection.findOne({
                guildId: message.guild.id,
                channelId: message.channel.id,
            });
            if (doc == null) {
                await collection.insertOne({
                    guildId: message.guild.id,
                    channelId: message.channel.id,
                    creator: message.member.id,
                    opponent: opponent
                });
                console.log('Your SubBattle ID is ' + poolId);
                res = 'Your SubBattle ID is ' + poolId;
            } else {
                console.log('A Sub Battle pool already exists for this channel and server');
                res = 'A Sub Battle pool already exists for this channel and server';
            }
        } catch (err) {
            console.log('Failed in db updates ' + err);
            res = 'There was a database error, contact @Blind#6910';
        } finally {
            return res;
        }
    },
};