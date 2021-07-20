if (process.env.NODE_ENV !== 'production') {      
  require('dotenv').config();
}

const express = require('express');
const app = express();
const linebot = require('linebot');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
const { resolve } = require('path');

app.set("view engine", "ejs");
//============================================================//
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const linebotParser = bot.parser();

bot.on('message', function (event) {
  if(event.message.text == '笑話'){
    getJoke().then(success => {
      event.reply({ type: 'text', text: success });
    });
  }
});

//=========================================//

function getJoke() {
  return new Promise((resolve, reject) => {
    fs.readFile('./joke.txt', function (error, data) {
      if (error) {
          let result =  '爆炸惹';
          reject(result);
      }else{
        let jokes = data.toString().split('=====');
        let rand = Math.floor(Math.random() * jokes.length);
        let result =  jokes[rand];
        resolve(result);
      }
    })
  })
}

//=========================================//
app.post('/', linebotParser);
app.listen(process.env.PORT || 3000, () => {
  console.log('Express server start')
});

app.get("/", (req, res) => {
    res.render("hello");
})