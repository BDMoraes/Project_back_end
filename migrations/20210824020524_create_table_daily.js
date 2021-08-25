
exports.up = function(knex) {
    return knex.schema.createTable('daily', table => {
        table.increments('id').primary();
        table.string('titulo').notNull();
        table.integer('userId').references('id').inTable('users').notNull();
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTable('daily')
};