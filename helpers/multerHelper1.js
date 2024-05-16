const multer=require('multer')

let Storage=multer.diskStorage({
    destination:function(req,file,cb){
         
        console.log("MULTER DATA");

        console.log(req.body);

        console.log("MULTER DATA ENDS");

        cb(null,'public/images/attendees/checkout')
    },
    filename:function(req,file,cb){
        
        let ext=file.originalname.substring(file.originalname.lastIndexOf('.'))
        
     
        cb(null,file.fieldname+'-'+Date.now()+'.png')
    }
})
module.exports=store=multer({storage:Storage})