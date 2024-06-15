const urlDF = "http://192.168.17.17:8087";
// const urlDF = "http://localhost:3000";

let btnKeyPressed = "";
let currentView = "";

const spectrumWebv = document.getElementById("spectrum-webv");
const spectrumView = document.getElementById("spectrum-container");
const dfview = document.getElementById("df-view");
const statusWebview = document.getElementById("df-status-webv");
const dfContent = document.querySelector(".df-content");
const freqMenu = document.getElementById("freq-menu");
const compassMenu = document.getElementById("compass-menu");

const dfAbsv = document.getElementById("dfabsview");
const dfRltv = document.getElementById("dfrtlview");

const btnShowDF = document.getElementById("btn-show-df");
const btnShowSetting = document.getElementById("btn-show-setting");
const btnShowLocation = document.getElementById("btn-show-location");
const btnShowSpectrum = document.getElementById("btn-show-spectrum");

const btnUp = document.getElementById("btn-menu-up");
const btnDown = document.getElementById("btn-menu-down");
const btnOk = document.getElementById("btn-menu-ok");
const btnRefresh = document.getElementById("btn-refresh-side");

const notifBox = document.getElementsByClassName("notif-box");
const notif = document.getElementById("notif");

function setDisplayDF() {
  startFetchIntervalDF(urlDF);
  const dfViewMode = document.getElementById("df-view-mode").value;

  currentView = "df";
  spectrumView.src = "";
  spectrumView.style.display = "none";
  statusWebview.src = urlDF + "/config";
  dfview.style.display = "flex";

  dfContent.style.display = "flex";
  if (dfViewMode === "1") {
    dfRltv.style.display = "none";
    dfAbsv.style.display = "flex";
  } else {
    dfRltv.style.display = "flex";
    dfAbsv.style.display = "none";
  }

  freqMenu.style.display = "none";
  compassMenu.style.display = "none";

  btnShowDF.style.backgroundColor = "red";
  btnShowSetting.style.backgroundColor = "var(--bg-color)";
  btnShowLocation.style.backgroundColor = "var(--bg-color)";
  btnShowSpectrum.style.backgroundColor = "var(--bg-color)";
}

function setDisplaySettingFreq() {
  stopFetchIntervalDF();
  currentView = "setting";
  spectrumWebv.src = "";
  spectrumView.style.display = "none";
  statusWebview.src = urlDF + "/config";
  dfview.style.display = "flex";

  dfContent.style.display = "none";
  freqMenu.style.display = "flex";
  compassMenu.style.display = "none";

  btnShowDF.style.backgroundColor = "var(--bg-color)";
  btnShowSetting.style.backgroundColor = "red";
  btnShowLocation.style.backgroundColor = "var(--bg-color)";
  btnShowSpectrum.style.backgroundColor = "var(--bg-color)";
}

function setDisplayLocation() {
  stopFetchIntervalDF();
  currentView = "location";
  spectrumWebv.src = "";
  spectrumView.style.display = "none";
  statusWebview.src = urlDF + "/config";
  dfview.style.display = "flex";

  dfContent.style.display = "none";
  freqMenu.style.display = "none";
  compassMenu.style.display = "flex";

  btnShowDF.style.backgroundColor = "var(--bg-color)";
  btnShowSetting.style.backgroundColor = "var(--bg-color)";
  btnShowLocation.style.backgroundColor = "red";
  btnShowSpectrum.style.backgroundColor = "var(--bg-color)";
}

function setDisplaySpectrum() {
  stopFetchIntervalDF();
  currentView = "spectrum";
  spectrumWebv.src = urlDF + "/spectrum";
  spectrumView.style.display = "flex";
  statusWebview.src = "";
  dfview.style.display = "none";

  dfContent.style.display = "none";
  freqMenu.style.display = "none";
  compassMenu.style.display = "none";

  btnShowDF.style.backgroundColor = "var(--bg-color)";
  btnShowSetting.style.backgroundColor = "var(--bg-color)";
  btnShowLocation.style.backgroundColor = "var(--bg-color)";
  btnShowSpectrum.style.backgroundColor = "red";
}

//Button focus
const parentButtons = document.querySelectorAll(".config-menu");

parentButtons.forEach(function (parentButton) {
  const buttons = parentButton.querySelectorAll("button");
  buttons.forEach(function (button) {
    button.addEventListener("focus", function (event) {
      btnKeyPressed = event.target.id;
    });

    button.addEventListener("blur", function (_event) {
      btnKeyPressed = null;
    });
  });
});

//Side Buttons
btnShowDF.addEventListener("click", () => {
  setDisplayDF();
});
btnShowSetting.addEventListener("click", () => {
  setDisplaySettingFreq();
});
btnShowLocation.addEventListener("click", () => {
  setDisplayLocation();
});
btnShowSpectrum.addEventListener("click", () => {
  setDisplaySpectrum();
});
btnRefresh.addEventListener("click", () => {
  if (currentView === "spectrum") {
    spectrumWebv.src = urlDF + "/spectrum";
  } else {
    getInitSettings(urlDF);
    statusWebview.src = urlDF + "/config";
  }
});
btnUp.addEventListener("mousedown", (event) => {
  event.preventDefault();
  prevMenu();
});
btnDown.addEventListener("mousedown", (event) => {
  event.preventDefault();
  nextMenu();
});
btnOk.addEventListener("mousedown", (event) => {
  event.preventDefault();
  okMenu();
});

