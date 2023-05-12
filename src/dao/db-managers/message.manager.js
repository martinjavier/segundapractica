class MessageManager {
  constructor(model) {
    this.model = model;
  }

  getMessages = async () => {
    const messages = await this.model.find().lean();
    return messages;
  };

  create = async (user, message) => {
    const result = await this.model.create({ user, message });
    return result;
  };
}

export default MessageManager;
