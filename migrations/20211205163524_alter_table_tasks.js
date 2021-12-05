
exports.up = function (knex) {
    return knex.schema.alterTable('tasks', table => {
        table.integer('sent');
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable('tasks', table => {
        table.dropColumn('sent')
    })
};

