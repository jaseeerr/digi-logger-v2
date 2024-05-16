module.exports={
    adminAuthentication:(req,res,next)=>{

        if (req.session.superuser) {
            
            next();  
        }
        else{
           
            res.redirect('/admin/superuser/login')
        }
    }
}