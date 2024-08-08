const fs = require("fs");

module.exports = (client) => {
  client.on("guildMemberAdd", (member) => {
    const spectatorRoleId = "1271031576800657459"; // Замените на фактический ID вашей роли spectator
    const spectatorRole = member.guild.roles.cache.get(spectatorRoleId);

    const logChannelId = "1271028951623536715"; // Замените на фактический ID вашего текстового канала
    const logChannel = member.guild.channels.cache.get(logChannelId);

    if (spectatorRole && member.guild.available && logChannel) {
      member.roles
        .add(spectatorRole)
        .then(() => {
          console.log(`Пользователю ${member.user.tag} выдана роль spectator`);

          const logMessage = `${member.user.tag} was given the spectator role `;
          fs.appendFileSync("role_log.txt", logMessage);

          // Отправить лог в текстовый канал
          logChannel.send(logMessage);
        })
        .catch(console.error);
    }
  });
};
