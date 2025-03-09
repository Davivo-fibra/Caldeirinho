require('dotenv').config();  // Carrega as variáveis de ambiente do arquivo .env
const { Client, GatewayIntentBits } = require('discord.js');

// Carrega o token do bot de forma segura
const token = process.env.DISCORD_TOKEN;

// Criação do bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Função para corrigir o link
function fixSocialMediaLink(url, platform) {
  const domainMap = {
    instagram: 'instagram.com',
    twitter: 'x.com',
    tiktok: 'tiktok.com',
  };

  const baseUrls = {
    instagram: 'https://ddinstagram.com',
    twitter: 'https://fxtwitter.com',
    tiktok: 'https://vxtiktok.com',
  };

  // Remove 'www.' de qualquer parte da URL
  url = url.replace(/^https?:\/\/(www\.)?/, 'https://');  // Remove 'www.' se existir no início da URL

  // Substitui o domínio na URL
  for (const platformKey in domainMap) {
    if (url.includes(domainMap[platformKey])) {
      return url.replace(domainMap[platformKey], baseUrls[platformKey].replace('https://', ''));
    }
  }

  return url;  // Retorna a URL original se não houver substituição
}

// Quando o bot estiver online
client.once('ready', () => {
  console.log('Bot está online!');
});

// Quando o bot recebe uma mensagem
client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignora mensagens de outros bots

  let content = message.content;

  // Verifica links do TikTok, Twitter e Instagram
  const tiktokRegex = /(https?:\/\/(?:www\.|vm\.)?tiktok\.com\/[^\s]+)/g;  // Ajustado para pegar links do TikTok (tiktok.com e vm.tiktok.com)
  const twitterRegex = /(https?:\/\/(?:www\.)?x\.com[^\s]+)/g;
  const instagramRegex = /(https?:\/\/(?:www\.)?instagram\.com[^\s]+)/g;

  // Processa links do TikTok
  const tiktokLinks = content.match(tiktokRegex);
  if (tiktokLinks) {
    for (const link of tiktokLinks) {
      const fixedLink = fixSocialMediaLink(link, 'tiktok');
      content = content.replace(link, fixedLink);
    }
  }

  // Processa links do Twitter
  const twitterLinks = content.match(twitterRegex);
  if (twitterLinks) {
    for (const link of twitterLinks) {
      const fixedLink = fixSocialMediaLink(link, 'twitter');
      content = content.replace(link, fixedLink);
    }
  }

  // Processa links do Instagram
  const instagramLinks = content.match(instagramRegex);
  if (instagramLinks) {
    for (const link of instagramLinks) {
      const fixedLink = fixSocialMediaLink(link, 'instagram');
      content = content.replace(link, fixedLink);
    }
  }

  // Se algum link foi modificado, o bot responde com o link corrigido
  if (tiktokLinks || twitterLinks || instagramLinks) {
    await message.reply(`Aqui está o link corrigido: ${content}`);
  }
});

// Loga o bot no Discord
client.login(token);
