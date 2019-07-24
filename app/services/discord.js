import Discord from 'discord.js';
import Promise from 'bluebird';
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

  const messagePromises = members.map((key) => {
    if (state === constants.CONNECT) {
      return key.send(`${nick} joined.`);
    }
    if (state === constants.DISCONNECT) {
      return key.send(`${nick} left.`);
    }

    return Promise.resolve(); // If no action to take, or some unidentified state, just ignore.
  });

  return Promise.all(messagePromises)
    .catch((exs) => {
      log('Caught exception when messaging user(s)!');
      log(exs);
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

  const notifications = [];

  if (oldChannelId) {
    notifications.push(notifyChannel(oldChannelId, oldMember, constants.DISCONNECT));
  }

  if (newChannelId) {
    notifications.push(notifyChannel(newChannelId, newMember, constants.CONNECT));
  }

  Promise.all(notifications)
    .catch((exs) => {
      log('Caught exception when calling notifyChannel promises!');
      log(exs);
    });
});

client.on('message', (message) => {
  if (message && message.content && message.content.startsWith(constants.SUB_TOGGLE_COMMAND)) {
    const guildMember = message.member;
    const nick = guildMember.nickname || guildMember.user.username;
    const newState = users.toggleState(guildMember.id);
    if (newState === constants.USER_ADDED_STATE) {
      message.channel.send(`${nick} subscribed to notifications. Type ${constants.SUB_TOGGLE_COMMAND} to toggle subscription.`) // eslint-disable-line
        .catch((ex) => {
          log('Caught error sending message to channel on USER_ADDED_STATE! It was:');
          log(ex);
        });
    } else {
      message.channel.send(`${nick} unsubscribed from notifications. Type ${constants.SUB_TOGGLE_COMMAND} to toggle subscription.`) // eslint-disable-line
        .catch((ex) => {
          log('Caught error sending message to channel on unsub! It was:');
          log(ex);
        });
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
