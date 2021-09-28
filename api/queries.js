module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError, minPassword } = app.api.validator


    const activeDailys = (req, res) => {
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

    return { activeDailys, runningDailys }
}