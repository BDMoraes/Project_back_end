const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = app => {
    app.use(cors({ origin: "*", credentials: true }));
    app.use(bodyParser.json())
}