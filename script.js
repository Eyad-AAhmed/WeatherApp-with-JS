const input = document.getElementById("city");
const getBtn = document.getElementById("get");
const cityName = document.getElementById("city-name");
const date = document.getElementById("date");
const time = document.getElementById("time");
const icon = document.getElementById("icon");
const icon1 = document.getElementById("icon-1");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity"); 
const wind = document.getElementById("wind"); 
const feelsLike = document.getElementById("feels-like");
const uv = document.getElementById("uv");
const celBtn = document.getElementById("cel");
const fBtn = document.getElementById("f");

let pressedCel = true;
let pressedF = false;

// My api key was from https://www.weatherapi.com 
const apiKey = "YOUR-API-KEY-HERE";

function toCel() {
    if (!pressedCel) {
        let convert = (temp.textContent - 32) * (5/9);
        let convertFeels = (feelsLike.textContent - 32) * (5/9);
        celBtn.style.fontWeight = "700";
        celBtn.style.fontSize = "1.3rem";
        fBtn.style.fontSize = "1em";
        fBtn.style.fontWeight = "100";
        temp.textContent = convert.toFixed(1);
        feelsLike.textContent = convertFeels.toFixed(1);
    } else return;
}

function toF() {
    if (!pressedF) {
        let convert = (temp.textContent*(9/5)) + 32;
        let convertFeels = (feelsLike.textContent*(9/5)) + 32 ;
        fBtn.style.fontSize = "1.3rem"
        celBtn.style.fontSize = "1em";
        celBtn.style.fontWeight = "100";
        fBtn.style.fontWeight = "700";
        temp.textContent = convert.toFixed(1);
        feelsLike.textContent = convertFeels.toFixed(1);
    } else return;
}

async function getWeather(city) {
    try {
        let respond = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
        let data = await respond.json();

        if (data.ok){
            throw new Error("Something went wrong, fetching the api");
        }

        return data;

    } catch (error) {
        console.error(error);
    }
}

function showTime (id) {
    const now = new Date()
    
    date.textContent = now.toLocaleDateString("en-GB" , {
        timeZone: id,
        day: "numeric",
        month: "short"
    });

    time.textContent = now.toLocaleTimeString("en-US", { 
        timeZone: id,
        hour: "2-digit", 
        minute: "2-digit",
        hour12: true
    });
}

async function showWeather(city) {
    data = await getWeather(city);

    if (!data){
        alert("Something went wrong!");
        return;
    }

    console.log(data)

    icon.style.display = "flex";
    icon.src = data.current.condition.icon;

    cityName.textContent = data.location.name;
    temp.textContent = data.current.heatindex_c;

    icon1.src = data.current.condition.icon;

    uv.textContent = "" + data.current.uv;
    feelsLike.textContent = data.current.feelslike_c;
    humidity.textContent = data.current.humidity + "%";
    wind.textContent = data.current.wind_kph + " kph";
    showTime(data.location.tz_id)
    setInterval(showTime, 60000);
}

showTime ("Africa/Cairo")
showWeather("Cairo")

celBtn.addEventListener("click", () => {
    toCel();
    pressedCel = true;
    pressedF = false;
});

fBtn.addEventListener("click", () => {
    toF();
    pressedF = true;
    pressedCel = false;
});

getBtn.addEventListener("click", () => {
    showWeather(input.value)
    input.value = ""
});

input.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        showWeather(input.value)
        input.value = ""
    }
});