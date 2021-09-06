module.exports = app => {

    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(app.api.user.save)

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.user.getById)
        .put(app.api.user.save)
        .delete(app.api.user.remove)

    app.route('/daily')
        .all(app.config.passport.authenticate())
        .post(app.api.daily.save)

    app.route('/daily/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.daily.getById)
        .delete(app.api.daily.remove)

    app.route('/task')
        .all(app.config.passport.authenticate())
        .post(app.api.task.save)

    app.route('/task/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.task.getById)
        .delete(app.api.task.remove)

    app.route('/normalize')
        .all(app.config.passport.authenticate())
        .post(app.api.normalize.start)
}