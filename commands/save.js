const { loadData, saveData } = require('../utils/database');

module.exports = {
  name: 'save',
  description: 'Simpan video atau foto',
  usage: '-save [link]',

  async execute(bot, args) {
    if (!args || args.trim().length === 0) {
      return await bot.sendMessage('❌ Cara pakai: -save [link]\nContoh: -save https://example.com/video.mp4');
    }

    const link = args.trim();
    const data = loadData('saved');
    const userId = 'default';

    if (!data[userId]) {
      data[userId] = [];
    }

    const type = link.includes('reel') || link.includes('video') ? 'video' : 'photo';

    data[userId].push({
      link,
      type,
      date: new Date().toISOString()
    });

    saveData('saved', data);

    const emoji = type === 'video' ? '🎥' : '📷';
    await bot.sendMessage(`${emoji} Berhasil disimpan!\nTotal: ${data[userId].length}`);
  }
};
