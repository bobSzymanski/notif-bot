import Discord from 'discord.js';
const client = new Discord.Client();

const health_threshold_ms = 10000;
const secret_token = process.env.DISCORD_SECRET_TOKEN;
const DISCONNECT = 'DISCONNECT';
const CONNECT = 'CONNECT';

function notifyChannel(channel_id, guild_member, state) {
	const guildChannel = guild_member.guild.channels.get(channel_id);
	const members = guildChannel.members.filter(member => {
		return member.id != guild_member.id;
	});

	const nick = guild_member.nickname || guild_member.user.username;

	members.forEach((key, value) => {
 		//TODO: Look up KEY in mongoDB and make sure that user is opted IN before sending any messages.
		if (state == CONNECT) {
			key.send(`${nick} joined.`);
		}

		if (state == DISCONNECT) {
			key.send(`${nick} left.`);
		}
	});
};

client.on('ready', () => {
	console.log('Discord client ready!');
});

client.on('voiceStateUpdate', (old_member, new_member) => {
	const old_channel_id = old_member.voiceChannelID;
	const new_channel_id = new_member.voiceChannelID;

	if (old_channel_id) {
		notifyChannel(old_channel_id, old_member, DISCONNECT);
	}

	if (new_channel_id) {
		notifyChannel(new_channel_id, new_member, CONNECT);
	}
});

client.on("message", (message) => {
  if (message.content.startsWith("!subscribe")) {

  	// TODO: Handle client opting IN and OUT of notifications. 
  	// Default behavior should be to not send anything until user opts in.
    message.channel.send("i herd u wanted notifications! coming soon...");
  }
});

export default function init() {
	return client.login(secret_token);
};

export function discordPing() {
	return client.ping;
};