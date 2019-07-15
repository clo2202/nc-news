const { connection } = require("../connection");
const { updateComment } = require('../db/utils/utils')

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
  
  exports.amendArticleById = ({inc_votes = 0}, {article_id}) => {
    return connection('articles')
    .select('*')
    .where({article_id})
    .increment({votes: inc_votes})
    .returning("*")
  }
  
  exports.addCommentByArticleId = (comment, {article_id}) => {
    // const updateComment = ({ username, ...object}) => ({author: username, article_id, ...object})
    const updatedComment = updateComment(comment, article_id)
    return connection('comments')
    .insert(updatedComment)
    .returning('*')
    .catch((err) => {
      return Promise.reject(err)
    })
  } 

  exports.addArticle = (article) => {
    return connection('articles')
    .insert(article)
    .returning('*')
  }

  exports.removeArticleById = ({article_id}) => {
    return connection('articles')
    .where({article_id})
    .del()
    .then(delCount => {
      if(!delCount) return Promise.reject({status:404, msg: 'Article does not exist'})
    })
  }