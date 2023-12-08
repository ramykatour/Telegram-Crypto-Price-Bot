require('dotenv').config(); // Load environment variables from .env file
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_BOT_TOKEN' with the token you obtained from the BotFather
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Handle incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text.toLowerCase();

  if (messageText === '/start') {
    // Fetch cryptocurrency prices
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: 'bitcoin,ethereum,dogecoin,binancecoin,matic-network,litecoin', // Use the correct identifier for Polygon (Matic)
          vs_currencies: 'usd',
        },
      });

      // Prepare a map of cryptocurrency names to their corresponding identifiers
      const cryptoMap = {
        'Bitcoin': 'bitcoin',
        'Ethereum': 'ethereum',
        'Dogecoin': 'dogecoin',
        'Binance Coin': 'binancecoin',
        'Polygon (Matic)': 'matic-network', // Use the correct identifier for Polygon (Matic)
        'Litecoin': 'litecoin',
      };

      // Check if the properties exist in the response and create an array of formatted prices
      const prices = Object.entries(cryptoMap).map(([cryptoName, cryptoIdentifier]) => {
        const cryptoPrice = response.data[cryptoIdentifier]?.usd;
        if (cryptoPrice === undefined) {
          throw new Error(`Price for ${cryptoName} is undefined`);
        }
        return `${cryptoName}: $${cryptoPrice}`;
      });

      // Reply with formatted cryptocurrency prices
      bot.sendMessage(chatId, `Current cryptocurrency prices:\n${prices.join('\n')}`);
    } catch (error) {
      console.error('Error fetching cryptocurrency prices:', error.message);
      bot.sendMessage(chatId, `Error: ${error.message}`);
    }
  } else {
    // Reply to the user with the received message
    bot.sendMessage(chatId, `Received your message: ${msg.text}`);
  }
});
