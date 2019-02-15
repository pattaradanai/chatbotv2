const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const sendLine = require('./src/constant/sendLine');
const serviceLine = new sendLine();

const dataTns = require('./src/constant/dataTns');
const serviceTns = new dataTns();

const app = express();
const port = process.env.PORT || 4000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/webhook',async (req, res) => {
  let reply_token = req.body.events[0].replyToken;
  let msg = req.body.events[0].message.text;
  let body = [];

  if (msg == "news") {
    const dataTodayTopPicks = await serviceTns.getTodayTopPick();
    const contentBody = await serviceLine.messageNews(dataTodayTopPicks);

    body.push(contentBody);
  } else {
    body.push(serviceLine.messageText(msg));
  }

  serviceLine.replyLine(reply_token, body);
  res.sendStatus(200);
});

app.listen(port);
