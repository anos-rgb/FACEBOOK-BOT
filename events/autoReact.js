module.exports = {
  name: 'autoReact',
  type: 'message',
  execute(api, message) {
    const { body, messageID, threadID } = message;
    
    if (!body) return;

    const reactions = {
      'mantap': '👍',
      'bagus': '❤️',
      'keren': '😎',
      'lucu': '😂',
      'sedih': '😢'
    };

    for (const [keyword, emoji] of Object.entries(reactions)) {
      if (body.toLowerCase().includes(keyword)) {
        api.setMessageReaction(emoji, messageID, () => {}, true);
        break;
      }
    }
  }
};
