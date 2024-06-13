let prevCenterFreq = 0;
let prevAntSpace = 0;

function setAntena(fetchURL, antSpace) {
  if (prevAntSpace === antSpace) {
    return;
  }

  let typeAnt = "vhf";
  if (antSpace <= 0.25) {
    typeAnt = "uhf";
  }

  prevAntSpace = antSpace;

  fetch(fetchURL + "/api/ant/" + typeAnt, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success, " + JSON.stringify(result));
    })
    .catch((error) => {
      showNotifBox("Error", "Error fetch set antenna");
    });
}

function setFreqReq(fetchURL, dataFreq) {
  fetch(fetchURL + "/api/settings/freq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataFreq),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success, " + JSON.stringify(result));
    })
    .catch((error) => {
      showNotifBox("Error", "Error setting the frequency");
    });
}

function setFreq(fetchURL) {
  const centerFreq = document.getElementById("input-freq").value;
  const gains = document.getElementById("input-gain").value;

  if (!centerFreq || !gains) {
    showNotifBox("Error", "Frequency atau Gain tidak boleh kosong");
    return;
  }

  const centerFreqValue = parseFloat(centerFreq);

  const antSpace = centerFreqValue >= 250 ? 0.25 : 0.45;

  setAntena(fetchURL, antSpace);

  const data = {
    center_freq: centerFreqValue,
    uniform_gain: parseFloat(gains),
    ant_spacing_meters: antSpace,
  };
  setFreqReq(fetchURL, data);
}

function setStationId(fetchURL) {
  const station = document.getElementById("input-station-id").value;

  if (!station) {
    showNotifBox("Error", "Nama tidak boleh kosong");
    return;
  }

  const stationId = {
    id: station,
  };

  fetch(fetchURL + "/api/settings/station_id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stationId),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success, " + JSON.stringify(result));
    })
    .catch((error) => {
      showNotifBox("Error", "set station_id error");
    });
}

function setLatLng(fetchURL) {
  const dmsLat = document.getElementById("input-lat").value;
  const dmsLng = document.getElementById("input-lng").value;

  if (!dmsLat || !dmsLng) {
    showNotifBox("Error", "Input tidak boleh kosong");
    return;
  }

  const latlng = {
    lat: dmsToDecimal(dmsLat),
    lng: dmsToDecimal(dmsLng),
  };

  fetch(fetchURL + "/api/settings/latlng", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(latlng),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success, " + JSON.stringify(result));
    })
    .catch((error) => {
      showNotifBox("Error", "Error set latlng");
    });
}

function turnOffDF(fetchURL) {
  fetch(fetchURL + "/api/shutdown", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success, " + JSON.stringify(result));
    })
    .catch((error) => {
      console.log("Error power off", error);
    });

  showNotifBox(
    "System",
    "System akan mati dalam 1 menit.<br> Jangan langsung matikan sumber power!"
  );
  window.NodeFn.closeApp();
}

function restartDF(fetchURL) {
  fetch(fetchURL + "/api/restart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success, " + JSON.stringify(result));
    })
    .catch((error) => {
      console.log("Error power off", error);
    });
  showNotifBox("System", "System akan restart dalam ± 2 menit");
  window.NodeFn.closeApp();
}

function convertLatLngToUtm() {
  const latitude = document.getElementById("input-lat").value;
  const longitude = document.getElementById("input-lng").value;
  const zoneField = document.getElementById("input-zone");
  const eastingField = document.getElementById("input-easting");
  const northingField = document.getElementById("input-northing");
  const coField = document.getElementById("input-co");

  if (!latitude || !longitude) {
    showNotifBox("Error", "Input latitude / Longitude tidak boleh kosong");
    return;
  }

  if (!isDmsRegexMatch(latitude)) {
    showNotifBox(
      "Error",
      `Masukan Format Koordinat dengan benar\nContoh:\nLatitude: 6°10'31.36"S\nLongitude: 106°49'37.26"E`
    );
    document.getElementById("input-lat").value = `0°0'0.0"S`;
    return;
  }

  if (!isDmsRegexMatch(longitude)) {
    showNotifBox(
      "Error",
      `Masukan Format Koordinat dengan benar\nContoh:\nLatitude: 6°10'31.36"S\nLongitude: 106°49'37.26"E`
    );
    document.getElementById("input-lng").value = `0°0'0.0"E`;
    return;
  }

  const lat = dmsToDecimal(latitude);
  const lng = dmsToDecimal(longitude);

  const utmCoord = window.NodeFn.convertUtm(lat, lng);

  zoneField.value = utmCoord.zoneNum + utmCoord.zoneLetter;
  eastingField.value = utmCoord.easting.toFixed(2);
  northingField.value = utmCoord.northing.toFixed(2);

  const strCOE = Math.round(utmCoord.easting).toString();
  const strCON = Math.round(utmCoord.northing).toString();

  coField.value = `${strCOE.substring(
    1,
    strCOE.length - 1
  )}, ${strCON.substring(2, strCON.length - 1)}`;
}

