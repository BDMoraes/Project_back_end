const bodyParser = require('body-parser');
const cors = require('cors');

const corsOptions ={
    origin:'https://task-organizer.surge.sh', 
    credentials:true,
    optionSuccessStatus:200
}

module.exports = app =>{
    app.use(cors(corsOptions));
    app.use(bodyParser.json())
}