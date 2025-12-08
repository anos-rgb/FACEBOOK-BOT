module.exports = {
  name: 'meme',
  description: 'Meme lucu',
  usage: '-meme',

  async execute(bot, args) {
    const memes = [
      '😂 "Works on my machine" ¯\\_(ツ)_/¯',
      '🤣 Ctrl+C, Ctrl+V from StackOverflow',
      '😎 Debugging: Being detective where you\'re also the murderer',
      '💀 Deploy on Friday? I like to live dangerously',
      '🔥 Code review: "Why did you do this?"'
    ];

    const meme = memes[Math.floor(Math.random() * memes.length)];
    await bot.sendMessage(meme);
  }
};