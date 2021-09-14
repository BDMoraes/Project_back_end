const AG = require('./organizer');

module.exports = app => {
    const { existsOrError } = app.api.validator

    class tarefa {
        constructor(sequenciamento, identificador, prioridade, local, tempo) {
            this.id = identificador;
            this.prioridade = prioridade;
            this.local = local;
            this.tempo = tempo;
            this.simbolo = sequenciamento;
            this.grau = this.prioridade + this.local + this.tempo;
        }
    }

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
                array_taks.push(new tarefa(
                    tasksFromDB[index].sequenciamento,
                    tasksFromDB[index].id,
                    tasksFromDB[index].prioridade,
                    tasksFromDB[index].local,
                    tasksFromDB[index].entrega)
                );
            }

            const sequencia = AG.rodar(array_taks);

            for (let index = 0; index < sequencia.tarefas.length; index++) {
                app.db('tasks')
                    .where({ id: sequencia.tarefas[index].id })
                    .update({ sequenciamento: index })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    return { start }
}