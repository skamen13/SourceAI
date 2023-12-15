const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { ConvaiClient } = require('convai-web-sdk');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public')); // Папка с клиентскими файлами

// Подключение к Convai API
const convaiClient = new ConvaiClient({
    apiKey: '9e9b4b6f3a9728777efe45752d4b28ac',
    characterId: '15366c64-6ead-11ee-bf04-42010a40000b',
    enableAudio: false, // или true, в зависимости от нужд
    sessionId: 'ffa99ee4629a0a76884c576fa5019647', // ваш идентификатор сессии
    disableAudioGeneration: false, // или true, в зависимости от нужд
});

convaiClient.setResponseCallback((response) => {
    if (response.hasUserQuery()) {
        // Update user text with the received query
        const userText = response.getUserQuery().getTextData();
        console.log(userText);

    }
});

// WebSocket обработчик
wss.on('connection', (ws) => {
    console.log('WebSocket connected');

    ws.on('message', async (message) => {
        // При получении сообщения от клиента
        try {
            const data = JSON.parse(message);

            if (data.type === 'user_text') {
                const userText = data.text;
                // Отправка текста на Convai API и получение ответа
                const response = await convaiClient.sendTextChunk(userText);

                // Отправка ответа от NPC обратно клиенту
                ws.send(JSON.stringify({ type: 'npc_text', text: response }));
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
