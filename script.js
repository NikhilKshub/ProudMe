const onboardingScreen = document.getElementById("onboarding");
const homeScreen = document.getElementById("home");
const form = document.querySelector("form");


function showCorrectScreen(){
    if(localStorage.getItem("why") === null){
        onboardingScreen.classList.remove("hidden");
        homeScreen.classList.add("hidden");
    } else {
        onboardingScreen.classList.add("hidden");
        homeScreen.classList.remove("hidden");
        fillHome();
    }
}

function fillHome(){
    const whyText = document.getElementById("why-text");
    const goalsList = document.getElementById("goals-list");
    whyText.textContent = localStorage.getItem("why");
    const goals = localStorage.getItem("goals").split("\n");
    goalsList.innerHTML = "";

    for(const line of goals){
        if(line.trim() !== ""){
            const li = document.createElement("li");
            li.textContent = line;
            goalsList.appendChild(li);
        }
    }
    showDaysLeft();
}

function showDate() {
    const now = new Date();
    const date = now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
    });
    document.getElementById("date").textContent = date + " · " + time;
}

function showDaysLeft() {
    const savedEndDate = localStorage.getItem("endDate");
    const endDate = new Date(savedEndDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.round((endDate - today) / (1000 * 60 * 60 * 24));
    document.getElementById("days-number").textContent = Math.max(0, days);
}

function getToday(){
    return new Date().toLocaleDateString("en-CA");
}
function getEntries(){
    const savedEntries = localStorage.getItem("entries");
    if(savedEntries === null){
        return [];
    }
    return JSON.parse(savedEntries);
}
function saveEntries(list){
    localStorage.setItem("entries",JSON.stringify(list));
}

showCorrectScreen();

form.addEventListener("submit", function (event) {
    event.preventDefault();
    localStorage.setItem("why", document.getElementById("why").value);
    localStorage.setItem("feeling", document.getElementById("feeling").value);
    localStorage.setItem("goals", document.getElementById("goals").value);
    localStorage.setItem("startDate", document.getElementById("start-date").value);
    localStorage.setItem("endDate", document.getElementById("end-date").value);
    localStorage.setItem("letter", document.getElementById("letter").value);

    showCorrectScreen();
});

showDate();
setInterval(showDate,30000);