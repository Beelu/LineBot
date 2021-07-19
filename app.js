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
  event.reply(event.message.text).then(function (data) {
    // 當訊息成功回傳後的處理
  }).catch(function (error) {
    // 當訊息回傳失敗後的處理
  });
  event.reply({ type: 'text', text: "hehe" }).then((data) => {

  }).catch((err) => {

  });
  Event.source.member().then((member) => {
    event.reply({ type: 'text', text: "hehe" });
  })
});

//=========================================//
app.post('/', linebotParser);app.listen(process.env.PORT || 3000, () => {
  console.log('Express server start')
});

app.get("/", (req, res) => {
    res.render("hello");
})