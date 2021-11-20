
exports.up = function (knex) {
    return knex.schema.alterTable('tasks', table => {
        table.decimal('inicializacao');
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable('tasks', table => {
        table.dropColumn('inicializacao')
    })
};
