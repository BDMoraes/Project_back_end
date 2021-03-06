const app = require('express')();
const consign = require('consign');
const db = require('./config/db');

app.db = db;

const PORT = process.env.PORT || 4000;

consign()
    .include('config/passport.js')
    .then('config/middlewares.js')
    .then('api/validator.js')
    .then('api')
    .then('config/routes.js')
    .into(app)

app.listen(PORT, () => {
    console.log("Executando...");
})

