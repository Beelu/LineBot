if (process.env.NODE_ENV !== 'production') {      
  require('dotenv').config();
}

const express = require('express');
const app = express();
const linebot = require('linebot');
// const line = require('@line/bot-sdk');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
const resolve = require('path');

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
  }else if(event.message.text.slice(0, 4) == "搜尋圖片"){
    search = event.message.text.slice(4);
    getImg(search).then(success => {
      success = "https:" + success;
      event.reply({
        type: 'image',
        originalContentUrl: success,
        previewImageUrl: success
      });
    })
  }
});

//=============================================================//

//笑話
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

//搜尋圖片
const getImg = function (search) {
  return new Promise((resolve, reject) => {
    let weburl = "https://imgur.com/search?q=" + encodeURI(search);
    console.log(weburl)
    request({
      url: weburl,
      method: "GET"
    }, function (error, response, body) {
      if (error || !body) {
        reject("爆炸惹")
      }
      const $ = cheerio.load(body);
      const img = $(".post .image-list-link");
      let rand = Math.floor(Math.random() * 10);
      resolve(img.eq(rand).find('img').attr('src'));
    });
  });
};

//=============================================================//
app.post('/', linebotParser);
app.listen(process.env.PORT || 3000, () => {
  console.log('Express server start')
});

app.get("/", (req, res) => {
    res.render("hello");
})