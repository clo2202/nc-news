exports.formatDate = list => {
  return list.reduce((arr, item) => {
    arr.push({ ...item, created_at: new Date(item["created_at"]) });
    return arr;
  }, []);
};

exports.makeRefObj = list => {
  return list.reduce((refObj, item) => {
    refObj[item.title] = item.article_id;
    return refObj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  return comments.reduce((arr, comment) => {
    let formattedComments = {
      ...comment,
      author: comment["created_by"],
      article_id: comment.belongs_to,
      created_at: new Date(comment["created_at"])
    };
    formattedComments.article_id = articleRef[formattedComments["article_id"]];
    delete formattedComments.belongs_to;
    delete formattedComments.created_by;
    arr.push(formattedComments);
    return arr;
  }, []);
};

exports.updateComment = ({ username, ...object }, article_id) => ({
  author: username,
  article_id,
  ...object
});
