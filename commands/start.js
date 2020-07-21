// Cost:
//     1 DB R
//     1 DB C

module.exports = {
    name: 'start',
    description: 'Create a sub battle pool',
    async execute(message, args, mongoClient) {
        // TODO: Check if user has permissions
        let poolId = "";
        let res = "";
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
                    opponent: args[0], // Optional opponent pool Id
                    creator: message.member.id,
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