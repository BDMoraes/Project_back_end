const AG = require('./organizer');

module.exports = app => {
    const { existsOrError } = app.api.validator

    const start = async (req, res) => {
        const requisicao = { ...req.body }

        try {
        
            const id = requisicao.dailyId;

            const dailyFromDB = await app.db('daily')
                .where({ id: id }).first()

            existsOrError(dailyFromDB, 'Diário não cadastrado!')

            const tasksFromDB = await app.db('tasks')
                .where({ dailyId: id, status: "aguardando" })
    
            let array_taks = [];

            for (let index = 0; index < tasksFromDB.lenght; index++) {
                array_taks.push(tasksFromDB[index]);  
            }

            const sequencia = AG.rodar(array_taks);
            //continue point

        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    return { start }
}