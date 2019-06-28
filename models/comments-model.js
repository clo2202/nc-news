const { connection } = require("../connection");

exports.fetchComments = ({article_id}, {sort_by, order}) => {
  return connection('articles')
  .select('*')
  .where({article_id})
  .then(articles => {
    if (articles.length !== 0) {
      return connection('comments')
      .select('*')
      .where({article_id})
      .orderBy( sort_by || 'created_at', order || 'desc')
    } else {
      return Promise.reject({status: 404, msg: "Article does not exist"})
    }
  })
}

exports.amendCommentById = ({inc_votes = 0}, {comment_id}) => {
  return connection('comments')
  .select('*')
  .where({comment_id})
  .increment({votes: inc_votes})
  .returning('*')
}

exports.removeCommentById = ({comment_id}) => {
  return connection('comments')
  .where({comment_id})
  .del()
  .then(delCount => {
    if(!delCount) return Promise.reject({status:404, msg: 'Comment does not exist'})
  })
}