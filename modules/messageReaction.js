const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../reactionRoles.json");
let reactionConfig;

// Загружаем конфигурацию при запуске программы
function loadConfig() {
  try {
    const rawData = fs.readFileSync(configPath, "utf8");
    reactionConfig = JSON.parse(rawData);
  } catch (error) {
    console.error("Ошибка при загрузке конфигурации:", error);
    reactionConfig = { roleReactions: [] }; // Если ошибка чтения, создаем пустую конфигурацию
  }
}

// Сохраняем конфигурацию на диск
function saveConfig() {
  try {
    fs.writeFileSync(configPath, JSON.stringify(reactionConfig, null, 2));
  } catch (error) {
    console.error("Ошибка при сохранении конфигурации:", error);
  }
}

// Загружаем конфигурацию при запуске
loadConfig();

module.exports = (client) => {
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

        if (roleMapping.conflicts) {
          for (const conflictRoleId of roleMapping.conflicts) {
            if (member.roles.cache.has(conflictRoleId)) {
              const conflictingRole = message.guild.roles.cache.get(conflictRoleId);
              if (conflictingRole) {
                await member.roles.remove(conflictingRole);
                const conflictingReaction = message.reactions.cache.find(
                  (r) => reactionData.reactions.find(c => c.roleId === conflictRoleId).emoji === r.emoji.name
                );
                if (conflictingReaction) {
                  await conflictingReaction.users.remove(user.id);
                }
              }
            }
          }
        }

        if (role) {
          await member.roles.add(role);
        }
      }
    };

    reactionConfig.roleReactions.forEach((reactionData) => {
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

    reactionConfig.roleReactions.forEach((reactionData) => {
      if (reactionData.messageId === message.id) {
        handleReaction(reactionData);
      }
    });
  });
};
