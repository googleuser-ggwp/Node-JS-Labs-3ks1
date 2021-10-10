const http = require('http');
const fs   = require('fs');
const url  = require('url');
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');

const CLIENT_ID = '518136941350-gapp274035muo0eah50d3of1fd23d9ne.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04fL_z0-EXbkuCgYIARAAGAQSNwF-L9IrhjhEl1mB4SpFwRHwJ4bxFqtIDo1a4iZVxBjUWfR-5YoTk8nA2uQQUd4dkrjjL2I9bGo';


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

async function sendMail()
{
    try {
        const accesToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'kantorkazimir@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accesToken
            }
        });

        const mailOptions = {
            from: 'Kasimir Kantor <kantorkazimir@gmail.com>',
            to:   'kantor.kazimir@outlook.com',
            subject: "Hello from gmail using API",
            text: 'Hello from Gmail using API',
            html: '<h1>Hello from Gmail using API</h1>'
        };

        const result = await transport.sendMail(mailOptions);

        return result;

    } catch (error) {
        return error;
    }
}



http.createServer((request, response) => 
{

    let body="";
    request.on('data', str=>{body+=str; console.log('data', body);});

    switch(url.parse(request.url).pathname)
    {
        case '/' :
            let html = fs.readFileSync('./06-02.html');
            response.writeHead(200, {'Content-Type':'text/html; charset = utf-8'});
            response.end(html);
            break;

        case '/send':
            // req.on('data', data=>{
            //     let info = JSON.parse(data);
            //     });
            sendMail().then(result => response.end('Email sent...'))
            .catch(error => console.log(error.message));
            break;

        default:
            response.writeHead(404, {'Content-Type': 'text/html'});
            response.end('<h1>Not found</h1>');  
            break;
    
    }
}).listen(5000);

console.log("Server running at http://localhost:5000/");