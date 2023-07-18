const state = {
  input: document.querySelector(".search"),
  button: document.querySelector(".button"),
  body: document.querySelector(".weather-body"),
  img: document.querySelector("img"),
  span: document.querySelector(".weather-body-span"),
  desc: document.createElement("div"),
};

let { input, button, body, img, span, desc } = state;

(function () {
  desc.classList.add("weather-body-div");
  img.style.display = "none";
  body.style.display = "hidden";
})();
function weatherInfo() {
  bodyStyle();
  let city = inputCity();
  if (city) {
    getData(city);
  } else {
    clearInput();
    img.src = "./images/not.png";
    img.style.display = "block";
    notFound();
  }
}
function notFound() {
  desc.innerHTML = "<span>Not Found</span>";
  desc.style.textAlign = "center";
  body.appendChild(desc);
}
function inputCity() {
  let inp = input.value.trim();
  inp = inp.split("").filter((elem) => {
    return elem !== " ";
  });
  return inp.join("");
}
function bodyStyle() {
  body.style.display = "flex";
  body.style.opacity = 1;
  body.style.visibility = "visible";
  body.style.marginTop = "48px";
}
function clearInput() {
  input.value = "";
}
button.addEventListener("click", weatherInfo);
document.addEventListener("keypress", (key) => {
  if (key.code === "Enter") {
    weatherInfo();
  }
});

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition((location) => {
    currentLocationWeather(location.coords.latitude, location.coords.longitude);
  },
    (err) => {
      throw new Error(err);
    })
}

async function currentLocationWeather(lat, lon) {
  try {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=e34bf48faf93288d455e57db11fb58bb`);
    const res = await response.json();
    console.log(res);
    bodyStyle();
    drawWeather(res);
  } catch (error) {
    throw new Error(error);
  }
}

async function getData(city) {
  try {
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=e34bf48faf93288d455e57db11fb58bb`
    );
    let res = await resp.json();
    drawWeather(res);
  } catch (err) {
    img.src = "./images/not.png";
    img.style.display = "block";
    notFound();
    throw new Error(err);
  } finally {
    clearInput();
  }
}

function drawWeather(res) {
  img.style.display = "block";
  desc.innerHTML = `
        <div class="location">
        <span class="material-symbols-outlined">location_on</span>
        <span>${res.name} ${Math.round(res.main.temp)}℃</span>
        <div class="max-min">
        <span class="left">Max.: ${Math.ceil(res.main.temp_max)}℃</span>
        <span>Min.: ${Math.floor(res.main.temp_min)}℃</span>
        </div>
        <p class="description">${res.weather[0].description}</p>
        </div>
        <div class="info">
        <div>
        <img src="./images/wh.png" class="humadity">
        <span>${res.main.humidity}%</span><br/>
        <span class="type">Humadity</span>
        </div>
        <div>
        <span class="material-symbols-outlined">air</span>
        <span>${res.wind.speed} Km/H</span><br/>
        <span class="type">Wind Speed</span>
        </div>
        </div>
        `;
  body.appendChild(desc);
  switch (res.weather[0].main) {
    case "Clouds":
      img.src = "./images/cloud.png";
      break;
    case "Clear":
      img.src = "./images/sun.png";
      break;
    case "Rain":
      img.src = "./images/rain.png";
      break;
    case "Snow":
      img.src = "./images/snow.png";
      break;
    case "Haze":
      img.src = "./images/haze.png";
      break;
    case "Sand":
      img.src = "./images/sand1.png";
      break;
    default:
      img.src = "./images/sand1.png";
      break;
  }
}
getCurrentLocation();