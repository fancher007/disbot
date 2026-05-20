const { Client } = require("discord.js-selfbot-v13");
const { Client: BotClient, GatewayIntentBits } = require("discord.js");

const botInstances = [
  //provide the following informations
  {
    botToken: "MTUwNjQxNTM3NTM0MzE2MTQyNg.GzkIUw.8tBXmwwgSxoQvY3UspuL38XgNLS0gzF4pZ9sqs",
    recipientUserId: "894137606718255134",
    userToken: "ODk0MTM3NjA2NzE4MjU1MTM0.GXkC9Q.3mGhEEr2PmdIe9aBMXYeDhTy7GgsPlzOj__8rE",
    email: "davidalumartin@gmail.com",
  },
];

const initializeBot = ({ botToken, recipientUserId, userToken, email }) => {
  const botClient = new BotClient({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
  });

  botClient.once("ready", () => {
    console.log(`Bot logged in as ${botClient.user.tag}`);
  });

  botClient.login(botToken).catch((error) => {
    console.error("Bot failed to log in:", error);
  });

  const client = new Client();

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag} on account ${email}!`);
  });

  client.on("guildMemberAdd", async (member) => {
    try {
      console.log(member)
      const welcomeMessage = `${member.user.tag} has joined the server ${member.guild.name}`;
      const user = await botClient.users.fetch(recipientUserId);
      await user.send(welcomeMessage);
    } catch (error) {
      console.error(`Failed to send DM for ${email}:`, error);
    }
  });

  client.login(userToken).catch((error) => {
    console.error(`Failed to log in with token for account ${email}:`, error);
  });
};

botInstances.forEach(initializeBot);