//Save Coordinate
function saveCoord() {
  const latDms = document.getElementById("input-lat").value;
  const lngDms = document.getElementById("input-lng").value;
  const zone = document.getElementById("input-zone").value;
  const easting = document.getElementById("input-easting").value || 0;
  const northing = document.getElementById("input-northing").value || 0;
  const co = document.getElementById("input-co").value;
  const compassOffset = document.getElementById("input-compass-offset").value;

  if (!isDmsRegexMatch(latDms)) {
    showNotifBox(
      "Error",
      `Masukan Format Koordinat dengan benar\nContoh:\nLatitude: 6°10'31.36"S\nLongitude: 106°49'37.26"E`
    );
    document.getElementById("input-lat").value = `0°0'0.0"S`;
    return;
  }

  if (!isDmsRegexMatch(lngDms)) {
    showNotifBox(
      "Error",
      `Masukan Format Koordinat dengan benar\nContoh:\nLatitude: 6°10'31.36"S\nLongitude: 106°49'37.26"E`
    );
    document.getElementById("input-lng").value = `0°0'0.0"E`;
    return;
  }

  const saveData = {
    latDms,
    lngDms,
    zone,
    easting,
    northing,
    co,
    compassOffset,
  };
  const dataString = JSON.stringify(saveData);

  window.NodeFn.writeFile("test.json", dataString, "utf8")
    .then(() => {
      console.log("write success");
    })
    .catch((err) => {
      console.error("write error", err);
    });
}

function readSavedCoord() {
  window.NodeFn.readFile("test.json", "utf8")
    .then((data) => {
      const jsonConf = JSON.parse(data);
      document.getElementById("input-lat").value = jsonConf.latDms || "";
      document.getElementById("input-lng").value = jsonConf.lngDms || "";
      document.getElementById("input-zone").value = jsonConf.zone || "";
      document.getElementById("input-easting").value = jsonConf.easting || "";
      document.getElementById("input-northing").value = jsonConf.northing || "";
      document.getElementById("input-co").value = jsonConf.co || "";
      document.getElementById("input-compass-offset").value =
        jsonConf.compassOffset || "";
      setCompassOffset();
    })
    .catch((err) => {
      console.error("Error reading file: ", err);
    });
}

function setCompassOffset() {
  const inputValue = document.getElementById("input-compass-offset").value;

  const numberValue = parseFloat(inputValue);

  if (!isNaN(numberValue) && numberValue >= -180 && numberValue <= 180) {
    changeCompassOffset(numberValue.toFixed(2));
  } else {
    showNotifBox("Error", "Nilai offset hanya boleh angka -180 sampai 180");
    document.getElementById("input-compass-offset").value = 0;
    changeCompassOffset(0);
  }
}

async function getInitSettings(fetchURL) {
  try {
    const response = await fetch(fetchURL + "/api/settings");
    const settingJson = await response.json();

    const centerFreq = settingJson.center_freq || "";
    prevCenterFreq = parseFloat(centerFreq);

    const antSpace = settingJson.ant_spacing_meters;
    setAntena(fetchURL, antSpace);

    document.getElementById("input-freq").value = centerFreq;
    document.getElementById("input-gain").value =
      settingJson.uniform_gain.toString() || "";
    document.getElementById("input-station-id").value =
      settingJson.station_id || "";

    readSavedCoord();
  } catch (error) {
    console.log("Error: " + error);
  }
}
