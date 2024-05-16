const User = require('../model/userSchema')
const Admin = require('../model/adminSchema')
const Attendance = require('../model/attendanceSchema')
const bcrypt = require('bcrypt')
const SU = require('../model/superuserSchema')
const Regularize = require('../model/reqularizeSchema')


module.exports = {

    postsignup:(userdata)=>{
        return new Promise((resolve, reject) => {

            Admin.findOne({phone:userdata.phone}).then((pcheck)=>{
                if(pcheck)
                {
                    resolve({exphone:true})
                }
                else
                {
                    bcrypt.hash(userdata.password,10).then((pass)=>{

                        const admin = new Admin({
        
                        
                            name:userdata.name,
                            location:userdata.location,
                            phone:userdata.phone,
                            password:pass,
                            block:true
                            
            
                        })
            
                        admin.save().then(()=>{resolve({pass:true,exphone:false})})
                    })
                }
            })
            
            
        })
    },

    postlogin:(data)=>{
        return new Promise((resolve, reject) => {
            
            Admin.findOne({phone:data.phone}).then((pdata)=>{
                if(pdata!=null)
                {
                    bcrypt.compare(data.password,pdata.password).then((pass)=>{
                        if(pass)
                        {
                          
                                            
                          
  
                          if(pdata.block)
                          {
                              resolve({loginerr:true,block:true})
                          }
                          else
                          {
                              resolve({loginerr:false,pdata})
                          }
                        }
                        else
                        {
                          resolve({loginerr:true})
                        }
                      })
                }
                else
                {
                    resolve({loginerr:true})
                }
            })
        })
    }

    //superuser function below

    ,
    supostlogin:(data)=>{
        return new Promise((resolve, reject) => {

            SU.findOne({phone:data.phone}).then((pdata)=>{
                if(pdata!=null)
                {
                    if(pdata.password==data.password)
                    {
                        resolve({loginerr:false,pdata})
                    }
                    else
                    {
                        resolve({loginerr:true})
                    }
                }
                else
                {
                    resolve({loginerr:true})
                }
            })
            
        })
    },

    getStudents:()=>{
        return new Promise((resolve, reject) => {
            User.find({}).then((data)=>{
                resolve(data)
            })
        })
    },

    getAdmins:()=>{
        return new Promise((resolve, reject) => {
            Admin.find({}).then((data)=>{
                resolve(data)
            })
        })
    },

    unblockadmin:(id)=>{

        return new Promise((resolve, reject) => {
            
            Admin.findByIdAndUpdate(id,{
                $set:{
                    block:false
                }
            }).then(()=>{
                resolve()
            })
        })
    },

    blockadmin:(id)=>{
        return new Promise((resolve, reject) => {
            Admin.findByIdAndUpdate(id,{
                $set:{
                    block:true
                }
            }).then(()=>{
                resolve()
            })
        })
    },

    getAbsentees:()=>{

        return new Promise((resolve, reject) => {
            let list = []
            let std = []
            Attendance.find({}).then((data)=>{

                

                data.forEach(element => {
                    if(element.attendance<50)
                    {
                        list.push(element.sid)
                    }

                    if(list.length==0)
                    {
                        resolve(list)
                    }
                    
                });

                list.forEach(element => {

                    User.findById(element).then((data)=>{
                   
                        std.push(data)
                    }).then(()=>{
                  
                        if(list.length==std.length)
                        {
                            resolve(std)
                        }
                    })
                    
                })
                    
               
                    
             

                

              
            })
        })
    },

    getTodayabsent:()=>{
        return new Promise((resolve, reject) => {

            function isBeforeToday9AM(date) {
                const now = new Date();
                if (date.getDate() !== now.getDate()) {
                   
                    // check if the day is not the same as today's day
                  return false
                }
                
                const today9AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 40, 0, 0); // set time to today 9:10 AM
                if(date.getTime() < today9AM.getTime())
                {
                    return true
                }
                else 
                {
                    return false
                }
              }
            

          let list = []
          let std = []
            Attendance.find({}).then((data)=>{

                

                data.forEach(element => {

                    let last = element.checkin[element.checkin.length-1]

                    if(last==undefined)
                    {
                        list.push(element.sid)
                    }
                    else
                    {
                        let time  = last.getTime()
                   
                        if(!isBeforeToday9AM(last))
                        {
                        
                         list.push(element.sid)
                        }
                    }
                 
                   

                   
                   


           
                    
                     
                })
                if(list.length==0)
                {
                   
                    resolve(std)
                }


                
            }).then(()=>{

                list.forEach(element => {

                    User.findById(element).then((data)=>{

                         std.push(data)

                    }).then(()=>{

                        if(list.length==std.length)
                        {
                           
                            resolve(std)
                        }
                    })
                    
                });
                
            })

            
          

        })
    },

    getTodayabsentBydate:(date11)=>{

        return new Promise((resolve, reject) => {

            function isBeforeNineThirtyAMToday(date) {
                // Get the current date
                date = new Date(date)
                const currentDate = new Date(date11);

               

              
                // Set the current date time to 9:30 AM
                const currentDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 3, 40,0);

                console.log("selected date:  "+currentDateTime);
                console.log("incoming:  "+date);
              
                // Check if the input date is before the current date time, on the same day and same month
                return date.getTime() < currentDateTime.getTime() && 
                       date.getDate() === currentDate.getDate() &&
                       date.getMonth() === currentDate.getMonth();
              }
            

          let list = []
          let std = []
            Attendance.find({}).then((data)=>{

                

                data.forEach(element => {

                    // let last = element.checkin[element.checkin.length-1]

                    if(element.checkin.length==0)
                    {
                       console.log("CAUGHT");
                       list.push(element.sid)
                    }
                    

                    // if(last==undefined)
                    // {
                    //     list.push(element.sid)
                    // }
                    // else
                    // {
                    //     let time  = last.getTime()
                   
                    //     if(!isBeforeToday9AM(last,date1))
                    //     {
                        
                    //      list.push(element.sid)
                    //     }
                    // }   



                    element.checkin.forEach(element1 => {

                        console.log("CAUGHT1");
                        console.log(element1);

                        let lastin = new Date(element1)
                        let current = new Date(date11)
                         if(!element1)
                         {
                            console.log("CAUGHT");
                            list.push(element.sid)
                         }
                       

                        if(lastin.getFullYear()===current.getFullYear() && lastin.getMonth()===current.getMonth() && lastin.getDate()===lastin.getDate() )
                        {
                            console.log("DATE:: ",lastin);
                            console.log(current);
                            console.log(lastin);
                            if(!isBeforeNineThirtyAMToday(lastin))
                            {
                                list.push(element.sid)
                            }
                        }
                        else
                        {
                            list.push(element.sid)
                        }

                        
                    });
                     
                })


                
                if(list.length==0)
                {
                   
                    resolve(std)
                }
                
            }).then(()=>{

                list.forEach(element => {

                    User.findById(element).then((data)=>{

                         std.push(data)

                    }).then(()=>{

                        if(list.length==std.length)
                        {
                           
                            resolve(std)
                        }
                    })
                    
                });
                
            })

            
          

        })
    },

    details:(req,res)=>{

        let userdata = req.session.superuserdata
        let id = req.params.id
   
        



      


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

           
          


    
   


    },

    getAttendees:(date11)=>{
        return new Promise((resolve, reject) => {

            function isBeforeNineThirtyAMToday(date) {
                // Get the current date
                date = new Date(date)
                const currentDate = new Date(date11);

               

              
                // Set the current date time to 9:30 AM
                const currentDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 3, 40, 0);

                console.log("selected date:  "+currentDateTime);
                console.log("incoming:  "+date);
              
                // Check if the input date is before the current date time, on the same day and same month
                return date.getTime() < currentDateTime.getTime() && 
                       date.getDate() === currentDate.getDate() &&
                       date.getMonth() === currentDate.getMonth();
              }
              
             let list = []
             let std = []
             let img = []
            Attendance.find({}).then((data)=>{

                
                data.forEach(element => {
                    

                    element.checkin.forEach(element1 => {

                        let lastin = new Date(element1)
                        let current = new Date(date11)

                       

                        if(lastin.getFullYear()===current.getFullYear() && lastin.getMonth()===current.getMonth() && lastin.getDate()===lastin.getDate() )
                        {
                            console.log(current);
                            console.log(lastin);
                            if(isBeforeNineThirtyAMToday(lastin))
                            {
                                list.push(element.sid)
                            }
                        }

                        
                    });

                    
                  
                    
                });
                if(list.length==0)
                {
                    resolve(std)
                }

                list.forEach(element => {

                    User.findById(element).then((data1)=>{

                        std.push(data1)
                       


                    }).then(()=>{

                        
                        if(list.length==std.length)
                            {
                              
                            

                                resolve(std)
                            }


                        

                    })
                    
                });

               

                



            })
        })
    },


    removeattendance:(id)=>{

       return new Promise((resolve, reject) => {
        
        Attendance.findOne({sid:id}).then((data)=>{

            let checkin1 = data?.checkin
            let checkout1 = data?.checkout
         
            let lastin = checkin1[checkin1.length-1]
            let lastout = checkout1[checkout1.length-1]

            checkin1.pop()

            if(lastin.getDate() === lastout.getDate() && lastin.getMonth()===lastout.getMonth() && lastin.getFullYear()===lastout.getFullYear() )
            {
                checkout1.pop()
            }


            console.log("ABSENT");
            Attendance.findByIdAndUpdate(data._id,{
                $set:{
                    checkin:checkin1,
                    checkout:checkout1
                }
            }).then(()=>{
                User.findById(data.sid).then((data3)=>{

                    let img1 = data3.checkinImg
                    let del = img1[img1.length-1]
                    let img2 = data3.checkoutImg
                    let del1 = img2[img2.length-1]



                    const filePath = path.join(__dirname, '..', 'public', 'images', 'attendees','checkin', del);
                    const filePath1 = path.join(__dirname, '..', 'public', 'images', 'attendees','checkout', del1);

                    fs.unlink(filePath, (err) => {
                        if (err) {
                          console.error(err);
                          return;
                        }
                        
                        console.log('File deleted successfully'+del);
                      });

                      fs.unlink(filePath1, (err) => {
                        if (err) {
                          console.error(err);
                          return;
                        }
                        
                        console.log('File deleted successfully'+img);
                      });


                    img1.pop()
                   if(del1)
                   {
                    img2.pop()
                   }
                    
                    User.findByIdAndUpdate(data1.sid,{
                        $set:{
                            checkin:false,
                            checkinImg:img1,
                            checkoutImg:img2
                        }
                    }).then(()=>{
                        User.findById(data.sid).then((userdata1)=>{

                            resolve(userdata1)

                        })
                    })

                })

                
                
            })

        })

      
           
       

       })
    },


    markchekcin:(id,admin,stdphone,adminphone,stdname,reason)=>{

        let now = new Date()

        return new Promise((resolve, reject) => {
        
            const reg = new Regularize({
        
                        
                student:stdname,
                stdphone:stdphone,
                admin:admin,
                adminphone:adminphone,
                date:now,
                reason:reason,
                type:"Check-in"
                

            })

            reg.save().then(()=>{

                console.log("HERHEHREREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
                Attendance.findOne({sid:id}).then((data)=>{

                    

                    let now1 = new Date()
                    now1.setHours(3,25,0)

                    let current = data.checkin[data.checkin.length-1]
                    let current1 = new Date(current)

                    if(now1.getDate()===current1.getDate() && now1.getMonth()===current1.getMonth() && now1.getFullYear()===current1.getFullYear())
                    {
                        let checkin1 = data.checkin

                        if(checkin1.length===0)
                        {
                            checkin1[0] = now1
                        }
                        else
                        {
                            checkin1[checkin1.length-1] = now1
                      
                        }
    
                        Attendance.findByIdAndUpdate(data._id,{
                            $set:{
                                checkin:checkin1
                            }
                        }).then(()=>{
     
                            let badstd = false
                            resolve(badstd)
                        })
                    }
                    else
                    {
                        let badstd = true
                        resolve(badstd)
                    }


                   

                    


                })


               
            })

            

        })
    },

    markcheckout:(id,admin,stdphone,adminphone,stdname,reason)=>{

        let now = new Date()

        return new Promise((resolve, reject) => {
        
            const reg = new Regularize({
        
                        
                student:stdname,
                stdphone:stdphone,
                admin:admin,
                adminphone:adminphone,
                date:now,
                reason:reason,
                type:"Check-out"
                

            })

            reg.save().then(()=>{

                console.log("HERHEHREREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
                Attendance.findOne({sid:id}).then((data)=>{

                    

                    let now1 = new Date()
                    now1.setHours(12,20,0)
                    console.log("TIMEEEEEEEEECHHHHEEEEEEEEEECCCCKKKKKKKKKK");
                    console.log(now1);

                    let current = data.checkin[data.checkin.length-1]
                    let current1 = new Date(current)

                    if(now1.getDate()===current1.getDate() && now1.getMonth()===current1.getMonth() && now1.getFullYear()===current1.getFullYear())
                    {
                        let checkout1 = data.checkout

                        if(checkout1.length===0)
                        {
                            checkout1[0] = now1
                        }
                        else
                        {
                            checkout1[checkout1.length] = now1
                      
                        }
    
                        Attendance.findByIdAndUpdate(data._id,{
                            $set:{
                                checkout:checkout1
                            }
                        }).then(()=>{

                            User.findByIdAndUpdate(id,{
                                $set:{
                                    checkin:false
                                }
                            }).then(()=>{

                                
                            let badstd = false
                            resolve(badstd)

                            })
     
                        })
                    }
                    else
                    {
                        let badstd = true
                        resolve(badstd)
                    }


                   

                    


                })


               
            })

            

        })
    },

    getregularizationlogs:(date)=>{

        return new Promise((resolve, reject) => {
            
            Regularize.find({}).then((data)=>{

             

              
                resolve(data)

            })
        })
    }
}