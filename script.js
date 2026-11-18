const onboardingScreen = document.getElementById("onboarding");
const homeScreen = document.getElementById("home");
const form = document.querySelector("form");
const saveButton = document.getElementById("save-entry");
const entry = document.getElementById("entry");
const todayTitle = document.getElementById("today-title");
const cancelButton = document.getElementById("cancel-edit");
let editingDate = null;
const quotes = [
    "You're one win away.",
    "I can and I will.",
    "Small steps still move you forward",
    "Keep the promise you made to yourself.",
    "Show up again.That's how change happens.",
    "Today counts, event when it feels ordinary.",
    "Aut viam inveniam aut faciam (I will either find a way or make one.)",
    "Audentes fortuna iuvat (Fortune favors the bold.)"
]
const letterBox = document.getElementById("letter-box");
const missMessage = document.getElementById("miss-message");

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
    document.getElementById("letter-text").textContent = localStorage.getItem("letter");
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
    showEntries();
    showQuote();
    showMissMessage();
}

function showQuote(){
    const index = Math.floor(Math.random() * quotes.length);
    const pick = quotes[index];
    document.getElementById("quote").textContent = pick;
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
function formatDate(dateText){
    return new Date(dateText + "T00:00:00").toLocaleDateString("en-IN",{
        weekday:"short",
        day:"numeric",
        month:"short",
        year:"numeric"
    });
}

function startEditing(savedEntry){
    editingDate = savedEntry.date;
    entry.value = savedEntry.text;
    todayTitle.textContent = "Editing " + formatDate(savedEntry.date);
    cancelButton.classList.remove("hidden");
    entry.focus();
}

function stopEditing(){
    editingDate = null;
    entry.value = "";
    todayTitle.textContent = "Today";
    cancelButton.classList.add("hidden");
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

saveButton.addEventListener("click",function(){
    const text = entry.value.trim();
    if(text === ""){
        return;
    }
    let day = getToday();
    if(editingDate !== null){
        day = editingDate;
    }
    const list = getEntries();
    const foundEntry = list.find(function(savedEntry){
        return savedEntry.date === day;
    });
    if(foundEntry){
        if(editingDate !== null){
            foundEntry.text = text;
        } else {
            foundEntry.text = foundEntry.text + "\n" + text;
        }
    } else {
        list.push({date: day, text: text});
    }
    saveEntries(list);
    stopEditing();
    showEntries();
    saveButton.textContent = "Saved!";
    setTimeout(function(){
        saveButton.textContent = "Save";
    },1500);
});


cancelButton.addEventListener("click", stopEditing);

function showEntries(){
    const entriesList = document.getElementById("entries-list");
    entriesList.innerHTML = "";
    const list = getEntries();
    list.reverse();
    let shown = 0;
    const today = getToday();

    for(const savedEntry of list){
        const entryDiv = document.createElement("div");
        entryDiv.className = "entry";

        const entryTop = document.createElement("div");
        entryTop.className = "entry-top";

        const entryDate = document.createElement("p");
        entryDate.className = "entry-date";

        const entryText = document.createElement("p");
        entryText.className = "entry-text";

        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.textContent = "edit";
        entryDate.textContent = formatDate(savedEntry.date);

        if(savedEntry.date === today){
            entryDate.textContent = "Today · " + entryDate.textContent;
        }
        entryText.textContent = savedEntry.text;
        editButton.addEventListener("click", function(){
            startEditing(savedEntry);
        });

        entryTop.appendChild(entryDate);
        entryTop.appendChild(editButton);
        entryDiv.appendChild(entryTop);
        entryDiv.appendChild(entryText);
        entriesList.appendChild(entryDiv);
        shown++;
    }
    if (shown === 0) {
        entriesList.textContent = "Nothing here yet. Write your first entry above.";
    }
}

function showMissMessage(){
    const list = getEntries();
    let referenceDate;
    if(list.length > 0){
        referenceDate = new Date(list[list.length - 1].date + "T00:00:00");
    } else{
        referenceDate = new Date(localStorage.getItem("startDate") + "T00:00:00");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysPassed = Math.round((today - referenceDate) / (1000 * 60 * 60 * 24));
    const daysMissed = daysPassed - 1;
    if(daysMissed >=2 ){
        missMessage.textContent = "One missed day is a mistake. Two is a choice.";
        letterBox.open = true;
    } else {
        missMessage.textContent = "";
        letterBox.open = false;
    }

}


showDate();
setInterval(showDate,30000);