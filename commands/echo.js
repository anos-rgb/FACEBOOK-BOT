module.exports = {
    name: 'echo',
    description: 'Mengulang teks yang dikirim',
    usage: '-echo [teks]',

    async execute(bot, args) {
        if (args && args.trim().length > 0) {
            await bot.sendMessage(args);
        } else {
            await bot.sendMessage('Gunakan: -echo [teks]\nContoh: -echo Halo dunia!');
        }
    }
};