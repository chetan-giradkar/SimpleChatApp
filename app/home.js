let contacts;
fetch('./data/json/contacts.json')
    .then(response => response.json())
    .then(data => {
        contacts = data;
    });


var getFavourites = function() {
    let favouriteContent = '<div class="fav-heading">Favourites</div> <span class="fav-row">';
    // console.log(contacts);
    favourites = contacts.filter((contact) => {
        return contact.isFavourite;
    });
    favourites.forEach(favourite => {
        content = '<span class="favourite"><img class="avatar" src="';
        content += favourite['avatar'].concat('"> </span>');
        favouriteContent += content;
    });
    favouriteContent += "</span>";
    return favouriteContent;
};

async function getData(contact, operation) {
    let msg;
    let chat;
    let lastMsg;
    let count = 0;
    chat = await fetch(contact['chatData']);
    chat = await chat.json();
    switch (operation) {
        case 'lastMessage':
            lastMsg = chat[chat.length - 1]
            if (lastMsg['message'].length > 25) {
                msg = lastMsg['message'].substring(0, 22) + '...';
            } else {
                msg = lastMsg['message'];
            }
            return msg
        case 'lastMessageTime':
            lastMsg = chat[chat.length - 1]
            timeStamp = lastMsg['timestamp'] * 1000;
            if (timeStamp - Date.now() < 60000) {
                return 'just now';
            }
            let date = new Date(timeStamp);
            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            let formattedTime = hours + ':' + minutes.substr(-2);
            return formattedTime;
        case 'unreadCount':
            chat.forEach(chatMsg => {
                if (!chatMsg['read']) {
                    count++;
                }
            });
            return count;
    }
}

let lastMsgArray, lastMsgTimeArray, unreadCountArray;
async function populateUserData() {
    lastMsgArray = new Array(contacts.length);
    lastMsgTimeArray = new Array(contacts.length);
    unreadCountArray = new Array(contacts.length);
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        lastMsgArray[i] = await getData(contact, 'lastMessage');
        lastMsgTimeArray[i] = await getData(contact, 'lastMessageTime');
        unreadCountArray[i] = await getData(contact, 'unreadCount');
    }
}

async function getHomeTab() {
    let tabsContent = '<div class="tabs-heading-row"><span class="tab-heading heading-active">Messages</span><span class="tab-heading">Calls</span><span class="tab-heading">Groups</span></div>';

    //getFavourites
    let content1;
    let favouriteContent = '<div class="fav-heading">Favourites</div> <span class="fav-row">';
    favourites = contacts.filter((contact) => {
        return contact.isFavourite;
    });
    favourites.forEach(favourite => {
        content1 = '<span class="favourite"><img src="';
        content1 += favourite['avatar'].concat('"> <span class="avatar-name">');
        content1 += favourite['name'].concat('</span></span>')
        favouriteContent += content1;
    });
    favouriteContent += "</span>";

    // getChatsSection
    let content2;
    let chatContent = '<div class="chat-list">';
    await populateUserData();

    for (let i = 0; i < contacts.length; i++) {
        content2 = '<div class="chat-peek"><span class="avatar-section"><img src=';
        content2 += contacts[i]['avatar'].concat('></span><span class="name-section"><span class="name">', contacts[i]['name'], '</span><span class="last-message">', lastMsgArray[i], '</span></span><span class="time-section"><span class="time">', lastMsgTimeArray[i], '</span><span class="unread-message">', unreadCountArray[i], '</span></span></div>');
        chatContent += content2;
    }
    chatContent += '</div>';

    let content = tabsContent + favouriteContent + chatContent;
    return content;
}

function navigateToChatScreen(e) {
    let name = e['path'][1]['innerText'];
    // console.log(name);
    let search = document.getElementsByClassName('search');
    search = search[0];
    let nameSection = document.getElementsByClassName('name-heading-section');
    nameSection = nameSection[0];
    let nameElement = document.getElementsByClassName('name-heading');
    nameElement = nameElement[0];
    let optionsElement = document.getElementsByClassName('options');
    optionsElement = optionsElement[0];
    let flag = document.getElementById('flag-btn');
    let chatTab = document.getElementById('chat');

    chatTab.innerHTML = '<div class="loader">Loading...</div>'

    search.style.visibility = "hidden";
    search.style.width = "0";
    nameElement.innerHTML = name;
    nameSection.style.visibility = "visible";
    nameSection.style.fontSize = "28px";
    optionsElement.style.fontSize = "50px";
    optionsElement.style.visibility = "visible";
    flag.click();
}

function navigateToChatTab(e) {
    console.log(e.target);
    let name = e.path[2].children[1].children[0].innerText
    if (name === "" || name === undefined) {
        console.log(name);
    }

    let search = document.getElementsByClassName('search');
    search = search[0];
    let nameSection = document.getElementsByClassName('name-heading-section');
    nameSection = nameSection[0];
    let nameElement = document.getElementsByClassName('name-heading');
    nameElement = nameElement[0];
    let optionsElement = document.getElementsByClassName('options');
    optionsElement = optionsElement[0];
    let flag = document.getElementById('flag-btn');
    let chatTab = document.getElementById('chat');

    chatTab.innerHTML = '<div class="loader">Loading...</div>'

    search.style.visibility = "hidden";
    search.style.width = "0";
    nameElement.innerHTML = name;
    nameSection.style.visibility = "visible";
    nameSection.style.fontSize = "28px";
    optionsElement.style.fontSize = "50px";
    optionsElement.style.visibility = "visible";
    flag.click();
}


window.addEventListener('load', async() => {
    let home = document.getElementById('home');
    await setTimeout(async() => {
        home.innerHTML = await getHomeTab();
    }, 100);

    let favouriteItems = document.getElementsByClassName('favourite');
    setTimeout(() => {
        for (var i = 0; i < favouriteItems.length; i++) {
            fav = favouriteItems[i];
            fav.addEventListener('click', navigateToChatScreen);
        }
    }, 500);

    let chats = document.getElementsByClassName('chat-peek');
    setTimeout(() => {
        // console.log(chats[0])
        for (var i = 0; i < chats.length; i++) {
            con = chats[i];
            con.addEventListener('click', navigateToChatTab);
        }
    }, 500);
});