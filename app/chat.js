let chat;
fetch('./data/json/chat_person1.json')
    .then(response => response.json())
    .then(data => {
        chat = data;
    });

let user;
async function getActiveUser(name) {
    user = await fetch('./data/json/contacts.json');
    data = await user.json()
    user = data.filter(contact => contact['name'] === name);
    user = user[0];
    return user;
}

function getFormattedTime(timeStamp) {
    timeStamp = timeStamp * 1000;
    let date = new Date(timeStamp);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    let formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime;
}

function getChats() {
    let content = "";
    let msgList = '<div class="msg-list">';
    let inputBox = '<span class="bottom-text-area"><textarea class="text-box" id="message-box" placeholder="Type new message"></textarea><span class="send-btn"><img id="send-btn-id" src="./resources/images/sent.png"></span></span>';
    chat.forEach(message => {
        if (user !== undefined)
            if (message['sender'] !== 'me') {
                content = '<div class="message"><span class="avatar-message"><img src=';
                content += user['avatar'].concat('></span><span class="message-section"><div class="message-text">', message['message'], '</div><span class="message-time">', getFormattedTime(message['timestamp']), '</span></span></div>');
            } else {
                content = '<div class="message-me">';
                content = content.concat('<span class="message-section"><div class="message-text">', message['message'], '</div><span class="message-time">', getFormattedTime(message['timestamp']), '</span></span></div>');
            }
        msgList += content;
    });
    msgList += '</div>';
    return msgList + inputBox;
}



async function getChatTab(name) {
    activeUser = await getActiveUser(name);
    content = getChats(); // although the messages have been hardcoded, the chat file related to the user can also be fetched
    return content;
}

window.addEventListener('load', function() {
    let nameElement;
    let chat = document.getElementById('chat');
    let flag = document.getElementById("flag-btn");

    flag.addEventListener('click', () => {
        nameElement = document.getElementsByClassName('name-heading');
        nameElement = nameElement[0].innerHTML;
        setTimeout(async() => {
            if (nameElement !== "" || nameElement !== undefined) {
                chat.style.flexDirection = "column";
                chat.innerHTML = await getChatTab(nameElement);
                let textBox = document.getElementById("message-box");
                if (textBox !== "" || textBox !== undefined) {
                    let maxHeight = 200;
                    textBox.style.height = "fit-content";
                    textBox.addEventListener('keydown', function() {
                        textBox.style.height = "fit-content";
                        height = Math.min(textBox.scrollHeight, maxHeight);
                        textBox.style.height = height + "px";
                    });
                }
            }

        }, 2000);
    });
});