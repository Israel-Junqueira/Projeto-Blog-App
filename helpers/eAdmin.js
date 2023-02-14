module.exports = {
    eAdmin:function(req,res,next){ //usuario admin
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }

        req.flash("error_msg","Voce não é admin fi de rapariga")
        res.redirect("/")
    }
}

/*
    usuario comum
   eadmin:function(req,res,next){ 
        if(req.isAuthenticated() ){
            return next();
        }

        req.flash("error_msg","voce deve estar logado para entrar aqui")
        res.redirect("/")
    }
*/