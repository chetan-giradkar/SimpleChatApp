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
    let msgList = "";
    chat.forEach(message => {
        if (user !== undefined)
            if (message['sender'] !== 'me') {
                // console.log("I am sender");
                content = '<div class="message"><span class="avatar-message"><img src=';
                content += user['avatar'].concat('></span><span class="message-section"><div class="message-text">', message['message'], '</div><span class="message-time">', getFormattedTime(message['timestamp']), '</span></span></div>');
            } else {
                // console.log("I am receiver");
                content = '<div class="message-me">';
                content = content.concat('<span class="message-section"><div class="message-text">', message['message'], '</div><span class="message-time">', getFormattedTime(message['timestamp']), '</span></span></div>');
            }
        msgList += content;
    });
    return msgList;
}



async function getChatTab(name) {
    content = "<div>Chat Tab</div>";
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
                chat.innerHTML = await getChatTab(nameElement);
            }

        }, 2000);
    });
});