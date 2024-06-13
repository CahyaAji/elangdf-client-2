const packager = require("electron-packager");

const options = {
  dir: "./",
  out: "./releases",
  platform: "linux",
  arch: "x64",
  overwrite: true,
  name: "CNS-01-DF",
  icon: "./src/assets/icon.png",
};

packager(options)
  .then((appPaths) => {
    console.log("App packaged successfully: ", appPaths);
  })
  .catch((err) => {
    console.error("Error packaging app: ", err);
  });
