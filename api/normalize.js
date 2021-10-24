const AG = require('./organizer');

module.exports = app => {
    const { existsOrError } = app.api.validator

    class tarefa {
        constructor(sequenciamento, identificador, prioridade, local, tempo) {
            this.id = identificador;
            this.prioridade = prioridade;
            this.local = local;
            this.tempo = parseFloat(tempo);
            this.simbolo = sequenciamento;
            this.grau = parseFloat(this.prioridade + this.local + this.tempo);
        }
    }

    const start = async (req, res) => {
        const requisicao = req.params.id

        try {
            const id = requisicao;

            const dailyFromDB = await app.db('daily')
                .where({ id: id }).first()

            existsOrError(dailyFromDB, 'Diário não cadastrado!')

            const tasksFromDB = await app.db('tasks')
                .where({ dailyId: id, status: "andamento" })

            existsOrError(tasksFromDB, 'Diário não possui tarefas')

            let array_taks = [];

            const tasksDB = Array.from(tasksFromDB);

            for (let index = 0; index < tasksDB.length; index++) {
                array_taks.push(new tarefa(
                    0,
                    tasksDB[index].id,
                    tasksDB[index].prioridade,
                    tasksDB[index].localizacao,
                    tasksDB[index].entrega)
                );
            }

            const sequencia = Array.from(AG.rodar(array_taks));

            for (let index = 0; index < tasksDB.length; index++) {
                app.db('tasks')
                    .where({ id: sequencia[0].tarefas[index].id })
                    .update({ sequenciamento: sequencia[0].tarefas[index].simbolo })
                    .then()
            }

            res.status(204).send();

        } catch (msg) {
            return res.status(400).send(msg)
        }
    }
    return { start }
}