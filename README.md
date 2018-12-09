# notif-bot
A discord bot for user notifications. When enabled, the bot will listen to user join / leave events. When a user joins / leaves a voice channel, notif-bot will send a private message to all other users in that channel (who have opted in to notifications) about who joined / left. 

I recommend you enable TTS, so that your private messages will be read aloud, thus you no longer have to use an overlay or tab out to hear who has joined or left your current voice channel!

# Installing
`npm install` 

`npm run build`

`npm run start`

# Environment variables
### DISCORD_SECRET_TOKEN
Your discord secret token, generated for your bot. 
Read this article to see more about how to generate a token.
https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token

ALWAYS keep this token SECRET.

# Usage

After the bot is initialized and invited to your channel, type !subscribe to toggle subscription status. All users will default to OPT-OUT and will not get messages until they decide to subscribe.
