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

      // Работаем с данными в памяти, а не напрямую с файлом
      let reactionData = client.reactionRoles.roleReactions.find(
        (data) => data.messageId === messageId
      );

      if (!reactionData) {
        reactionData = { messageId, reactions: [] };
        client.reactionRoles.roleReactions.push(reactionData);
      }

      reactionData.reactions.push({ emoji, roleId, conflicts });

      // Сохраняем данные в память, а затем они будут записаны в файл при завершении работы программы
      client.saveReactionRoles(client);

      await message.reply(`Роль успешно настроена на сообщение с ID: ${messageId} для реакции ${emoji}`);
    } catch (error) {
      console.error(error);
      await message.reply("Произошла ошибка при настройке роли.");
    }
  },
};
