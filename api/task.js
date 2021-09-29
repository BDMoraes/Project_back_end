module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validator

    const save = async (req, res) => {
        const task = { ...req.body }
        if (req.params.id) task.id = req.params.id

        try {
            existsOrError(task.titulo, 'Título não informado')
            existsOrError(task.descricao, 'Descrição não informada')
            existsOrError(task.localizacao, 'Localização não informada')
            existsOrError(task.prioridade, 'Prioridade não informada')
            existsOrError(task.entrega, 'Horário não informado')
            existsOrError(task.status, 'Parâmetro não informado')
            existsOrError(task.noPrazo, 'Parâmetro não informado')
            existsOrError(task.dailyId, 'Parâmetro não informado')

            const id = task.dailyId;

            const dailyFromDB = await app.db('daily')
                .where({ id: id }).first()

            existsOrError(dailyFromDB, 'Diário não cadastrado!')


        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (task.id) {
            app.db('tasks')
                .update(task)
                .where({ id: task.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('tasks')
                .insert(task)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const getById = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id })
            .first()
            .then(task => res.json(task))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código não informado')

            const taskStatus = await app.db('tasks')
                .where({ id: req.params.id, status: "andamento" })

            notExistsOrError(taskStatus, 'Tarefa em andamento')

            const rowsDeleted = await app.db('tasks')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'tarefa não foi encontrada')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const waitingTasks = (req, res) => {
        const task = { ...req.body }

        app.db('tasks')
            .where({ dailyId: task.dailyId, status: 'aguardando' })
            .then(tasks => res.json(tasks))
            .catch(err => res.status(500).send(err))
    }

    const runningTasks = (req, res) => {
        const task = { ...req.body }

        app.db('tasks')
            .where({ dailyId: task.dailyId, status: 'andamento' })
            .then(tasks => res.json(tasks))
            .catch(err => res.status(500).send(err))
    }

    return { save, getById, remove, waitingTasks, runningTasks }
}