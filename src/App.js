import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/websocket");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to WebSocket");
        stompClient.subscribe("/topic/messages", (message) => {
          setMessages((prevMessages) => [...prevMessages, message.body]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>WebSocket Messages</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
