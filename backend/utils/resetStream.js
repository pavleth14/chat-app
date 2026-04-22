require('dotenv').config({ path: '../.env' });
const { StreamChat } = require('stream-chat');

const client = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

const resetChannels = async () => {
  let channels;
  let offset = 0;

  do {
    channels = await client.queryChannels({}, {}, { limit: 100, offset });

    for (const channel of channels) {
      await channel.delete({ hard_delete: true });
    }

    offset += channels.length;
  } while (channels.length > 0);

  console.log("✅ Done");
  process.exit(0);
};

resetChannels();