function nextMenu() {
  const focusedElement = document.activeElement;
  let id = "";

  if (currentView === "setting") {
    id = "freq-menu";
  }

  if (currentView === "location") {
    id = "compass-menu";
  }

  const nextElement = getNextFocusElement(focusedElement, id);
  console.log(nextElement);
  if (nextElement) {
    nextElement.focus();
  }
}

function prevMenu() {
  const focusedElement = document.activeElement;
  let id = "";

  if (currentView === "setting") {
    id = "freq-menu";
  }

  if (currentView === "location") {
    id = "compass-menu";
  }
  const prevElement = getPrevFocusElement(focusedElement, id);
  if (prevElement) {
    prevElement.focus();
  }
}

function okMenu() {
  if (btnKeyPressed === "btn-set-freq-gain") {
    setFreq(urlDF);
  }
  if (btnKeyPressed === "btn-set-station-id") {
    setStationId(urlDF);
  }
  if (btnKeyPressed === "btn-read-gps") {
    startFetchIntervalGPS(urlDF);
  }

  if (btnKeyPressed === "btn-convert-utm") {
    convertLatLngToUtm();
  }

  if (btnKeyPressed === "btn-set-compass-offset") {
    setCompassOffset();
  }

  if (btnKeyPressed === "btn-save-coord-config") {
    saveCoord();
  }

  if (btnKeyPressed === "btn-restart") {
    restartDF(urlDF);
  }

  if (btnKeyPressed === "btn-turnoff") {
    turnOffDF(urlDF);
  }
}

document.addEventListener("keydown", (event) => {
  // DF View
  if (event.ctrlKey && event.key.toLowerCase() === "r") {
    event.preventDefault();
    if (currentView === "df") {
      return;
    } else {
      setDisplayDF();
    }
  }

  // settings
  if (event.ctrlKey && event.key.toLowerCase() === "e") {
    event.preventDefault();
    if (currentView === "setting") {
      return;
    } else {
      setDisplaySettingFreq();
    }
  }

  // DF view
  if (event.ctrlKey && event.key.toLowerCase() === "w") {
    event.preventDefault();
    if (currentView === "location") {
      return;
    }
    setDisplayLocation();
  }

  // Location
  if (event.ctrlKey && event.key.toLowerCase() === "q") {
    event.preventDefault();
    if (currentView === "spectrum") {
      return;
    }
    setDisplaySpectrum();
  }

  // UP button
  if (event.ctrlKey && event.key.toLowerCase() === "k") {
    prevMenu();
  }

  //down button
  if (event.ctrlKey && event.key.toLowerCase() === "j") {
    nextMenu();
  }

  //OK button
  if (event.ctrlKey && event.key.toLowerCase() === "h") {
    okMenu();
  }

  //Refresh Button
  if (event.ctrlKey && event.key.toLowerCase() === "l") {
    if (currentView === "spectrum") {
      spectrumWebv.src = urlDF + "/spectrum";
    } else {
      getInitSettings(urlDF);
      statusWebview.src = urlDF + "/config";
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  getInitSettings(urlDF);
  startFetchIntervalCompass(urlDF);
  setDisplaySettingFreq();
});

//button pressed
const setFreqGainBtn = document.getElementById("btn-set-freq-gain");
const setStationBtn = document.getElementById("btn-set-station-id");
const latlngToUtmBtn = document.getElementById("btn-convert-utm");
// const saveLatlngBtn = document.getElementById("btn-save-coord");
const readGpsBtn = document.getElementById("btn-read-gps");
const restartBtn = document.getElementById("btn-restart");
const turnOffBtn = document.getElementById("btn-turnoff");
const setCmpsOffsBtn = document.getElementById("btn-set-compass-offset");
const saveCoordBtn = document.getElementById("btn-save-coord-config");

setFreqGainBtn.addEventListener("click", () => {
  setFreq(urlDF);
});

setStationBtn.addEventListener("click", () => {
  setStationId(urlDF);
});

turnOffBtn.addEventListener("click", () => {
  turnOffDF(urlDF);
});

restartBtn.addEventListener("click", () => {
  restartDF(urlDF);
});

// 4°15'2.08"S
// 138°21'34.33"E
readGpsBtn.addEventListener("click", () => {
  startFetchIntervalGPS(urlDF);
});

latlngToUtmBtn.addEventListener("click", () => {
  convertLatLngToUtm();
});

saveCoordBtn.addEventListener("click", () => {
  saveCoord();
});

setCmpsOffsBtn.addEventListener("click", () => {
  setCompassOffset();
});
