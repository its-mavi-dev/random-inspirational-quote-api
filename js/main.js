var icon = document.getElementById("btn-theme-change");
localStorage.setItem("currentTheme", localStorage.getItem("currentTheme"));

icon.onclick = function () {
    document.body.classList.toggle("light-theme");
    if (document.body.classList.contains("light-theme")) {
        document.getElementById("btn-theme-change").src = "images/moon.png"; //light theme is on show moon icon
        localStorage.setItem("currentTheme", "light");
    } else {
        document.getElementById("btn-theme-change").src = "images/sun.png"; //dark theme is on show sun icon
        localStorage.setItem("currentTheme", "dark");
    }
}
document.body.onload = function () {
    if (localStorage.getItem("currentTheme") === "dark") {
        document.body.classList.remove("light-theme");
        document.getElementById("btn-theme-change").src = "images/sun.png";
    }
    if (localStorage.getItem("currentTheme") === "light") {
        document.body.classList.add("light-theme");
        document.getElementById("btn-theme-change").src = "images/moon.png";
    }
}

function getData() {
    var randomPage = Math.floor(Math.random() * 93) + 1;
    var url = "https://api.quotable.io/quotes?page=" + randomPage;
    var quoteArray = null;
    let ts = Math.round((new Date()).getTime() / 1000);
    fetch(url).then((response) => {
        return response.json();
    }).then((data) => {
        quoteArray = JSON.stringify(data);
        localStorage.setItem("QuotesData", quoteArray);
        localStorage.setItem("timestamp", ts);
    })
}

const timeToShowNewQuote = 20000; //20sec 000
let refresh = 0;

function fetchLocalQuotes() {
    let timeout = 0;
    if (!localStorage.getItem('QuotesData')) {
        getData();
        timeout = 1000;
    } else {
        timeout = 0;
    }

    var timeLeft = 18;
    var downloadTimer = setInterval(function () {
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
        }
        document.getElementById("progressBar").value = 19 - timeLeft;
        timeLeft -= 1;
    }, 1000);

    setTimeout(function () {

        let quoteArray = localStorage.getItem('QuotesData');
        quoteArray = JSON.parse(quoteArray);
        refresh = (quoteArray) ? Math.round(localStorage.getItem("timestamp") - (new Date().getTime() / 1000)) : 0;
        if (!quoteArray || refresh < 10) {
            getData();
        }
        var randomIndex = Math.floor(Math.random() * 20);
        var mainQuote = quoteArray.results[randomIndex].content;
        var authorName = quoteArray.results[randomIndex].author;
        document.getElementById("progressBar").value = 0;
        document.getElementById("editQuote").innerHTML = mainQuote;
        document.getElementById("editAuthor").textContent = authorName;

        console.log('The Quotable API will refresh in ' + refresh + ' seconds.');
    }, timeout);
    console.log(refresh);
}

fetchLocalQuotes();
setInterval(function () {
    fetchLocalQuotes();
}, timeToShowNewQuote);