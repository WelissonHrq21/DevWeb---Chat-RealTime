const formLogin = document.querySelector('#login-form');
const inputUser = document.querySelector('#input-login');
const loginPage = document.querySelector('.login');

const chat = document.querySelector('.chat');
const Chatform = document.querySelector('#chat-form');
const Chatinput = document.querySelector('#chat-input');
const chatMessagesArea= document.querySelector('#chat-messages-area');
const footer = document.querySelector('footer');

const frontQtdeUser = document.querySelector('#qtde-users');

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
];


const user = {
    id: "",
    name: "",
    color: ""
}

let websocket;

const createMessageSelfElement = (content) => {
    const div = document.createElement('div');
    div.classList.add('user-message');
    div.innerHTML = content;

    return div;
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement('div');
    const span = document.createElement('span');


    div.classList.add('other-message');
    span.classList.add('message--sender');
    span.style.color = senderColor;

    div.appendChild(span);

    span.innerHTML = sender;

    div.innerHTML += content;

    return div;
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);

    return colors[randomIndex];
}

const processMessage = ({ data }) => {
    const message = JSON.parse(data);

    if (message.type === 'qtdeUsers') {
        const qtdeUsers = parseInt(message.data);
        frontQtdeUser.textContent = `${qtdeUsers} Usuários Ativos`;
        console.log('Quantidade de usuários atualizada: ', qtdeUsers);
    } else {
        const { userID, username, userColor, content } = message;
        const messageElement = userID === user.id ? createMessageSelfElement(content) : createMessageOtherElement(content, username, userColor);
        chatMessagesArea.appendChild(messageElement);
        chatMessagesArea.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
}
    
let usersqtde = 0;
const handleLogin = (event) => {
    event.preventDefault();
    
    user.id = crypto.randomUUID();
    user.name = inputUser.value;
    user.color = getRandomColor();
    
    loginPage.style.display = 'none';
    chat.style.display = 'flex';

    websocket = new WebSocket("wss://devweb-chat-realtime-backend.onrender.com");;
    websocket.onmessage = processMessage;

    inputUser.value = ''
}

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userID: user.id,
        username: user.name,
        userColor: user.color,
        content: Chatinput.value
    }

    websocket.send(JSON.stringify(message));

    Chatinput.value = '';
}

formLogin.addEventListener('submit', handleLogin),
Chatform.addEventListener('submit', sendMessage);


