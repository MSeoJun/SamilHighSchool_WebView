import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import {WebView} from "react-native-webview";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import axios from "axios";

const PUSH_REGISTRATION_ENDPOINT = "http://8f4cd4a4b5c1.ngrok.io/token";
const MESSAGE_ENPOINT = "http://8f4cd4a4b5c1.ngrok.io/message";

export default function App() {
  const [state, setState] = useState({
    Notifications: null,
    messageText: "",
  });

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (status !== "granted") {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();

    return axios.post(PUSH_REGISTRATION_ENDPOINT, {
      token: {
        value: token,
      },
      user: {
        username: "irving",
        name: "pushapp",
      },
    });

    const notificationSubscription = Notifications.addListener(handleNotification);
  };

  const handleNotification = (notification) => {
    setState({ notification });
  };

  const sendMessage = async (message) => {
    axios.post(MESSAGE_ENPOINT, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      message,
    });
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    axios.get("http://3.34.124.216:3000/lunch")
    .then(res => res.data.match(/[^<p>.*?</p>]/g).join("").match(/[^</1>]/g).join("").match(/[^a-zA-Z!="'오늘의 급식]/g).join("").trim())
    .then(res => sendMessage(res))
  },[])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <WebView 
        source={{ uri: 'http://www.samil.hs.kr/main.php' }}
      />
    </SafeAreaView>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
