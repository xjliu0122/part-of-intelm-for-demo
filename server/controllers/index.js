// import all controllers
const path = `${global.appRoot}/controllers`;
const fs = require('fs');

fs
    .readdirSync(path)
    .filter(file => fs.statSync(`${path}/${file}`)
        .isDirectory()) // only directly left
    .forEach(folder => {
        exports[folder] = require(`./${folder}`);
    });
