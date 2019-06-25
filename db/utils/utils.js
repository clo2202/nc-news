exports.formatDate = list => {
    return list.reduce((arr, item) => {
      arr.push({...item, created_at: new Date(item['created_at'])})
      return arr
    }, [])
};

exports.makeRefObj = list => {
  return list.reduce((refObj, item) => {
    refObj[item.title] = item.article_id
    return refObj
  }, {})
};

exports.formatComments = (comments, articleRef) => {
  return comments.reduce((arr, comment) => {
    let formattedComments = {
      ...comment,
      author: comment["created_by"],
      article_id: comment.belongs_to,
      created_at: new Date(comment['created_at']),
    }
    formattedComments.article_id = articleRef[formattedComments['article_id']]
    delete formattedComments.belongs_to
    delete formattedComments.created_by
    arr.push(formattedComments)
    return arr
  }, [])


  // return comments.map(comment => {
  //    let formattedComments = {}
  //    for(key in comment) {
  //      if (key === 'created_by') formattedComments.author = comment[key]
  //      else if (key === 'belongs_to') formattedComments.article_id = comment[key]
  //      else if (key === 'created_at') formattedComments[key] = new Date(comment['created_at'])
  //      else formattedComments[key] = comment[key]
  //    }
  //    console.log(formattedComments)
  //  })
  
  // takes an array of comments and a ref obj
  // returns a new array of formatted comments
  // does not mutate the input array
};
