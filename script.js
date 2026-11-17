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
    }
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