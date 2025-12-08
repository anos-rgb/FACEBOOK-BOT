const { loadData, saveData } = require('../utils/database');

module.exports = {
    name: 'delete',
    description: 'Hapus simpanan',
    usage: '-delete [nomor]',

    async execute(bot, args) {
        if (!args || args.trim().length === 0) {
            return await bot.sendMessage('❌ Cara pakai: -delete [nomor]\nContoh: -delete 1');
        }

        const index = parseInt(args.trim());
        const data = loadData('saved');
        const userId = 'default';
        const userSaved = data[userId] || [];

        if (isNaN(index) || index < 1 || index > userSaved.length) {
            return await bot.sendMessage(`❌ Nomor tidak valid! (1-${userSaved.length})`);
        }

        // Remove item (array index is 0-based)
        const deleted = userSaved.splice(index - 1, 1)[0];
        data[userId] = userSaved;
        saveData('saved', data);

        const emoji = deleted.type === 'video' ? '🎥' : '📷';
        await bot.sendMessage(`${emoji} Berhasil dihapus!\nSisa: ${userSaved.length} item`);
    }
};
