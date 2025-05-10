import mqtt from "mqtt";
import { useState, useEffect } from "react";

function Send() {
  const [payload, setPayload] = useState({ topic: "", message: "" });
  const [connectStatus, setConnectStatus] = useState("Disconnected");
  const clientId = `emqx_react_${Math.random().toString(16).substring(2, 8)}`;
  const username = "bssm_free"; //클라에셔햐교
  const password = "bssm_free"; //esp에서도 설정 필수
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

export default Send;





/*
#include <WiFi.h>
#include <PubSubClient.h>

// WiFi 설정
const char* ssid = "your_SSID";         // WiFi 네트워크 이름
const char* password = "your_PASSWORD"; // WiFi 비밀번호

// MQTT 설정
const char* mqtt_server = "broker.emqx.io"; // MQTT 브로커 주소
const int mqtt_port = 1883;                 // MQTT 포트 (기본 포트는 1883)
const char* mqtt_user = "bssm_free";        // MQTT 사용자 이름
const char* mqtt_pass = "bssm_free";        // MQTT 비밀번호
const char* mqtt_topic = "bssm/wodnr";      // 구독할 토픽

WiFiClient espClient;            // WiFi 클라이언트
PubSubClient client(espClient);  // MQTT 클라이언트

// MQTT 연결 함수
void reconnect() {
  // WiFi 연결 확인
  if (!client.connected()) {
    while (!client.connected()) {
      Serial.print("Attempting MQTT connection...");

      // MQTT 클라이언트 연결 시도
      if (client.connect("ESP32_Client", mqtt_user, mqtt_pass)) {
        Serial.println("connected");

        // 구독 시작
        client.subscribe(mqtt_topic);
      } else {
        Serial.print("failed, rc=");
        Serial.print(client.state());
        delay(5000);
      }
    }
  }
}

// 수신된 메시지를 처리하는 콜백 함수
void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.println("Received Message:");
  Serial.print("Topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  Serial.println(message);
}

void setup() {
  // 시리얼 포트 시작
  Serial.begin(115200);

  // WiFi 연결
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // MQTT 클라이언트 설정
  client.setServer(mqtt_server, mqtt_port);   // MQTT 브로커 설정
  client.setCallback(callback);                // 콜백 함수 설정
}

void loop() {
  if (!client.connected()) {
    reconnect();  // 연결이 끊어지면 재연결 시도
  }
  client.loop();  // MQTT 클라이언트 루프 실행
}


*/