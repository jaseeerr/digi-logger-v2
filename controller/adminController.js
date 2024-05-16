const { set } = require('mongoose')
const adminHelper = require('../helpers/adminHelper')
const userHelper = require('../helpers/userhelper')

module.exports = {
    

    home:(req,res)=>{

        let userdata = req.session.admindata
      

         adminHelper.getAbsentees().then((data)=>{
             req.session.freqabsentees = data

            adminHelper.getTodayabsent().then((todays)=>{

                req.session.todaysabsentees = todays

                req.session.todays = todays
                let temp = []
                todays.forEach(element => {
                    temp.push(element.batch)
                });

                const temp1 = new Set(temp);
                let batches = Array.from(temp1);

                console.log(batches);

                res.render('admin/index',{userdata,data,todays,batches})
            })

           


        })
        
    },

    frequentabsenteespdf:(req,res)=>{

        let data = req.session.freqabsentees

        res.render('admin/frequentabsenteespdf',{data})
    },

    todaysabsenteespdf:(req,res)=>{

        let data = req.session.todaysabsentees

        res.render('admin/frequentabsenteespdf',{data})
    },

    login:(req,res)=>{


        if(req.session.admin)
        {
res.redirect('/admin')
        }
        else
        {
            let loginerr = req.session.adminloginerr
            let blockerr = req.session.adminblock
   
            req.session.adminloginerr = false
            req.session.adminblock = false
   
           res.render('admin/login',{loginerr,blockerr})
        }
     
    },

    customreport:(req,res)=>{

        let date = req.session.customof
        console.log(date);
        let temp = []
        let data = []
        let batches = []

        if(req.session.customdate)
        {
            data = req.session.customdate
            data.forEach(element => {
                temp.push(element.batch)
            });

            const temp1 = new Set(temp);

            batches = Array.from(temp1);
             



        }


        res.render('admin/customreport',{batches,date})

    },



    

    getcustom:(req,res)=>{

        req.session.customof = req.body.date

         adminHelper.getTodayabsentBydate(req.body.date).then((data)=>{

            console.log(data);

           req.session.customdate = data

           res.redirect('/admin/customreport')

        })

    },

    custombatch:(req,res)=>{

        let date = req.session.customof

        let id = req.params.id

        let temp = req.session.customdate
        let data = []

        temp.forEach(element => {

            if(element.batch==id)
            {
                data.push(element)
            }
            
        });

        req.session.absenteestable = data
        req.session.of2 = date

        res.render('admin/absenttable',{data,date,id})

    },

    absenteestable:(req,res)=>{

        let date = req.session.of2
        let data = req.session.absenteestable

        res.render('admin/absenteespdf',{data,date})

    },

    postlogin:(req,res)=>{


        adminHelper.postlogin(req.body).then((response)=>{


            console.log(response);
            if(response.block)
            {
                req.session.adminblock = true
                res.redirect("/admin/login")
            }
            else if(response.loginerr)
            {
                req.session.adminloginerr = true
                res.redirect("/admin/login")
            }
            
            else
            {
                req.session.admindata =  response.pdata
                req.session.admin = true
                res.redirect("/admin")
            }

            

        })

    },

    signup:(req,res)=>{

       if(req.session.admin)
       {
        res.redirect('/admin')
       }
       else
       {
        let exphone = req.session.exphone
        req.session.exphone = false

        res.render('admin/signup',{exphone})
       }
    },

    postsignup:(req,res)=>{


        adminHelper.postsignup(req.body).then((response)=>{

            if(response.exphone)
            {
                req.session.exphone = true
                res.redirect('/signup')
            }
            else
            {
                req.session.pass = true
                res.redirect('/admin/login')
            }

        })


    },

    students:(req,res)=>{

        adminHelper.getStudents().then((data)=>{

            let userdata = req.session.admindata

            res.render('admin/students',{data,userdata})
        })

    },

    

    

    absentbatch:(req,res)=>{

        let todays = req.session.todays
        let batch = req.params.id

        let data = []

        todays.forEach(element => {

            if(element.batch==batch)
            {
                data.push(element)
            }
            
        });

        res.render('admin/absenttable',{data})


    },

    details:(req,res)=>{

        let userdata = req.session.admindata
        let id = req.params.id
        console.log(id);
       
        let badstd = req.session.badstd
        req.session.badstd = false



      
       


          userHelper.graphdata(id).then((graphdata)=>{

            userHelper.getUser(id).then((user)=>{

                

                    let daily = graphdata.monthly
                    let overall = graphdata.overall
                    overall.splice(12)
        
                    let percentage =  graphdata.percentage 
                    percentage = Math.round(percentage)
        
                    let absent = graphdata.absent
                    req.session.stdPhone = user.phone
                    req.session.stdname = user.name
                    res.render('admin/details', {userdata, percentage, absent,daily,overall,user,badstd});

               
 

               

            })

          

          })

           
          


       
     


    },


    attendees:(req,res)=>{

         let date =   req.session.of1 
         let batches =  req.session.attendeesbatch 

         console.log(batches);


            res.render('admin/attendees',{batches,date})

      

        
    },

    getcustomattendees:(req,res)=>{

        let date = req.body.date

        console.log(date);

        adminHelper.getAttendees(date).then((std)=>{

            

            console.log(std);
            let temp = []
          

            std.forEach(element => {

                temp.push(element.batch)
                
            });

            const temp1 = new Set(temp);

           let  batches = Array.from(temp1);

           req.session.attendees = std
           req.session.of1 = date
           req.session.attendeesbatch = batches

            res.redirect('/admin/attendees')

        })

    },

    attendeesgrid:(req,res)=>{

        let id = req.params.id
        

       let date=  req.session.of1
      let temp =  req.session.attendees
      let attendees = []

      temp.forEach(element => {

        if(element.batch==id)
        {
            let index = -1 
            let index1 = -1
           
          for(let i=0;i<element.checkinImg.length;i++)
          {

                let temp = element.checkinImg[i].split("")
                let slicedArr = temp.slice(6, temp.length);
                let removedArr = slicedArr.slice(0, -4);
                
                removedArr = removedArr.join("")
                removedArr = Number(removedArr)
                let utcDate = new Date(removedArr) // this is a UTC date

                 
                const timezoneOffset = 330; // Timezone offset for GMT+5:30 is 330 minutes
                const localDate = new Date(utcDate.getTime() + (timezoneOffset * 60 * 1000));

                let date1 = new Date(date)
                console.log("checkin");
                console.log(localDate);
                console.log(date1);
                
                if(date1.getDate()===localDate.getDate() && date1.getMonth()===localDate.getMonth() && date1.getFullYear()===localDate.getFullYear())
                {
                    console.log("GOTCHA");
                  index = i
                }
                else
                {
                    console.log("sorry");
                }
                


            }

            for(let i=0;i<element.checkoutImg.length;i++)
          {

                let temp = element.checkoutImg[i].split("")
                let slicedArr = temp.slice(6, temp.length);
                let removedArr = slicedArr.slice(0, -4);
                
                removedArr = removedArr.join("")
                removedArr = Number(removedArr)
                let utcDate = new Date(removedArr) // this is a UTC date

                 
                const timezoneOffset = 330; // Timezone offset for GMT+5:30 is 330 minutes
                const localDate = new Date(utcDate.getTime() + (timezoneOffset * 60 * 1000));

                let date1 = new Date(date)
                console.log("checkin");
                console.log(localDate);
                console.log(date1);
                
                if(date1.getDate()===localDate.getDate() && date1.getMonth()===localDate.getMonth() && date1.getFullYear()===localDate.getFullYear())
                {
                    console.log("GOTCHA");
                  index1 = i
                }
                else
                {
                    console.log("sorry");
                }
                


            }
                
                
                
               element.index = index
               element.index1 = index1
            console.log(element);
            attendees.push(element)
          
        }
        
      });

      req.session.attendeestable = attendees


      


        res.render('admin/attendeesgrid',{date,attendees})

    },

    attendeestable:(req,res)=>{

        let data = req.session.attendeestable
        let date = req.session.of1

        res.render('admin/attendeespdf',{data,date})

    },

   

    removeattendance:(req,res)=>{

        const previousUrl = req.header('Referer');

        adminHelper.removeattendance(req.params.id).then((userdata)=>{
  
          req.session.attendanceremoved = true
         

          res.redirect(previousUrl)

        })
      },


      markcheckin:(req,res)=>{

        let id = req.params.id
        let admin = req.session.admindata.name
        let stdphone =  req.session.stdPhone
        let adminphone = req.session.admindata.phone
        let stdname =  req.session.stdname
        let reason  = req.body.reason

        const previousUrl = req.header('Referer');

        adminHelper.markchekcin(id,admin,stdphone,adminphone,stdname,reason).then((badstd)=>{

            if(badstd)
            {
                req.session.badstd = true
            }

            res.redirect(previousUrl)


        })

        


        

      },

      markcheckout:(req,res)=>{

        let id = req.params.id
        let admin = req.session.admindata.name
        let stdphone =  req.session.stdPhone
        let adminphone = req.session.admindata.phone
        let stdname =  req.session.stdname
        let reason  = req.body.reason

        const previousUrl = req.header('Referer');

        adminHelper.markcheckout(id,admin,stdphone,adminphone,stdname,reason).then((badstd)=>{

            if(badstd)
            {
                req.session.badstd = true
            }

            res.redirect(previousUrl)


        })

        


        

      },


      regularizations:(req,res)=>{

            let data = req.session.reglogs
            let date = req.session.of3

            res.render('admin/regularizations',{data,date})
      
      },

      getregularizations:(req,res)=>{

        let id = req.params.id
        req.session.of3 = id

        adminHelper.getregularizationlogs(id).then((data)=>{

            req.session.reglogs = data
         
            res.redirect('/admin/regularizations')
        })
      },




    

    logout:(req,res)=>{

        req.session.admin = false
        req.session.admindata = null
       
        res.redirect('/admin/login')
    }
}