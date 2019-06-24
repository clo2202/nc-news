exports.formatDate = list => {
    return list.reduce((arr, item) => {
      arr.push({...item, created_at: new Date(item['created_at'])})
      return arr
    }, [])
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
