
exports.up = function(knex) {
    return knex.schema.createTable('tasks', table => {
        table.increments('id').primary();
        table.string('titulo').notNull();
        table.string('descricao').notNull();
        table.integer('localizacao').notNull();
        table.integer('prioridade').notNull();
        table.integer('entrega').notNull();
        table.integer('dailyId').references('id').inTable('daily');
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTable('tasks')
};