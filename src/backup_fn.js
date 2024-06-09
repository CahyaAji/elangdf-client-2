const test = window.NodeFn.convertUtm(-7.76903333998064, 110.38305173112761);
console.log(test);

document
  .getElementById("writeFileButton")
  .addEventListener("click", function () {
    const data = "Hello, Electron!";
    window.electronFs
      .writeFile("example.txt", data, "utf8")
      .then(() => {
        console.log("File written successfully.");
      })
      .catch((err) => {
        console.error("Error writing file:", err);
      });
  });

document
  .getElementById("readFileButton")
  .addEventListener("click", function () {
    window.NodeFn.readFile("example.txt", "utf8")
      .then((data) => {
        document.getElementById("fileContent").innerText = data;
      })
      .catch((err) => {
        console.error("Error reading file:", err);
      });
  });

//
function printScreenSize() {
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;
  document.getElementById(
    "screen-size"
  ).innerText = `Screen Width: ${screenWidth} pixels, Screen Height: ${screenHeight} pixels`;
}

window.addEventListener("DOMContentLoaded", printScreenSize);

window.addEventListener("resize", printScreenSize);
