const { loadData } = require('../utils/database');

module.exports = {
  name: 'list',
  description: 'Lihat daftar simpanan',
  usage: '-list',

  async execute(bot, args) {
    const data = loadData('saved');
    const userId = 'default';
    const userSaved = data[userId] || [];

    if (userSaved.length === 0) {
      return await bot.sendMessage('❌ Kamu belum punya simpanan');
    }

    let response = '📋 Daftar Simpanan:\n\n';

    userSaved.forEach((item, i) => {
      const emoji = item.type === 'video' ? '🎥' : '📷';
      response += `${i + 1}. ${emoji} ${item.link}\n`;
    });

    await bot.sendMessage(response);
  }
};