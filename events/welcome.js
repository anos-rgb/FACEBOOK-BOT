module.exports = {
  name: 'welcome',
  type: 'message',
  execute(api, message) {
    const { body, threadID, senderID } = message;
    
    const greetings = ['halo', 'hi', 'hey', 'hello'];
    
    if (body && greetings.some(g => body.toLowerCase().includes(g))) {
      api.sendMessage('👋 Halo! Ketik -help untuk lihat menu', threadID);
    }
  }
};