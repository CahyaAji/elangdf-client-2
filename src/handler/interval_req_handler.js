//gps
let intervalFetchGPS;
let counterIntervalGps;
//compass
let intervalFetchCompass;
let compassOffset = 0;
let headingCompass = 0;
//df
let intervalFetchDF;
let timeStamp = 0;
let dfAbsvalue = "- - -";
let dfRltvalue = "- - -";
let powerValue = "-";

const latInDms = document.getElementById("input-lat");
const lngInDms = document.getElementById("input-lng");

const compassValue = document.getElementById("angle-value-compass");
const compassArrow = document.getElementById("arrow-compass");

const powerLevel = document.getElementById("power-level");
// const confidence = document.getElementById("df-confidence");

const angleAbsv = document.querySelector("#dfabsview>.angle-value");
const arrowAbsv = document.querySelector("#dfabsview>.arrow");
const arrowRltv = document.querySelector("#dfrtlview>.arrow");
const angleRltv = document.querySelector("#dfrtlview>.angle-value");

async function fetchGPS(urlDF) {
  try {
    const response = await fetch(`${urlDF}/api/gps/status`);
    if (!response.ok) {
      throw new Error("Error GPS");
    }
    const dataGPS = await response.json();
    return dataGPS;
  } catch (error) {
    return error;
  }
}

async function fetchCompass(urlDF) {
  try {
    const response = await fetch(`${urlDF}/api/compass`);
    if (!response.ok) {
      throw new Error("Error Compass");
    }
    const dataCompass = await response.json();
    const dataHead = parseFloat(dataCompass.heading);
    return dataHead;
  } catch (error) {
    return error;
  }
}

async function fetchDF(urlDF) {
  try {
    const res = await fetch(`${urlDF}/df`);
    const resText = await res.text();
    const dataArray = resText.split(",");
    const data = {
      time: dataArray[0].trim(),
      heading: dataArray[1].trim(),
      confidence: dataArray[2].trim(),
      power: dataArray[3].trim(),
    };
    return data;
  } catch (error) {
    return error;
  }
}

function startFetchIntervalGPS(urlDF) {
  document.getElementById("btn-read-gps").disabled = true;
  if (intervalFetchGPS) {
    return;
  }
  counterIntervalGps = 0;

  intervalFetchGPS = setInterval(() => {
    fetchGPS(urlDF)
      .then((gps) => {
        latInDms.value = decimalToDMS(gps.data.lat, true);
        lngInDms.value = decimalToDMS(gps.data.lng, false);
      })
      .catch(() => {
        latInDms.value = decimalToDMS(0.0, true);
        lngInDms.value = decimalToDMS(0.0, false);
      });

    counterIntervalGps++;
    if (counterIntervalGps >= 3) {
      stopFetchIntervalGPS();
    }
  }, 3000);
}

function stopFetchIntervalGPS() {
  clearInterval(intervalFetchGPS);
  intervalFetchGPS = null;
  document.getElementById("btn-read-gps").disabled = false;
}

function startFetchIntervalCompass(urlDF) {
  if (intervalFetchCompass) {
    return;
  }

  intervalFetchCompass = setInterval(() => {
    fetchCompass(urlDF)
      .then((data) => {
        headingCompass = (360 + Math.round(data + compassOffset)) % 360;
        compassValue.innerHTML = headingCompass;
        compassArrow.style.display = "block";
        compassArrow.style.transform = `rotate(${headingCompass}deg)`;
      })
      .catch(() => {
        headingCompass = 0;
        compassValue.innerHTML = " - ";
      });
  }, 1000);
}

function changeCompassOffset(data) {
  compassOffset = parseFloat(data);
}

function stopFetchIntervalCompass() {
  clearInterval(intervalFetchCompass);
  intervalFetchCompass = null;
}

//df
function startFetchIntervalDF(urlDF) {
  if (intervalFetchDF) {
    return;
  }
  intervalFetchDF = setInterval(() => {
    fetchDF(urlDF)
      .then((data) => {
        if (timeStamp !== data.time) {
          const df = 360 - parseFloat(data.heading);
          dfAbsvalue = (360 + df + headingCompass) % 360;
          dfRltvalue = df % 360;
          powerValue = parseInt(data.power);
          arrowAbsv.style.display = "block";
          arrowRltv.style.display = "block";
          arrowAbsv.style.transform = `rotate(${dfAbsvalue}deg)`;
          arrowRltv.style.transform = `rotate(${dfRltvalue}deg)`;
          timeStamp = data.time;
        } else {
          arrowAbsv.style.display = "none";
          arrowRltv.style.display = "none";
          dfAbsvalue = "---";
          dfRltvalue = "---";
          powerValue = "-";
        }
        angleAbsv.innerHTML = dfAbsvalue;
        angleRltv.innerHTML = dfRltvalue;
        powerLevel.innerHTML = powerValue + " dB";
        // confidence.innerHTML = data.confidence;
      })
      .catch((error) => {
        dfAbsvalue = "-|-";
        dfRltvalue = "-|-";
        powerValue = "-";
        angleAbsv.innerHTML = dfAbsvalue;
        angleRltv.innerHTML = dfRltvalue;
        powerLevel.innerHTML = powerValue;
        console.log(error);
      });
  }, 1000);
}

function stopFetchIntervalDF() {
  if (intervalFetchDF) {
    clearInterval(intervalFetchDF);
    intervalFetchDF = null;
  }
}
