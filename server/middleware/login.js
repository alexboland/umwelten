function checkLogin(req, res, next){
  if (req.session.user){
    next();
  }
  else{
    req.session.redirect_to = req.path;
    console.log("redirect to: " + req.path);
    res.redirect('/session/login');
  }
}


module.exports = { checkLogin: checkLogin };