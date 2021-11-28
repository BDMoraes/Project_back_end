exports.up = function (knex) {
    return knex.schema.alterTable('tasks', table => {
        table.decimal('inicializacao');
        table.decimal('diaInicializacao');
        table.decimal('diaFinalizacao');
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable('tasks', table => {
        table.dropColumn('inicializacao')
    })
};
