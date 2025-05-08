import mqtt from "mqtt";
import { useState, useEffect } from "react";

function App() {
  const [payload, setPayload] = useState({ topic: "", message: "" });
  const [connectStatus, setConnectStatus] = useState("Disconnected");
  const clientId = `emqx_react_${Math.random().toString(16).substring(2, 8)}`;
  const username = "bssm_free";
  const password = "bssm_free";
  const [client, setClient] = useState(null);

  useEffect(() => {
    const mqttClient = mqtt.connect("ws://broker.emqx.io:8083/mqtt", {
      clientId,
      username,
      password,
    });

    setClient(mqttClient);

    const handleConnect = () => {
      setConnectStatus("Connected");
      mqttClient.subscribe("bssm/wodnr", (err) => {
        if (!err) {
          console.log("Subscribed to bssm/wodnr"); // 테스트를 위한 Topic
        }
      });
    };

    const handleError = (err) => {
      console.error("Connection error: ", err);
      setConnectStatus("Disconnected");
      mqttClient.end();
    };

    const handleReconnect = () => {
      setConnectStatus("Reconnecting");
    };

    const handleMessage = (topic, message) => {
      console.log("📥 메시지 도착", topic, message.toString());
      setPayload({ topic, message: message.toString() });
    };
    

    mqttClient.on("connect", handleConnect);
    mqttClient.on("error", handleError);
    mqttClient.on("reconnect", handleReconnect);
    mqttClient.on("message", handleMessage);

    return () => {
      mqttClient.off("connect", handleConnect);
      mqttClient.off("error", handleError);
      mqttClient.off("reconnect", handleReconnect);
      mqttClient.off("message", handleMessage);

      mqttClient.end();
    };
  }, []);

  const handlePublish = () => {
    if (client) {
      client.publish("bssm/wodnr", "Hello from React");
    }
  };

  return (
    <>
      <div>
        <h1>MQTT TEST</h1>
      </div>
      <button onClick={handlePublish}>PUBLISH</button>
      <h3>Status: {connectStatus}</h3>
      <div>
        {payload.topic && (
          <div>
            <h3>Topic: {payload.topic}</h3>
            <p>Message: {payload.message}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;