const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../reactionRoles.json");

module.exports = (client) => {
  client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;

    const { message, emoji } = reaction;
    const member = await message.guild.members.fetch(user.id);

    // Загружаем конфигурацию из файла
    const reactionConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

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

    const reactionConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

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
