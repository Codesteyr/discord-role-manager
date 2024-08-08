module.exports = (client) => {
  const logChannelId = "1271028951623536715"; // Замените на фактический ID вашего текстового канала

  client.on("messageReactionAdd", async (reaction, user) => {
    // Получение текстового канала
    const logChannel = await client.channels.fetch(logChannelId);

    // Проверка, что реакция была добавлена к нужному сообщению
    if (reaction.message.id === client.selectedMessage) {
      // Проверка, что реакция принадлежит боту
      if (user.bot) {
        return;
      }

      // Поиск соответствующей роли для реакции
      const reactionRole = client.reactionRoles.find(
        (rr) =>
          rr.messageId === client.selectedMessage &&
          rr.emoji === reaction.emoji.name
      );

      if (reactionRole) {
        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);

        // Проверка, есть ли у пользователя роль
        if (!member.roles.cache.has(reactionRole.roleId)) {
          // Выдача роли пользователю
          try {
            await member.roles.add(reactionRole.roleId);
            console.log(
              `Выдана роль ${reactionRole.roleId} пользователю ${user.tag}`
            );
            const logMessage = `Выдана роль ${reactionRole.roleId} пользователю ${user.tag}`;
            logChannel.send(logMessage).catch((error) => {
              console.error(`Ошибка при отправке сообщения в канал: ${error}`);
            });
          } catch (error) {
            console.error(`Ошибка при выдаче роли: ${error}`);
          }
        }
      }
    }
  });

  client.on("messageReactionRemove", async (reaction, user) => {
    // Получение текстового канала
    const logChannel = await client.channels.fetch(logChannelId);

    // Проверка, что реакция была удалена из нужного сообщения
    if (reaction.message.id === client.selectedMessage) {
      // Проверка, что реакция принадлежит боту
      if (user.bot) {
        return;
      }

      // Поиск соответствующей роли для реакции
      const reactionRole = client.reactionRoles.find(
        (rr) =>
          rr.messageId === client.selectedMessage &&
          rr.emoji === reaction.emoji.name
      );

      if (reactionRole) {
        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);

        // Проверка, есть ли у пользователя роль
        if (member.roles.cache.has(reactionRole.roleId)) {
          // Удаление роли у пользователя
          try {
            await member.roles.remove(reactionRole.roleId);
            console.log(
              `Роль ${reactionRole.roleId} удалена у пользователя ${user.tag}`
            );
            const logMessage = `Роль ${reactionRole.roleId} удалена у пользователя ${user.tag}`;
            logChannel.send(logMessage).catch((error) => {
              console.error(`Ошибка при отправке сообщения в канал: ${error}`);
            });
          } catch (error) {
            console.error(`Ошибка при удалении роли: ${error}`);
          }
        }
      }
    }
  });
};
