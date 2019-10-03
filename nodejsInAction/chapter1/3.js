const fs = require('fs');

const stream = fs.createReadStream('./resource1.json');

stream.on('data', (chunk) => {
    console.log(chunk);
});

stream.on('error', (error) => {
    console.log(error);
})

stream.on('end', () => {
    console.log('finish');
})