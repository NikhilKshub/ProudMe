const onboardingScreen = document.getElementById("onboarding");
const homeScreen = document.getElementById("home");
const form = document.querySelector("form");
const saveButton = document.getElementById("save-entry");
const entry = document.getElementById("entry");



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
    showTodaysEntry();
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


saveButton.addEventListener("click", function(){
    const text = entry.value.trim();
    if(text === ""){
        return;
    }
    const list = getEntries();
    const today = getToday();
    const todayEntry = list.find(function(savedEntry){
        return savedEntry.date === today;
    });
    if(todayEntry){
        todayEntry.text = text;
    } else {
        list.push({date: today, text: text});
    }
    saveEntries(list);
    saveButton.textContent = "Saved";
    setTimeout(function(){
        saveButton.textContent = "Save";
    },1500);
});

function showTodayEntry(){
    const list = getEntries();
    const today = getToday();
    const todayEntry = list.find(function(savedEntry){
        return savedEntry.date === today;
    });
    if(todayEntry){
        entry.value = todayEntry.text;
    }
}


showDate();
setInterval(showDate,30000);