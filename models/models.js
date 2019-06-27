const { connection } = require("../connection");

exports.fetchTopics = () => {
  return connection("topics").select("*");
};

exports.fetchUsers = ({username}) => {
  return connection('users')
  .select('*')
  .modify((query) => {
    if (username) query.where({username})
  })
}

exports.fetchArticles = ({article_id}, {sort_by, order, author, topic}) => {
  return connection('articles')
  .select('articles.*')
  .count({comment_count: 'comments.comment_id'})
  .leftJoin('comments', 'comments.article_id','=', 'articles.article_id')
  .groupBy('articles.article_id')
  .orderBy(sort_by || 'articles.created_at', order || 'desc')
  .modify((query) => {
    if (article_id) query.where({"articles.article_id": article_id})
    if (author) query.where({"articles.author": author})
    if (topic) query.where({"articles.topic": topic})
  })
}

exports.amendArticleById = ({inc_votes}, {article_id}) => {
  return connection('articles')
  .select('*')
  .where({article_id})
  .returning("*")
  .then(article => {
    if (article.length !== 0) {
      const updatedVotes = inc_votes + article[0].votes
      return connection('articles')
      .select('*')
      .where({article_id})
      .update({votes: updatedVotes})
      .returning("*")
    } else {
      return Promise.reject({status: 404, msg: "Article does not exist"})
    }
  })
}

exports.addCommentByArticleId = (comment, {article_id}) => {
  const updateComment = ({ username, ...object}) => ({author: username, article_id, ...object})
  const updatedComment = updateComment(comment)
  return connection('comments')
  .insert(updatedComment)
  .returning('*')
  .catch((err) => {
    return Promise.reject(err)
  })
} 

exports.fetchComments = ({article_id}, {sort_by, order}) => {
  return connection('comments')
  .select('*')
  .orderBy( sort_by || 'created_at', order || 'desc')
  .modify((query) => {
    if (article_id) query.where({article_id})
  })
}

exports.amendCommentsById = ({inc_votes}, {comment_id}) => {
  return connection('comments')
  .select('*')
  .where({comment_id})
  .returning('*')
  .then(comment => {
    const updatedVotes = inc_votes + comment[0].votes
    return connection('comments')
    .select('*')
    .where({comment_id})
    .update({votes: updatedVotes})
    .returning('*')
  })
}