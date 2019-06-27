
exports.error405Handler = (req, res, next) => {
  res.status(405).send({msg: 'Method not allowed'})
}

exports.error404Handler = (err, req, res, next) => {
  if(err.status === 404) {
    res.status(err.status).send({msg: err.msg || "Page cannot be found"}) 
  } else if (err.code === '23503') {
    res.status(404).send({msg: "The page does not exist"})
  } else {
    next(err)
  }
}

exports.error400Handler = (err, req, res, next) => {
  const codes = ['22P02', '42703'];
  if (codes.includes(err.code)) {
    res.status(400).send({msg: 'Bad Request'})
  }
}