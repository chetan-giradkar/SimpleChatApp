// process on page load complete
window.addEventListener('load', function() {
    // get searchIcon html element
    let searchIcon = document.getElementById('search-icon');

    // get searchBox html element
    let searchBox = document.getElementById('search-text-input');

    // get back arrow html element
    let backArrow = document.getElementById('arrow-back')

    // get tabs html elements
    let home = document.getElementById('home');
    let chat = document.getElementById('chat');

    // timer variable
    let timerId;

    // page flag
    let page = 'home';


    // Debounce function: Input as function which needs to be debounced 
    // and delay is the debounced time in milliseconds
    var debounceFunction = function(func, delay) {
        // Cancels the setTimeout method execution
        clearTimeout(timerId);

        // Executes the func after delay time.
        timerId = setTimeout(func, delay);
    }

    var searchForString = function() {
        console.log(searchBox.value)
    }

    chat.innerHTML = getChatTab();

    // add event listener on searchIcon when clicked
    searchIcon.addEventListener('click', searchForString);

    // add event listener on searchBox for input
    searchBox.addEventListener('input', () => {
        debounceFunction(searchForString, 700);
    });

    // add event listener on backArrow for click
    backArrow.addEventListener('click', () => {
        if (page === 'chat') {
            page = 'home';
            chat.style.visibility = "hidden";
            chat.style.height = "0";
            chat.style.width = "0";
            home.style.visibility = "visible"
            home.style.height = "100%";
            home.style.width = "100%";

            let search = document.getElementsByClassName('search');
            search = search[0];
            let nameSection = document.getElementsByClassName('name-heading-section');
            nameSection = nameSection[0];
            let nameElement = document.getElementsByClassName('name-heading');
            nameElement = nameElement[0];
            let optionsElement = document.getElementsByClassName('options');
            optionsElement = optionsElement[0];

            search.style.visibility = "visible";
            search.style.width = "55%"
            nameElement.innerHTML = "";
            nameSection.style.visibility = "hidden";
            nameSection.style.fontSize = "0";
            optionsElement.style.fontSize = "0";
            optionsElement.style.visibility = "hidden";
        }
    });

    let flag = document.getElementById("flag-btn");
    flag.addEventListener('click', () => {
        if (page === 'home') {
            page = 'chat';
            chat.style.visibility = "visible";
            chat.style.height = "100%";
            chat.style.width = "100%";
            home.style.visibility = "hidden"
            home.style.height = "0";
            home.style.width = "0";
        }
    });

    // window.addEventListener("beforeunload", event => {
    //     alert("Cant Reload");
    //     event.preventDefault();
    //     // Chrome requires returnValue to be set.
    //     event.returnValue = ""
    // });

});