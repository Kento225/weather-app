const locationInput = document.querySelector(".location-input");
const locationSubmit = document.querySelector(".location-submit");
const unitBtn = document.querySelector(".unit-switch");

let unitMode = "c";
let unitSym = "°C";
let locationFetch = "london";

const switchToC = () => {
  unitMode = "c";
  unitSym = "°C";
};
const switchToF = () => {
  unitMode = "f";
  unitSym = "F";
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
    `http://api.weatherapi.com/v1/forecast.json?key=58c780e453c543619b4153834231205&days=7&q=${locationFetch}`
  );
  const infoJson = await info.json();
  console.log(infoJson);

  return await infoJson;
};

const getCurrentTemps = async () => {
  const data = await fetchData();

  const currentWeather = data.current.condition.text;

  let currentTemp = "";
  let currentFeels = "";

  if (unitMode === "c") {
    currentTemp = data.current.temp_c;
    currentFeels = data.current.feelslike_c;
  } else if (unitMode === "f") {
    currentTemp = data.current.temp_f;
    currentFeels = data.current.feelslike_f;
  }
  return { currentWeather, currentTemp, currentFeels };
};

const changeLocation = () => {
  locationFetch = locationInput.value;
  locationInput.value = "";
};

const getLocation = async () => {
  const data = await fetchData();
  const city = data.location.name;
  const country = data.location.country;
  return { city, country };
};

const getLastUpdate = async () => {
  const data = await fetchData();
  const lastUpdateData = data.current.last_updated;
  return lastUpdateData;
};

const getHumidityData = async () => {
  const data = await fetchData();
  const humidityData = data.current.humidity;
  return humidityData;
};
const getWindSpeedData = async () => {
  const data = await fetchData();
  const windSpeedData = data.current.wind_kph;
  return windSpeedData;
};

const renderMiddleDiv = async () => {
  const countryDiv = document.querySelector(".country");
  const cityDiv = document.querySelector(".city");
  const weatherDiv = document.querySelector(".weather");
  const boldSpanTemp = document.querySelector("#temp");
  const boldSpanFeels = document.querySelector("#feels");
  const lastUpdate = document.querySelector(".last-updated");

  const location = await getLocation();
  const currentTemps = await getCurrentTemps();
  const lastUpdateData = await getLastUpdate();
  const humidityData = await getHumidityData();
  const windSpeedData = await getWindSpeedData();

  lastUpdate.textContent = `Last updated: ${lastUpdateData}`;

  countryDiv.textContent = location.country;
  cityDiv.textContent = location.city;

  weatherDiv.textContent = `${currentTemps.currentWeather}`;
  boldSpanTemp.textContent = `${currentTemps.currentTemp}${unitSym}`;
  boldSpanFeels.textContent = `${currentTemps.currentFeels}${unitSym}`;

  const humidityP = document.querySelector(".humidity p");
  humidityP.textContent = `${humidityData}%`;

  const windSpeedP = document.querySelector(".wind-speed p");
  windSpeedP.textContent = `${windSpeedData}kph`;
};

const setFavIcon = async () => {
  const head = document.querySelector("head");

  const data = await fetchData();
  const link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement("link");
  link.type = "image/x-icon";
  link.rel = "shortcut icon";
  link.href = data.current.condition.icon;
  head.appendChild(link);
};

const setGradients = async () => {
  const body = document.querySelector("body");

  const data = await fetchData();
  const currentWeather = data.current.condition.text;

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
  await renderLeftDiv();
});

locationSubmit.addEventListener("click", async () => {
  changeLocation();
  await getCurrentTemps();
  await renderMiddleDiv();
  await setGradients();
  await setFavIcon();
  await renderLeftDiv();
});

addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    changeLocation();
    await getCurrentTemps();
    await renderMiddleDiv();
    await setGradients();
    await setFavIcon();
  }
});

const getForecastTemps = (element) => {
  if (unitMode === "c") {
    const maxTemp = element.day.maxtemp_c;
    const minTemp = element.day.mintemp_c;
    return { maxTemp, minTemp };
  } else if (unitMode === "f") {
    const maxTemp = element.day.maxtemp_c;
    const minTemp = element.day.mintemp_c;
    return { maxTemp, minTemp };
  }
};

const renderLeftDiv = async () => {
  const leftDiv = document.querySelector(".left");
  leftDiv.innerHTML = "";

  const data = await fetchData();
  const forecastArray = data.forecast.forecastday;
  forecastArray.forEach((element) => {
    const date = new Date(element.date);
    console.log(date);

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");

    const dayH3 = document.createElement("h3");
    dayH3.textContent = date.toLocaleDateString("default", { weekday: "long" });

    const dayCondition = document.createElement("p");
    dayCondition.textContent = element.day.condition.text;

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
    leftDiv.appendChild(dayDiv);
  });
};

renderLeftDiv();
setFavIcon();
setGradients();
renderMiddleDiv();
getCurrentTemps();

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
