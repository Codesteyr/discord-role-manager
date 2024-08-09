const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../reactionRoles.json");

module.exports = {
  name: "setreactionrole",
  description: "Устанавливает роль по реакции",
  async execute(client, message, args) {
    const [messageId, emoji, roleId, ...conflicts] = args;

    if (!messageId || !emoji || !roleId) {
      return message.reply("Пожалуйста, укажите все необходимые параметры: ID сообщения, эмодзи и ID роли.");
    }

    try {
      const targetMessage = await message.channel.messages.fetch(messageId);
      await targetMessage.react(emoji);

      // Перезагружаем конфиг из файла
      let reactionConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

      let reactionData = reactionConfig.roleReactions.find(
        (data) => data.messageId === messageId
      );

      if (!reactionData) {
        reactionData = { messageId, reactions: [] };
        reactionConfig.roleReactions.push(reactionData);
      }

      reactionData.reactions.push({ emoji, roleId, conflicts });

      try {
        fs.writeFileSync(configPath, JSON.stringify(reactionConfig, null, 2));
        console.log("Данные о реакциях успешно сохранены.");
      } catch (error) {
        console.error("Ошибка при сохранении данных о реакциях:", error);
      }

      await message.reply(`Роль успешно настроена на сообщение с ID: ${messageId} для реакции ${emoji}`);
    } catch (error) {
      console.error(error);
      await message.reply("Произошла ошибка при настройке роли.");
    }
  },
};
