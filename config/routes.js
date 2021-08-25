module.exports = app => {
    app.route('/users')
        .post(app.api.user.save)

    app.route('/users/:id')
        .put(app.api.user.save)
}