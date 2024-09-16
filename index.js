const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAcess = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector("[data-loading-container]");
const userInfoContainer = document.querySelector(".user-info-container")


let oldTab = userTab;
const API_KEY = "1b6da9f038291881207fbb143e949c64";
oldTab.classList.add('currentTab');
getfromSessionStorage();

function switchTab(newTab) {
    if(newTab == oldTab) {
        // alert('Click different tab');
        return;
    }
    if(newTab !== oldTab){
        oldTab.classList.remove("currentTab");
        oldTab = newTab;
        oldTab.classList.add("currentTab");
    }
    
    if(!searchForm.classList.contains("active")) {
        // check searchform wala conainer is invisible, if yes then make it visible.
        userInfoContainer.classList.remove("active");
        grantAcess.classList.remove("active");
        searchForm.classList.add("active");
    }
    
    else {
        // phly search wale tab pr the or ab your weather visible krna
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        // ab i am standing on your weather ap, now display the weather, so first check the local storage for coordinates , if we have saved or not there..
        getfromSessionStorage();
    }
}





// check if coordinates are already present in session storage or not
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        // agr local coordinates nahi mile -- nahi mile ka mtlb hai ki location mil gyi hai
        grantAcess.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make the grantContainer invisible
    grantAcess.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        console.log(err)
        alert('hi')
    }
}


userTab.addEventListener('click', ()=> {
    // pass the clicked tab as the input parameter.
    switchTab(userTab);
})
searchTab.addEventListener('click', ()=> {
    // pass the clicked tab as the input parameter.
    switchTab(searchTab);
})



function renderWeatherInfo(weatherInfo) {
    // first we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const windspeed = document.querySelector("[data-windspeed]")
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]")
    const temp = document.querySelector("[data-temp]")
    // fetch values from weatherInfo object and put in UI elements 
    console.log(weatherInfo);
    console.log(weatherInfo.weather[0].icon);

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    // temp.innerText = `${(weatherInfo?.main?.temp - 273.15).toFixed(2)} °C`;
    // FORMULAS-->  Celsius=Kelvin−273.15
    // receive from the OpenWeatherMap API is in Kelvin by default.

    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert('Hello!');
    }
}

function showPosition(position) {
    
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchuserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    let cityName = searchInput.value

    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {

    }
}
