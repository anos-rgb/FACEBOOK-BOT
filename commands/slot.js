const { loadData, saveData } = require('../utils/database');

module.exports = {
  name: 'slot',
  description: 'Slot machine game',
  usage: '-slot',

  async execute(bot, args) {
    const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
    const slots = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    const scores = loadData('scores');
    const userId = 'default';

    if (!scores[userId]) {
      scores[userId] = { tebak: 0, suit: 0, slot: 0 };
    }

    let result = `🎰 [ ${slots.join(' | ')} ]\n\n`;
    let points = 0;

    if (slots[0] === slots[1] && slots[1] === slots[2]) {
      if (slots[0] === '💎') points = 100;
      else if (slots[0] === '7️⃣') points = 77;
      else points = 50;
      result += `🎉 JACKPOT! +${points} poin!`;
    } else if (slots[0] === slots[1] || slots[1] === slots[2] || slots[0] === slots[2]) {
      points = 10;
      result += '👍 DOUBLE! +10 poin!';
    } else {
      result += '😅 Coba lagi!';
    }

    scores[userId].slot += points;
    saveData('scores', scores);
    result += `\nTotal: ${scores[userId].slot}`;

    await bot.sendMessage(result);
  }
};