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

    app.route('/dailys')
        .all(app.config.passport.authenticate())
        .post(app.api.daily.save)

    app.route('/dailys/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.daily.getById)
        .put(app.api.daily.save)
        .delete(app.api.daily.remove)

    app.route('/query-waiting-dailys/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.daily.waitingDailys)

    app.route('/query-running-dailys/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.daily.runningDailys)

    app.route('/query-complete-dailys/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.daily.completeDailys)

    app.route('/tasks')
        .all(app.config.passport.authenticate())
        .post(app.api.task.save)

    app.route('/tasks/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.task.getById)
        .put(app.api.task.save)
        .delete(app.api.task.remove)

    app.route('/query-waiting-tasks/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.task.waitingTasks)

    app.route('/query-running-tasks/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.task.runningTasks)

    app.route('/query-complete-tasks/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.task.completeTasks)

    app.route('/query-ordanized-tasks/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.task.organizedTasks)

    app.route('/updateTasks/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.task.updateTasks)

    app.route('/finalizeTasks/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.task.finalizeTasks)

    app.route('/normalizies/:id')
        .all(app.config.passport.authenticate())
        .post(app.api.normalize.start)


}