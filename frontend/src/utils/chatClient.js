import { StreamChat } from 'stream-chat';

let client = null;

export const getChatClient = (apiKey) => {
  if (!client && apiKey) {
    client = StreamChat.getInstance(apiKey);
  }
  return client;
};

export const disconnectChatClient = async () => {
  if (client) {
    await client.disconnectUser();
    client = null;
  }
};