const CommandHandler = require('../commands/CommandHandler');

class MessageHandler {
    constructor(bot) {
        this.bot = bot;
        this.commandHandler = new CommandHandler(bot);
    }

    async handleMessage(message) {
        try {
            const cmd = message.toLowerCase().trim();

            // Cek apakah ini command
            if (cmd.startsWith('-')) {
                // Simulate "typing" delay before executing command
                console.log('⏳ Memproses command...');

                // Pass message asli (bukan lowercase) ke command handler
                await this.commandHandler.execute(message);
            } else {
                await this.handleNormalMessage(message);
            }
        } catch (error) {
            console.error('Error handleMessage:', error);
        }
    }

    async handleNormalMessage(message) {
        // Handler untuk pesan biasa (non-command)
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('halo') || lowerMsg.includes('hai')) {
            // await this.bot.sendMessage('Hai juga! Ketik -help untuk info');
        }
    }
}

module.exports = MessageHandler;