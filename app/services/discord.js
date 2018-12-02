import Discord from 'discord.js';
import log from '../utils/logger';

const client = new Discord.Client();

const secretToken = process.env.DISCORD_SECRET_TOKEN;
const DISCONNECT = 'DISCONNECT';
const CONNECT = 'CONNECT';

function notifyChannel(channelId, guildMember, state) {
  const guildChannel = guildMember.guild.channels.get(channelId);
  const members = guildChannel.members.filter((member) => {
    return member.id !== guildMember.id;
  });

  const nick = guildMember.nickname || guildMember.user.username;

  members.forEach((key) => {
    //  TODO: Look up KEY in mongoDB and make sure that user is opted IN before sending any messages.
    if (state === CONNECT) {
      key.send(`${nick} joined.`);
    }

    if (state === DISCONNECT) {
      key.send(`${nick} left.`);
    }
  });
}

client.on('ready', () => {
  log('Discord client ready!');
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  const oldChannelId = oldMember.voiceChannelID;
  const newChannelId = newMember.voiceChannelID;

  if (oldChannelId) {
    notifyChannel(oldChannelId, oldMember, DISCONNECT);
  }

  if (newChannelId) {
    notifyChannel(newChannelId, newMember, CONNECT);
  }
});

client.on('message', (message) => {
  if (message.content.startsWith('!subscribe')) {
    // TODO: Handle client opting IN and OUT of notifications.
    // Default behavior should be to not send anything until user opts in.
    message.channel.send('i herd u wanted notifications! coming soon...');
  }
});

export default function init() {
  return client.login(secretToken);
}

export function discordPing() {
  return client.ping;
}
