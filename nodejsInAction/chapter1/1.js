const fs = require('fs');
fs.readFile('./resource1.json', (error, data) => {
    console.log(error);
    console.log(data);
})