exports.up = function (knex) {
    return knex.schema.createTable('tasks', table => {
        table.increments('id').primary();
        table.string('titulo').notNull();
        table.string('descricao').notNull();
        table.integer('localizacao').notNull();
        table.integer('prioridade').notNull();
        table.decimal('entrega').notNull();
        table.string('status').notNull();
        table.integer('noPrazo');
        table.integer('sequenciamento');
        table.decimal('finalizacao');
        table.integer('dailyId').references('id').inTable('daily').notNull();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('tasks')
};