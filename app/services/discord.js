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
      try {
        console.log(`Trying to send message to user (join-event) with key: ${key}`);
        key.send(`${nick} joined.`);
      } catch (ex) {
        log(`Caught error sending message to key ${key} when ${nick} joined! It was:`);
        log(ex);
      }
    }

    if (state === constants.DISCONNECT) {
      try {
        console.log(`Trying to send message to user (leave-event) with key: ${key}`);
        key.send(`${nick} left.`);
      } catch (ex) {
        log(`Caught error sending message to key ${key} when ${nick} left! It was:`);
        log(ex);
      }
    }
  });
}

client.on('ready', () => {
  log('Discord client ready!');
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  const oldChannelId = oldMember.voiceChannelID;
  const newChannelId = newMember.voiceChannelID;

  // Some user actions within the same channel trigger this event
  if (oldChannelId === newChannelId) { return; }

  if (oldChannelId) {
    notifyChannel(oldChannelId, oldMember, constants.DISCONNECT);
  }

  if (newChannelId) {
    notifyChannel(newChannelId, newMember, constants.CONNECT);
  }
});

client.on('message', (message) => {
  if (message && message.content && message.content.startsWith(constants.SUB_TOGGLE_COMMAND)) {
    const guildMember = message.member;
    const nick = guildMember.nickname || guildMember.user.username;
    const newState = users.toggleState(guildMember.id);
    if (newState === constants.USER_ADDED_STATE) {
      try {
        message.channel.send(`${nick} subscribed to notifications. Type ${constants.SUB_TOGGLE_COMMAND} to toggle subscription.`); // eslint-disable-line
      } catch (ex) {
        log('Caught error sending message to channel on USER_ADDED_STATE! It was:');
        log(ex);
      }
    } else {
      try {
        message.channel.send(`${nick} unsubscribed from notifications. Type ${constants.SUB_TOGGLE_COMMAND} to toggle subscription.`); // eslint-disable-line
      } catch (ex) {
        log('Caught error sending message to channel on unsub! It was:');
        log(ex);
      }
    }
  }
});

client.on('error', (err) => {
  log('Discord client recorded an error event!');
  log(err);
});

export default function init() {
  return client.login(secretToken);
}

export function discordPing() {
  return client.ping;
}
