const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const config = require("./config.js");
const path = require("node:path");
const fs = require("fs");

const client = new Client({
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.User,
    Partials.ThreadMember,
  ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
});

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
let token = config.token;

client.commands = new Collection();
client.slashcommands = new Collection();
client.commandaliases = new Collection();
const commands = [];

fs.readdirSync("./commands").forEach((file) => {
  const command = require(`./commands/${file}`);
  if (command) {
    client.commands.set(command.name, command);
    commands.push(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach((alias) => {
        client.commandaliases.set(alias, command.name);
      });
    }
  }
});

const slashcommands = [];
fs.readdirSync("./slashcmd/").forEach((folder) => {
  const commands = fs
    .readdirSync(`./slashcmd/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commands) {
    const command = require(`./slashcmd/${folder}/${file}`);
    slashcommands.push(command.data.toJSON());
    client.slashcommands.set(command.data.name, command);
  }
});

require("./events/message.js")(client);
require("./events/ready.js")(client);
// require("./events/interactionCreate.js")(client);
require("./modules/guildMemberAdd.js")(client);
require("./modules/messageReaction.js")(client);
require("./modules/welcomeMessage.js")(client);

client.login(config.token || process.env.TOKEN).catch((e) => {
  console.log("token access denied" + e);
});

const rest = new REST({ version: "10" }).setToken(token);
client.on("ready", async () => {
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: slashcommands,
    });
  } catch (error) {
    console.error(error);
  }
});

// Загрузка данных о реакциях из файла
try {
  const reactionData = fs.readFileSync(path.join(__dirname, "reactionRoles.json"), "utf8");
  client.reactionRoles = JSON.parse(reactionData);
} catch (error) {
  console.error("Ошибка при загрузке данных о реакциях:", error);
  client.reactionRoles = { roleReactions: [] };
}

// Функция для сохранения данных о реакциях в файл
const saveReactionRoles = (client) => {
  try {
    const reactionData = JSON.stringify(client.reactionRoles, null, 2);
    fs.writeFileSync(path.join(__dirname, "reactionRoles.json"), reactionData);
  } catch (error) {
    console.error("Ошибка при сохранении данных о реакциях:", error);
  }
};

// Обновление обработчиков реакций
client.updateReactionHandlers = () => {
  client.removeAllListeners("messageReactionAdd");
  client.removeAllListeners("messageReactionRemove");

  client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;

    const { message, emoji } = reaction;
    const member = await message.guild.members.fetch(user.id);

    const handleReaction = async (reactionData) => {
      const roleMapping = reactionData.reactions.find(
        (r) => r.emoji === emoji.name || r.emoji === emoji.toString()
      );

      if (roleMapping) {
        const role = message.guild.roles.cache.get(roleMapping.roleId);

        if (roleMapping.conflicts && roleMapping.conflicts.length > 0) {
          for (const conflictRoleId of roleMapping.conflicts) {
            if (member.roles.cache.has(conflictRoleId)) {
              const conflictingRole = message.guild.roles.cache.get(conflictRoleId);
              if (conflictingRole) {
                await member.roles.remove(conflictingRole);
              }

              // Убираем конфликтующую реакцию, более точное сравнение
              const conflictingReaction = message.reactions.cache.find((r) => {
                const conflictMapping = reactionData.reactions.find(c => c.roleId === conflictRoleId);
                return r.emoji.name === conflictMapping.emoji || r.emoji.toString() === conflictMapping.emoji;
              });

              if (conflictingReaction) {
                await conflictingReaction.users.remove(user.id);
              }
            }
          }
        }

        // Добавляем роль для текущей реакции
        if (role) {
          await member.roles.add(role);
        }
      }
    };

    client.reactionRoles.roleReactions.forEach((reactionData) => {
      if (reactionData.messageId === message.id) {
        handleReaction(reactionData);
      }
    });
  });

  client.on("messageReactionRemove", async (reaction, user) => {
    if (user.bot) return;

    const { message, emoji } = reaction;
    const member = await message.guild.members.fetch(user.id);

    const handleReaction = async (reactionData) => {
      const roleMapping = reactionData.reactions.find(
        (r) => r.emoji === emoji.name || r.emoji === emoji.toString()
      );

      if (roleMapping) {
        const role = message.guild.roles.cache.get(roleMapping.roleId);
        if (role) {
          await member.roles.remove(role);
        }
      }
    };

    client.reactionRoles.roleReactions.forEach((reactionData) => {
      if (reactionData.messageId === message.id) {
        handleReaction(reactionData);
      }
    });
  });
};

// Инициализация обработчиков при запуске
client.updateReactionHandlers();


// Обработчики для сохранения данных при завершении программы
process.on("exit", () => saveReactionRoles(client));
process.on("SIGINT", () => {
  saveReactionRoles(client);
  process.exit();
});
process.on("SIGTERM", () => {
  saveReactionRoles(client);
  process.exit();
});

module.exports = client;
module.exports.saveReactionRoles = saveReactionRoles;
