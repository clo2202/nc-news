
exports.up = function(knex, Promise) {
 // console.log('creating comments table')
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary()
    commentsTable.string('author').notNullable().references('users.username')
    commentsTable.integer('article_id').references('articles.article_id').onDelete('CASCADE')
    commentsTable.integer('votes').defaultTo(0)
    commentsTable.timestamp('created_at').defaultTo(knex.fn.now())
    commentsTable.string('body', 5000).notNullable()
  })
};

exports.down = function(knex, Promise) {
  //console.log('dropping comments table')
  return knex.schema.dropTable('comments')
};
