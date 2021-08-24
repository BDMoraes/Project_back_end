module.exports = {
    client: 'postgresql',
    connection: {
      database: 'taskOrganizer',
      user:     'postgres',
      password: 'pass'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};
