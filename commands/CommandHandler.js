const commands = require('./index');

class CommandHandler {
    constructor(bot) {
        this.bot = bot;
        this.commands = new Map();

        // Load all commands
        commands.forEach(cmd => {
            this.commands.set(cmd.name, cmd);
        });

        console.log(`✅ Loaded ${this.commands.size} commands`);
    }

    async execute(message) {
        try {
            // Parse command dan arguments
            const trimmed = message.trim();

            if (!trimmed.startsWith('-')) {
                return;
            }

            // Remove prefix '-'
            const content = trimmed.substring(1);
            const parts = content.split(' ');
            const commandName = parts[0].toLowerCase();
            const args = parts.slice(1).join(' ').trim();

            // Find command
            const command = this.commands.get(commandName);

            if (!command) {
                console.log(`❌ Command tidak ditemukan: ${commandName}`);
                await this.bot.sendMessage(`❌ Command "${commandName}" tidak ditemukan. Ketik -help untuk list command.`);
                return;
            }

            // Execute command
            console.log(`▶ Executing command: ${commandName} | args: ${args || '(kosong)'}`);
            
            // Pass bot dan args ke command
            await command.execute(this.bot, args);

        } catch (error) {
            console.error('❌ Error executing command:', error);
            await this.bot.sendMessage('❌ Terjadi error saat menjalankan command: ' + error.message);
        }
    }

    listCommands() {
        return Array.from(this.commands.values());
    }
}

module.exports = CommandHandler;