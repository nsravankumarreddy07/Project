Install nodejs18

npm install

npm start : Start the server 7070 in local

Postman: use post http://localhost:7070/shorten pass the header content-type: application json
Body-raw-json:{"url":"https://example.com"}

use get method to check the url found or not http://localhost:7070/shortUrl