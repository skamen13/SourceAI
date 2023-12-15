const ws = new WebSocket('ws://localhost:3000');

ws.addEventListener('open', () => {
    console.log('WebSocket connected');
});

ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'npc_text') {
        displayNPCMessage(data.text);
    }
});

function displayNPCMessage(text) {
    // Отображение сообщения NPC в интерфейсе
    const chatbox = document.getElementById('chatbox');
    const messageElement = document.createElement('div');
    messageElement.textContent = `NPC: ${text}`;
    chatbox.appendChild(messageElement);
}

document.getElementById('sendButton').addEventListener('click', () => {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() !== '') {
        sendMessage(userInput);
        document.getElementById('userInput').value = '';
    }
});

function sendMessage(text) {
    // Отправка сообщения на сервер
    ws.send(JSON.stringify({ type: 'user_text', text }));
}
