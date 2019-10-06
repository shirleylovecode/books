const http = require('http');
const fs = require('fs');

// const server = http.createServer((req, res) => {
//     fs.readFile('./titlese.json', (error, data) => {
//         if(error) {
//             console.error(error)
//             res.end('Server Error');
//         } else {
//             const titles = JSON.parse(data.toString());
//             fs.readFile('./template.html', (error, data) => {
//                 if(error) {
//                     console.error(error);
//                     res.end('Server Error');
//                 } else {
//                     const tmpl = data.toString();
//                     const html = tmpl.replace('%', titles.join('</li><li>'));
//                     res.writeHead(200, { 'Content-Type': 'text/html' });
//                     res.end(html);
//                 }
//             })
//         }
//     })

// });

const server = http.createServer((req, res) => {
    getTitles(res);
});

// function getTitles(res) {
//     fs.readFile('./titles.json', (error, data) => {
//         if(error) {
//             handleError(res, error);
//         } else {
//             getTemplate(JSON.parse(data.toString()), res);
//         }
//     })
// }

function getTitles(res) {
    fs.readFile('./titles.json', (error, data) => {
        if(error) {
            return handleError(res, error);
        } 
        getTemplate(JSON.parse(data.toString()), res);
        
    })
}

// function getTemplate(titles, res) {
//     fs.readFile('./template.html', (error, data) => {
//         if(error) {
//             handleError(res, error);
//         } else {
//             generateHTML(titles, data.toString(), res);
//         }
//     })
// }

function getTemplate(titles, res) {
    fs.readFile('./template.html', (error, data) => {
        if(error) {
           return handleError(res, error);
        } 
        generateHTML(titles, data.toString(), res);       
    })
}

function generateHTML(titles, template, res) {
    const html = template.replace('%', titles.join('</li><li>'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
}

function handleError(res, error) {
    console.error(error);
    res.end('Server Error');
}

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})