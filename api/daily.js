module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validator

    const save = (req, res) => {
        const daily = {
            id: req.body.id,
            titulo: req.body.titulo,
            status: req.body.status,
            userId: req.body.userId
        }

        if (req.params.id) daily.id = req.params.id

        try {
            existsOrError(daily.titulo, 'Nome não informado')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (daily.id) {
            app.db('daily')
                .update(daily)
                .where({ id: daily.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('daily')
                .insert(daily)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código não informado')

            const tasks = await app.db('tasks')
                .where({ dailyId: req.params.id })
            notExistsOrError(tasks, 'Diário possui tarefas')

            const rowsDeleted = await app.db('daily')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Diário não foi encontrado')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const getById = (req, res) => {
        app.db('daily')
            .where({ id: req.params.id })
            .first()
            .then(daily => res.json(daily))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, getById }
}