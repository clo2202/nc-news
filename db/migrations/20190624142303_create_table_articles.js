
exports.up = function(knex, Promise) {
  //console.log('creating articles table')
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title')
    articlesTable.string('body', 5000);
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.string('topic').references('topics.slug');
    articlesTable.string('author').references('users.username').notNullable()
    articlesTable.timestamp('created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  //console.log('dropping articles table')
  return knex.schema.dropTable('articles')
};
