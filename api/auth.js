const { authSecret } = require('../.env');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.senha) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if (!user) return res.status(400).send('Usuário não encontrado!')

        const isMatch = bcrypt.compareSync(req.body.senha, user.senha)
        if (!isMatch) return res.status(401).send('Email/Senha inválidos!')

        const now = Math.floor((Date.now() / 1000))

        const payload = {
            id: user.id,
            nome: user.name,
            email: user.email,
            iat: now,
            exp: now + (60 * 60 * 24)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if (userData) {
                const token = jwt.decode(userData.token, authSecret)
                if (new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (e) {
            // problema com o token
        }

        res.send(false)
    }

    return {signin, validateToken}
}