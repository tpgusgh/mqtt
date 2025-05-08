import mqtt from 'mqtt';
import { useState, useEffect } from 'react';

function Come() {
  const [payload, setPayload] = useState({ topic: '', message: '' });
  const [connectStatus, setConnectStatus] = useState('Disconnected');

  // MQTT 클라이언트 ID 설정
  const clientId = `emqx_react_${Math.random().toString(16).substring(2, 8)}`;
  const username = 'bssm_free';  // 사용자가 입력한 MQTT 사용자명
  const password = 'bssm_free';  // 사용자가 입력한 MQTT 비밀번호

  useEffect(() => {
    // MQTT 브로커에 연결 (WebSocket 사용)
    const mqttClient = mqtt.connect('ws://broker.emqx.io:8083/mqtt', {
      clientId,
      username,
      password,
    });

    // 연결 성공 시
    const handleConnect = () => {
      setConnectStatus('Connected');
      // 구독할 토픽 설정
      mqttClient.subscribe('bssm/wodnr', (err) => {
        if (!err) {
          console.log('Subscribed to bssm/wodnr');
        }
      });
    };

    // 메시지 수신 시 처리하는 콜백 함수
    const handleMessage = (topic, message) => {
      // 메시지가 수신되면 상태를 업데이트
      setPayload({ topic, message: message.toString() });
      console.log('Received message:', message.toString());
    };

    // 오류 발생 시 처리
    const handleError = (err) => {
      console.error('Connection error:', err);
      setConnectStatus('Disconnected');
      mqttClient.end();
    };

    // MQTT 연결 및 메시지 처리
    mqttClient.on('connect', handleConnect);
    mqttClient.on('message', handleMessage);
    mqttClient.on('error', handleError);

    // 클린업 함수: 컴포넌트가 언마운트될 때 MQTT 연결 종료
    return () => {
      mqttClient.off('connect', handleConnect);
      mqttClient.off('message', handleMessage);
      mqttClient.off('error', handleError);
      mqttClient.end();
    };
  }, []);

  return (
    <>
      <div>
        <h1>MQTT Receive Test</h1>
      </div>
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

export default Come;



/*
#include <WiFi.h>
#include <PubSubClient.h>

// WiFi 설정
const char* ssid = "your_SSID";          // WiFi 네트워크 이름
const char* password = "your_PASSWORD";  // WiFi 비밀번호

// MQTT 브로커 설정
const char* mqtt_server = "broker.emqx.io";  // MQTT 브로커 주소
const int mqtt_port = 1883;                  // MQTT 포트 (기본 포트 1883)
const char* mqtt_user = "bssm_free";         // MQTT 사용자 이름
const char* mqtt_pass = "bssm_free";         // MQTT 비밀번호
const char* mqtt_topic = "bssm/wodnr";       // 퍼블리시할 토픽

WiFiClient espClient;              // WiFi 클라이언트
PubSubClient client(espClient);    // MQTT 클라이언트

// MQTT 연결 함수
void reconnect() {
  if (!client.connected()) {
    while (!client.connected()) {
      Serial.print("Attempting MQTT connection...");
      
      if (client.connect("ESP32_Client", mqtt_user, mqtt_pass)) {
        Serial.println("connected");
      } else {
        Serial.print("failed, rc=");
        Serial.print(client.state());
        delay(5000);
      }
    }
  }
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
  client.setServer(mqtt_server, mqtt_port);  // MQTT 브로커 설정
}

void loop() {
  if (!client.connected()) {
    reconnect();  // MQTT 연결 확인 후 재연결 시도
  }
  client.loop();  // MQTT 클라이언트 루프

  // 메시지 퍼블리시
  String message = "Hello from ESP32!";
  client.publish(mqtt_topic, message.c_str());
  Serial.println("Message sent: " + message);
  
  delay(5000);  // 5초마다 메시지 전송
}


*/