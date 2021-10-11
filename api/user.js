const bcrypt = require('bcrypt');

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError, minPassword } = app.api.validator

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body }
        if (req.params.id) user.id = req.params.id

        console.log(user)

        try {
            existsOrError(user.nome, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.senha, 'Senha não informada')
            existsOrError(user.confirmSenha, 'Confirmação de Senha inválida')
            equalsOrError(user.senha, user.confirmSenha, 'Senhas não conferem')
            minPassword(user.senha, 'Senha precisa ter no mínimo 6 caracteres')


            if (!user.id) {
                const userFromDB = await app.db('users')
                    .where({ email: user.email }).first()
                notExistsOrError(userFromDB, 'Usuário já cadastrado!')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        user.senha = encryptPassword(user.senha)
        delete user.confirmSenha

        if (user.id) {
            app.db('users')
                .update()
                .where({ id: user.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert([user])
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }


    const getById = (req, res) => {
        app.db('users')
            .select('id', 'nome', 'email')
            .where({ id: req.params.id })
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const daily = await app.db('daily')
                .where({ userId: req.params.id })

            notExistsOrError(daily, 'Usuário possui diários.')

            const rowsUpdated = await app.db('users')
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return { save, getById, remove }
}