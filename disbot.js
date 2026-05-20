const { Client } = require("discord.js-selfbot-v13");
const { Client: BotClient, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");

const loadEnvFile = () => {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
};

loadEnvFile();

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const botInstances = [
  {
    botToken: requireEnv("BOT_TOKEN"),
    recipientUserId: requireEnv("RECIPIENT_USER_ID"),
    userToken: requireEnv("USER_TOKEN"),
    email: process.env.EMAIL || "default",
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
