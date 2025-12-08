const { loadData } = require('../utils/database');

module.exports = {
  name: 'score',
  description: 'Lihat skor game',
  usage: '-score',

  async execute(bot, args) {
    const scores = loadData('scores');
    const userId = 'default';

    if (!scores[userId]) {
      return await bot.sendMessage('❌ Kamu belum main game!');
    }

    const { tebak, suit, slot } = scores[userId];
    const total = tebak + suit + slot;

    const response = `🏆 Skor Game Kamu:\n\n` +
      `🎲 Tebak Angka: ${tebak}\n` +
      `✊ Suit: ${suit}\n` +
      `🎰 Slot: ${slot}\n\n` +
      `💯 Total: ${total} poin`;

    await bot.sendMessage(response);
  }
};