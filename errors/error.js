
exports.error405Handler = (req, res, next) => {
  res.status(405).send({msg: 'Method not allowed'})
}

exports.error404Handler = (err, req, res, next) => {
  if(err.status === 404) res.status(err.status).send({msg: err.msg}) 
}