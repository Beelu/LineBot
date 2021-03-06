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
const mysql = require('mysql');
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const textAnalyticsClient = new TextAnalyticsClient(process.env.azure_url,  new AzureKeyCredential(process.env.azure_key));

var connection = mysql.createConnection({
  host     : process.env.gcp_endpoint,
  user     : 'root',
  password : process.env.gcp_PW,
  database : 'e_line'
});

connection.connect();

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
  // }else if (event.message.text == "測試"){
  //   testDB().then(success => {
  //     event.reply({ type: 'text', text: success });
  //   })
  }else{
    sentimentAnalysis(textAnalyticsClient, event.message.text).then(suc => {
      event.reply({ type: 'text', text: "正面:" + suc.positive + "   負面:" + suc.negative + "  中立:" + suc.neutral });
    });
  }
});

// const config = {
//   channelId: process.env.CHANNEL_ID,
//   channelSecret: process.env.CHANNEL_SECRET,
//   channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
// };

// const client = new line.Client(config);

// app.post('/', line.middleware(config), (req, res) => {
//   Promise
//     .all(req.body.events.map(handleEvent))
//     .then((result) => res.json(result))
//     .catch((err) => {
//       console.error(err);
//       res.status(500).end();
//     });
// });

// // event handler
// function handleEvent(event) {
//   if (event.type == 'message') {
//     if(event.source.type == 'group'){
//       client.getGroupMemberIds(event.source.groupId).then((ids) => {
//         ids.forEach((id) => {
//           client.replyMessage(event.source.groupId, id);
//         })
//       })
//       return Promise.resolve(null);
//     }
//   }else{
//     return Promise.resolve(null);
//   }
// }

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

//文字分析
async function sentimentAnalysis(client, str){
  const sentimentInput = [{
      text: str,
      id: "0",
      language: "zh-hant"
  }];
  const sentimentResult = await client.analyzeSentiment(sentimentInput);

  // console.log(sentimentResult[0].confidenceScores);
  return sentimentResult[0].confidenceScores;
}

//測試資料庫
function testDB(){
  return new Promise((resolve, reject) => {
    connection.query('SELECT lineId FROM user', function (error, results) {
      if (error){ reject("爆炸") };
      resolve(results[0].lineId);
    });
  })
}
//=============================================================//
app.post('/', linebotParser);
app.listen(process.env.PORT || 3000, () => {
  console.log('Express server start')
});

app.get("/", (req, res) => {
    res.render("hello");
})

connection.end();