const config = require("../config.js");

module.exports = {
  name: "setreactionrole",
  description: "Устанавливает роль по реакции",


  // example use
  // !setreactionrole <id_message> <icon> <id_role>
  // !setreactionrole 1271534304433934338 :flag_ru: 1271537188693086248
  
  async execute(client, message, args) {

    const requiredRoleId = config.id_role_for_allow_setReactinCommand; 

    if (!message.member.roles.cache.has(requiredRoleId)) {
      return message.reply("У вас нет прав на использование этой команды.");
    }

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

      // Сохраняем данные в память
      client.saveReactionRoles(client);

      // Обновляем обработчики
      client.updateReactionHandlers();
      
      const reply = await message.reply(`Роль успешно настроена на сообщение с ID: ${messageId} для реакции ${emoji}`);
      setTimeout(() => reply.delete(), 5000);
      
    } catch (error) {
      console.error(error);
      await message.reply("Произошла ошибка при настройке роли.");
    }
  },
};
