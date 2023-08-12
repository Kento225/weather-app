const locationInput = document.querySelector(".location-input");
const locationSubmit = document.querySelector(".location-submit");
const unitBtn = document.querySelector(".unit-switch");

let unitMode = "c";
let unitSym = "°C";
let locationFetch = "london";

let infoJson = "";

const switchToC = () => {
  unitMode = "c";
  unitSym = "°C";
  unitBtn.textContent = "°C";
};
const switchToF = () => {
  unitMode = "f";
  unitSym = "F";
  unitBtn.textContent = "F";
};

const switchUnit = () => {
  if (unitMode === "c") {
    switchToF();
  } else if (unitMode === "f") {
    {
      switchToC();
    }
  }
};

const fetchData = async () => {
  const info = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=58c780e453c543619b4153834231205&days=7&q=${locationFetch}`
  );
  infoJson = await info.json();
};

const getCurrentTemps = async () => {
  const currentWeather = await infoJson.current.condition.icon;

  let currentTemp = "";
  let currentFeels = "";

  if (unitMode === "c") {
    currentTemp = await infoJson.current.temp_c;
    currentFeels = await infoJson.current.feelslike_c;
  } else if (unitMode === "f") {
    currentTemp = await infoJson.current.temp_f;
    currentFeels = await infoJson.current.feelslike_f;
  }
  return { currentWeather, currentTemp, currentFeels };
};

const changeLocation = async () => {
  locationFetch = locationInput.value;
  await fetchData();
  locationInput.value = "";
};

const getLocation = async () => {
  const city = await infoJson.location.name;
  const country = await infoJson.location.country;
  return { city, country };
};

const getLastUpdate = async () => {
  const lastUpdateData = await infoJson.current.last_updated;
  return lastUpdateData;
};

const getHumidityData = async () => {
  const humidityData = await infoJson.current.humidity;
  return humidityData;
};
const getWindSpeedData = async () => {
  const windSpeedData = await infoJson.current.wind_kph;
  return windSpeedData;
};

const renderMiddleDiv = async () => {
  const lastUpdateData = await getLastUpdate();
  const humidityData = await getHumidityData();

  const lastUpdate = document.querySelector(".last-updated");
  lastUpdate.textContent = `Last updated: ${lastUpdateData}`;

  const location = await getLocation();
  const countryDiv = document.querySelector(".country");
  countryDiv.textContent = location.country;
  const cityDiv = document.querySelector(".city");
  cityDiv.textContent = location.city;

  const currentTemps = await getCurrentTemps();
  const weatherImg = document.querySelector(".weather");
  weatherImg.src = `${currentTemps.currentWeather}`;
  const boldSpanTemp = document.querySelector("#temp");
  boldSpanTemp.textContent = `${currentTemps.currentTemp}${unitSym}`;
  const boldSpanFeels = document.querySelector("#feels");
  boldSpanFeels.textContent = `${currentTemps.currentFeels}${unitSym}`;

  const humidityP = document.querySelector(".humidity p");
  humidityP.textContent = `${humidityData}%`;

  const windSpeedData = await getWindSpeedData();
  const windSpeedP = document.querySelector(".wind-speed p");
  windSpeedP.textContent = `${windSpeedData}kph`;
};

const setFavIcon = async () => {
  const head = document.querySelector("head");

  const link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement("link");
  link.type = "image/x-icon";
  link.rel = "shortcut icon";
  link.href = await infoJson.current.condition.icon;
  head.appendChild(link);
};

const setGradients = async () => {
  const body = document.querySelector("body");

  const currentWeather = await infoJson.current.condition.text;

  weatherGradients.forEach((element) => {
    if (element.condition === currentWeather) {
      body.style.background = element.gradient;
    }
  });
};

unitBtn.addEventListener("click", async () => {
  switchUnit();
  await getCurrentTemps();
  await renderMiddleDiv();
  await renderBottomDiv();
});

const renderOnLocationSubmit = async () => {
  await changeLocation();
  await getCurrentTemps();
  await renderMiddleDiv();
  await setGradients();
  await setFavIcon();
  await renderBottomDiv();
};

locationSubmit.addEventListener("click", async () => {
  await renderOnLocationSubmit();
});

addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    await renderOnLocationSubmit();
  }
});

const getForecastTemps = (element) => {
  if (unitMode === "c") {
    const maxTemp = element.day.maxtemp_c;
    const minTemp = element.day.mintemp_c;
    return { maxTemp, minTemp };
  } else if (unitMode === "f") {
    const maxTemp = element.day.maxtemp_f;
    const minTemp = element.day.mintemp_f;
    return { maxTemp, minTemp };
  }
};

const renderBottomDiv = async () => {
  const bottomDiv = document.querySelector(".bottom");
  bottomDiv.innerHTML = "";

  const forecastArray = await infoJson.forecast.forecastday;
  forecastArray.forEach((element) => {
    const date = new Date(element.date);

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");

    const dayH3 = document.createElement("h3");
    dayH3.textContent = date.toLocaleDateString("default", { weekday: "long" });

    const dayCondition = document.createElement("img");
    dayCondition.src = element.day.condition.icon;

    const dayMax = document.createElement("p");
    dayMax.textContent = `${getForecastTemps(element).maxTemp}${unitSym}`;

    const dayMin = document.createElement("p");
    dayMin.textContent = `${getForecastTemps(element).minTemp}${unitSym}`;

    const chanceOfRain = document.createElement("p");
    chanceOfRain.textContent = `Chance of rain - ${element.day.daily_chance_of_rain}%`;

    dayDiv.appendChild(dayH3);
    dayDiv.appendChild(dayCondition);
    dayDiv.appendChild(dayMax);
    dayDiv.appendChild(dayMin);
    dayDiv.appendChild(chanceOfRain);
    bottomDiv.appendChild(dayDiv);
  });
};

const initialRender = async () => {
  await fetchData();
  await renderBottomDiv();
  await setFavIcon();
  await setGradients();
  await renderMiddleDiv();
  await getCurrentTemps();
};

const weatherGradients = [
  {
    condition: "Sunny",
    gradient:
      "linear-gradient(315deg, rgba(156, 108, 0, 1) 53%, rgba(191, 213, 219, 1) 100%)",
  },
  {
    condition: "Cloudy",
    gradient:
      "linear-gradient(315deg, rgba(143,163,186,1) 26%, rgba(191,213,219,1) 100%)",
  },
  {
    condition: "Partly cloudy",
    gradient:
      "linear-gradient(315deg, rgba(0, 75, 156, 1) 53%, rgba(191, 213, 219, 1) 100%)",
  },
  {
    condition: "Mist",
    gradient:
      "linear-gradient(315deg, rgba(108,119,133,1) 26%, rgba(191,213,219,1) 100%)",
  },
  {
    condition: "Overcast",
    gradient:
      "linear-gradient(315deg, rgba(108,119,133,1) 26%, rgba(191,213,219,1) 100%)",
  },
  {
    condition: "Fog",
    gradient:
      "linear-gradient(315deg, rgba(108,119,133,1) 26%, rgba(191,213,219,1) 100%)",
  },
  {
    condition: "Moderate rain at times",
    gradient:
      "linear-gradient(315deg, rgba(108,119,133,1) 26%, rgba(191,213,219,1) 100%)",
  },
  {
    condition: "Moderate rain",
    gradient:
      "linear-gradient(315deg, rgba(108,119,133,1) 26%, rgba(191,213,219,1) 100%)",
  },
  {
    condition: "Heavy rain at times",
    gradient:
      "linear-gradient(315deg, rgba(108,119,133,1) 26%, rgba(191,213,219,1) 100%)",
  },
  {
    condition: "Heavy rain",
    gradient:
      "linear-gradient(315deg, rgba(108,119,133,1) 26%, rgba(191,213,219,1) 100%)",
  },
  {
    condition: "Light freezing rain",
    gradient:
      "linear-gradient(315deg, rgba(108,119,133,1) 26%, rgba(191,213,219,1) 100%)",
  },
  {
    condition: "Moderate or heavy freezing rain",
    gradient:
      "linear-gradient(315deg, rgba(108,119,133,1) 26%, rgba(191,213,219,1) 100%)",
  },
  {
    condition: "Clear",
    gradient:
      "linear-gradient(315deg, rgba(182,89,19,1) 0%, rgba(100,80,124,1) 100%)",
  },
];

initialRender();
