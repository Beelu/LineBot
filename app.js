if (process.env.NODE_ENV !== 'production') {      
  require('dotenv').config();
}

const express = require('express')
const app = express();
const linebot = require('linebot');

app.set("view engine", "ejs");
//============================================================//
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const linebotParser = bot.parser();

bot.on('message', function (event) {
  event.reply({
    type: 'template',
    altText: 'this is a carousel template',
    template: {
      type: 'carousel',
      columns: {
        thumbnailImageUrl: 'https://www.arfarf.tw/wp-content/uploads/10%E4%BB%B6%E4%BA%8B-1024x677.jpg',
        title: 'this is menu',
        text: 'description',
        actions: [{
          type: 'postback',
          label: 'Buy',
          data: 'action=buy&itemid=111'
        }, {
          type: 'postback',
          label: 'Add to cart',
          data: 'action=add&itemid=111'
        }, {
          type: 'uri',
          label: 'View detail',
          uri: 'http://example.com/page/111'
        }]
      }
    }
  });
});

//=========================================//
app.post('/', linebotParser);
app.listen(process.env.PORT || 3000, () => {
  console.log('Express server start')
});

app.get("/", (req, res) => {
    res.render("hello");
})