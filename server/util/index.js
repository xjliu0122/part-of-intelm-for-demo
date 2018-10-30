require('fs')
    .readdirSync(`${global.appRoot}/util`)
    .forEach(file => {
        if (file.match(/\.js$/) !== null && file !== 'index.js') {
            const name = file.replace('.js', '');
            exports[name] = require(`./${file}`);
        }
    });
