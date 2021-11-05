const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = app =>{
    app.use(cors({origin: "https://task-organizer.surge.sh/", credentials: true }));
    app.use(bodyParser.json())
}