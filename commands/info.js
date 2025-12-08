const config = require('../data/config');

module.exports = {
    name: 'info',
    description: 'Info tentang bot',
    usage: '-info',

    async execute(bot, args) {
        const info = config.botInfo;

        const response = `ℹ️ Informasi Bot\n\n` +
            `📌 Nama: ${info.name}\n` +
            `📦 Versi: ${info.version}\n` +
            `👤 Author: ${info.author}\n\n` +
            `Ketik -help untuk daftar command`;

        await bot.sendMessage(response);
    }
};
