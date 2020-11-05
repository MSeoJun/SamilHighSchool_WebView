import express from "express";
import Expo from "expo-server-sdk";

const app = express();
const expo = new Expo();

const savedPushTokens = [];
const PORT_NUMBER = 3000;

const saveToken = (token) => {
  if (savedPushTokens.indexOf(token === -1)) {
    savedPushTokens.push(token);
  }
};

const handlePushTokens = (message) => {
  let notification = [];

  for (let pushToken of savedPushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.log("ERROR");
      continue;
    }

    notification.push({
      to: pushToken,
      sound: "default",
      title: "오늘의 급식~",
      body: message,
      data: { message },
    });
  }
  let chunks = expo.chunkPushNotifications(notification);
  (async () => {
    for (let chunk of chunks) {
      try {
        let receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

app.use(express.json());

app.get("/", (req, res) => {
  res.send("서버 실행중...");
});

app.post("/token", (req, res) => {
  saveToken(req.body.token.value);
  console.log(`토큰 저장함 ${req.body.token.value}`);
  console.log(`토큰이 저장되었습니다. ${req.body.token.value}`);
});

app.post("/message", (req, res) => {
  console.log(req.body.message);
  handlePushTokens(req.body.message);
  console.log("메세지 전송");
  res.send(`메세지를 전송합니다. ${req.body.message}`);
});

app.listen(PORT_NUMBER, () => {
  console.log("3000 번 포트 서버 실행");
});