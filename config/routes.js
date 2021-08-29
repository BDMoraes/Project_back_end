module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .post(app.api.user.save)

    app.route('/users/:id')
        .put(app.api.user.save)
}