module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validator

    const save = async (req, res) => {
        const daily = { ...req.body }
        if (req.params.id) daily.id = req.params.id

        try {
            existsOrError(daily.titulo, 'Título não informado')
            existsOrError(daily.status, 'Parâmetro não informado')
            existsOrError(daily.userId, 'Parâmetro não informado')

            const id = daily.userId;

            const userFromDB = await app.db('users')
                .where({ id: id }).first()

            existsOrError(userFromDB, 'Usuário não cadastrado!')

            const dailyStatusFromDB = await app.db('daily')
                .where({ status: "andamento", userId: daily.userId }).first()

            notExistsOrError(dailyStatusFromDB, 'O usuário possui diários ativos')

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

    const getById = (req, res) => {
        app.db('daily')
            .where({ id: req.params.id })
            .first()
            .then(daily => res.json(daily))
            .catch(err => res.status(500).send(err))
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

    const waitingDailys = (req, res) => {
        app.db('daily')
            .select('id', 'nome', 'email')
            .where({ id: req.params.id })
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const runningDailys = (req, res) => {
        app.db('daily')
            .select('id', 'nome', 'email')
            .where({ id: req.params.id })
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    return { save, getById, remove, waitingDailys, runningDailys }
}