const API_KEY = "1b6da9f038291881207fbb143e949c64";
async function showWeather () {
    try {
    let city = "dhampur";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    const data = await response.json();
    console.log("Weather data = ", data);
    let newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`  
    document.body.appendChild(newPara);
    }
    catch(err) {
        console.log("Can't load, Server error!");
    }
} 
// showWeather()

const userTab = document.get