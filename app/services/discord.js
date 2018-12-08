import Discord from 'discord.js';
import constants from '../resources/constants';
import log from '../utils/logger';
import users from '../utils/users';

const client = new Discord.Client();

const secretToken = process.env.DISCORD_SECRET_TOKEN;

function notifyChannel(channelId, guildMember, state) {
  const guildChannel = guildMember.guild.channels.get(channelId);
  const members = guildChannel.members.filter((member) => {
    return member.id !== guildMember.id && users.isUserEnabled(member.id); // Get all OTHER opted in users
  });

  const nick = guildMember.nickname || guildMember.user.username;

  members.forEach((key) => {
    if (state === constants.CONNECT) {
      key.send(`${nick} joined.`);
    }

    if (state === constants.DISCONNECT) {
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
    notifyChannel(oldChannelId, oldMember, constants.DISCONNECT);
  }

  if (newChannelId) {
    notifyChannel(newChannelId, newMember, constants.CONNECT);
  }
});

client.on('message', (message) => {
  if (message.content.startsWith(constants.SUB_TOGGLE_COMMAND)) {
    const guildMember = message.member;
    const nick = guildMember.nickname || guildMember.user.username;
    const newState = users.toggleState(guildMember.id);
    if (newState === constants.USER_ADDED_STATE) {
      message.channel.send(`${nick} subscribed to notifications. Type ${constants.SUB_TOGGLE_COMMAND} to toggle subscription.`); // eslint-disable-line
    } else {
      message.channel.send(`${nick} unsubscribed from notifications. Type ${constants.SUB_TOGGLE_COMMAND} to toggle subscription.`); // eslint-disable-line
    }
  }
});

export default function init() {
  return client.login(secretToken);
}

export function discordPing() {
  return client.ping;
}
