const { WebSocketServer, WebSocket } = require('ws');
const dotenv = require('dotenv');
dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

let qtdeUsers = 0;

function broadcastQtdeUsers() {
    const message = JSON.stringify({
        type: 'qtdeUsers',
        data: qtdeUsers
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

wss.on("connection", (ws) => {
    qtdeUsers += 1;

    broadcastQtdeUsers();

    ws.on("error", console.error);

    ws.on("message", (data) => {
        wss.clients.forEach((client) => client.send(data.toString()));
    });

    console.log('Usuário Conectado. Usuários conectados: ', qtdeUsers);

    ws.on('close', () => {
        qtdeUsers -= 1;

        broadcastQtdeUsers();
        console.log('Usuario desconectado. Total de usuários: ', qtdeUsers);
    });
});





