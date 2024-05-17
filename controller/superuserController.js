const adminHelper = require('../helpers/adminHelper')
const userHelper = require('../helpers/userhelper')

module.exports = {

    home:(req,res)=>{
        let userdata = req.session.superuserdata

        adminHelper.getAbsentees().then((data)=>{

            adminHelper.getTodayabsent().then((todays)=>{

                res.render('superuser/index',{userdata,data,todays})
            })

           

           

        })
        
    },

    login:(req,res)=>{

        if(req.session.superuser)
        {
            res.redirect('/admin/superuser')
        }
        else
        {
            let loginerr = req.session.suloginerr
            req.session.suloginerr = false
            
    
            res.render('superuser/login')
        }

      
    },

    postlogin:(req,res)=>{
        
        adminHelper.supostlogin(req.body).then((response)=>{

            if(!response.loginerr)
            {
                req.session.superuser = true
                req.session.superuserdata = response.pdata
                res.redirect('/admin/superuser')
            }
            else
            {
                req.session.suloginerr = true
                res.redirect('/admin/superuser/login')
            }


        })
    },

    students:(req,res)=>{

        adminHelper.getStudents().then((data)=>{

            let userdata = req.session.superuserdata

            res.render('superuser/students',{data,userdata})
        })
    },


    admins:(req,res)=>{

        adminHelper.getAdmins().then((data)=>{

            let userdata = req.session.superuserdata

            res.render('superuser/admin-info',{userdata,data})

        })
    },

    unblockadmin:(req,res)=>{

        let id = req.params.id
        adminHelper.unblockadmin(id).then(()=>{

            res.redirect('/admin/superuser/admins')
        })
    },

    blockadmin:(req,res)=>{
        let id = req.params.id

        adminHelper.blockadmin(id).then(()=>{
            res.redirect('/admin/superuser/admins')
        })
    },

    details:(req,res)=>{

        let userdata = req.session.superuserdata
        let id = req.params.id
        console.log(id);
        userHelper.checkattendance(id).then((data1)=>{



      
        userHelper.checklate(id).then((late) => { 


          userHelper.graphdata(id).then((graphdata)=>{

            userHelper.getUser(id).then((user)=>{

                

                    let daily = graphdata.monthly
                    let overall = graphdata.overall
                    overall.splice(12)
        
                    let percentage =  data1.percentage 
                    percentage = Math.round(percentage)
        
                    let absent = data1.absent
                    res.render('superuser/details', {userdata, late, percentage, absent,daily,overall,user});

               
 

               

            })

          

          })

           
          


        })
      })


    }
}