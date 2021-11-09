module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validator

    const save = async (req, res) => {
        const task = { ...req.body }
        task.id = req.params.id

        try {
            existsOrError(task.status, 'Status não informado')
            existsOrError(task.dailyId, 'Diário não informado')
            existsOrError(task.localizacao, 'Localização não informada')
            existsOrError(task.prioridade, 'Prioridade não informada')
            existsOrError(task.entrega, 'Horário não informado')
            existsOrError(task.titulo, 'Título não informado')
            existsOrError(task.descricao, 'Descrição não informada')

            let data = task.entrega
            let hour = data.substr(0, 2)
            let min = data.substring(3, 5)
            let minE = "0." + min
            let hourE = hour + ".0"
            let hourC = parseFloat(hourE)
            let minC = parseFloat(minE)
            let hora = hourC + minC
            task.entrega = parseFloat(hora)

            const id = task.dailyId;

            const dailyFromDB = await app.db('daily')
                .where({ id: id }).first()

            existsOrError(dailyFromDB, 'Diário não cadastrado!')

        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (task.id != undefined) {
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
        const tasksFromDaily = req.params.id
        app.db('tasks')
            .where({ dailyId: tasksFromDaily, status: 'aguardando' })
            .then(tasks => res.json(tasks))
            .catch(err => res.status(500).send(err))
    }

    const runningTasks = (req, res) => {
        const tasksFromDaily = req.params.id
        app.db('tasks')
            .where({ dailyId: tasksFromDaily, status: 'andamento' })
            .then(tasks => res.json(tasks))
            .catch(err => res.status(500).send(err))
    }

    const completeTasks = (req, res) => {
        const tasksFromDaily = req.params.id
        app.db('tasks')
            .where({ dailyId: tasksFromDaily, status: 'concluido' })
            .then(tasks => res.json(tasks))
            .catch(err => res.status(500).send(err))
    }

    const organizedTasks = (req, res) => {
        const tasksFromDaily = req.params.id
        app.db('tasks')
            .where({ dailyId: tasksFromDaily, status: 'andamento' })
            .orderBy('sequenciamento')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(500).send(err))
    }

    const updateTasks = (req, res) => {
        const Daily = req.params.id
        app.db('tasks')
            .where({ dailyId: Daily })
            .update({ status: 'andamento' })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    const finalizeTasks = async (req, res) => {
        const Daily = req.params.id
        const task = req.body


        try {
            await app.db('tasks')
                .where({ id: task.id })
                .update({ status: 'concluido', noPrazo: task.noPrazo, finalizacao: task.finalizacao })

            const finalizedTasks = await app.db('tasks').where({ dailyId: Daily, status: 'andamento' })

            if (finalizedTasks.length === 0) {
                await app.db('daily')
                    .where({ id: Daily })
                    .update({ status: 'finalizado' })
                    .then(daily => res.json(daily))
            } else {
                res.status(204).send()
            }

        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return {
        save, getById, remove, waitingTasks, runningTasks, completeTasks,
        organizedTasks, updateTasks, finalizeTasks
    }
}