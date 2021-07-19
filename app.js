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
  event.reply(['Hello, world 1', 'Hello, world 2']);
});

//=========================================//
app.post('/', linebotParser);
app.listen(process.env.PORT || 3000, () => {
  console.log('Express server start')
});

app.get("/", (req, res) => {
    res.render("hello");
})