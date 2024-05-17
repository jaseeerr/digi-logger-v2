const User = require('../model/userSchema')
const Attendance = require('../model/attendanceSchema')
const bcrypt = require('bcrypt')
const fs = require('fs');
const path = require('path');



module.exports = {

    postsignup:(userdata)=>{
        let batch1 = userdata.batch
        batch1 = batch1.toUpperCase()

        let Name = userdata.name.toUpperCase()

        return new Promise((resolve, reject) => {

            User.findOne({phone:userdata.phone}).then((pcheck)=>{
                if(pcheck)
                {
                    resolve({exphone:true})
                }
                else
                {
                    bcrypt.hash(userdata.password,10).then((pass)=>{

                        const user = new User({
        
                        
                            name:Name,
                            batch:batch1,
                            phone:userdata.phone,
                            domain:userdata.domain,
                            password:pass,
                            checkin:false
                            
            
                        })
            
                        user.save().then((userdata1)=>{

                            const attend = new Attendance({

                                sid:userdata1._id,
                                checkin:undefined,
                                checkout:undefined
 
                            })

                            attend.save().then(()=>{resolve({exphone:false})})
                        })
                    })
                }
            })
            

        })
    },

    postlogin:(userdata)=>{

        return new Promise((resolve, reject) => {

            User.findOne({phone:userdata.phone}).then((pdata)=>{
                if(pdata!=null)
                {
                    bcrypt.compare(userdata.password,pdata.password).then((pass)=>{
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

    },

    checkin:(data1,img)=>{
        return new Promise((resolve, reject) => {

            User.findById(data1.sid).then((user)=>{

                
            let image = user.checkinImg
            image.push(img)

                User.findByIdAndUpdate(data1.sid,{
                    $set:{
                        checkinImg:image
                    }
                }).then(()=>{
    
    
                    Attendance.findOne({sid:data1.sid}).then((data2)=>{
    
                    
                   console.log(data2);
    
                        if(!data2)
                        {
                            let arr = []
                             arr[0] = data1.date
                            
        
                             const attend = new Attendance({
                
                                
                                sid:data1.sid,
                                checkin:arr,
                                limit:1,
                                
                                
                                
                                
                
                            })
                
                            attend.save().then((data)=>{resolve(data)})
                        }
                        else
                        {
                            let lastin = data2.checkin[data2.checkin.length-1]
                            let current = data1.date

                          
                           
         
        
                           

                            if(lastin!==undefined)
                            {
                                if(lastin.getDate()==current.getDate() && lastin.getMonth()==current.getMonth() && lastin.getFullYear() == current.getFullYear())
                                {
                                    userdata = false
                                    resolve(userdata)
                                }
                            }
                            else
                            {

                              
                            let arr = data2.checkin
                            let limit = data2.limit +1
        
                            let attend1 = data2.attendance
                            
                            
                            
                            arr.push(data1.date)
        
                            console.log("ARRRRRRRRRR");
                            console.log(data2._id);
                            console.log(arr);
                         
        
                            Attendance.findByIdAndUpdate(data2._id,{
                                $set:{
                                    checkin:arr
                                    
                                   
                                }
                            }).then(()=>{
                                console.log("HERERERE");
        
                                User.findByIdAndUpdate(data1.sid,{
                                    $set:{
                                        checkin:true
                                    }
                                }).then(()=>{
        
                                   User.findById(data1.sid).then((userdata1)=>{
        
                                   
                                    resolve(userdata1)
                                   })
        
                                 
                                })
        
                              
                                
                                
                            })
                            }
        
                            
                        }
         
                        
        
                        
        
                    })
    
    
    
    
                })
    

            })


            

            
            

        })
    },


    checkout:(data1,img)=>{
        return new Promise((resolve, reject) => {

            function isBefore5_30pm(date) {
                // Set the target time as 5:30 PM
                const targetTime = new Date();
                targetTime.setHours(12, 00, 0, 0)
                targetTime.setDate(date.getDate())

                console.log("CHECKOUTIMEE");
                console.log(targetTime);
                console.log(date);
                
                // Compare the given time with the target time
                if(date.getTime() < targetTime.getTime())
                {
                    return false

                }
                else
                {
                    return true
                }
              }
            

            Attendance.findOne({sid:data1.sid}).then((data2)=>{

               
                let lastin = data2.checkin[data2.checkin.length-1]
                let checkin = data2.checkin
                let out = data1.date
                let absent = false

                console.log("LASTT INNNNNNNNNNNN");
                console.log(lastin)
                console.log(out);

                if(lastin.getDate()!=out.getDate())
                {
                    absent = true
                    checkin.pop()
                }
                else
                {
                    if(!isBefore5_30pm(out))
                    {
                        

                        absent = true
                        checkin.pop()
                    }
                }

                if(absent===true)
                {
                    console.log("ABSENT");
                    Attendance.findByIdAndUpdate(data2._id,{
                        $set:{
                            checkin:checkin
                        }
                    }).then(()=>{
                        User.findById(data1.sid).then((data3)=>{

                            let img1 = data3.checkinImg
                            let del = img1[img1.length-1]



                            const filePath = path.join(__dirname, '..', 'public', 'images', 'attendees','checkin', del);
                            const filePath1 = path.join(__dirname, '..', 'public', 'images', 'attendees','checkout', img);

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
                            
                            User.findByIdAndUpdate(data1.sid,{
                                $set:{
                                    checkin:false,
                                    checkinImg:img1
                                }
                            }).then(()=>{
                                User.findById(data1.sid).then((userdata1)=>{
    
                                    resolve(userdata1)
    
                                })
                            })

                        })

                        
                        
                    })
                }
                else
                {
                    console.log("faailed");
                    let id = data2._id

                let arr = data2.checkout
                arr.push(data1.date)

                Attendance.findByIdAndUpdate(id,{
                    $set:{
                        checkout:arr,
                        
                    }
                   }).then(()=>{

                    User.findByIdAndUpdate(data1.sid,{
                        $set:{
                            checkin:false,
                            checkoutImg:img
                        }
                    }).then(()=>{
                        User.findById(data1.sid).then((userdata)=>{

                            resolve(userdata)

                        })
                        
                    })
                   
                   })
                }


                
                

            })
            
           
        })
    },

    removeattendance:(id)=>{

        Attendance.findOne({sid:id}).then((data)=>{

            let checkin = data.checkin
            checkin.pop()

            console.log("ABSENT");
            Attendance.findByIdAndUpdate(data._id,{
                $set:{
                    checkin:checkin
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

      
           
       

    },

    linkdevice:(id,dev)=>{
        return new Promise((resolve, reject) => {
            
            User.findById(id).then((data)=>{


                if(data.dev1==undefined)
                {
                    User.findByIdAndUpdate(id,{
                        $set:{
                            dev1:dev
                        }
                    }).then(()=>{
                        User.findById(id).then((user)=>{
                            resolve(user)
                        })
                        
                    })
                }
                else if(data.dev2==undefined)
                {
                    User.findByIdAndUpdate(id,{
                        $set:{
                            dev2:dev
                        }
                    }).then(()=>{
                        User.findById(id).then((user)=>{
                            resolve(user)
                        })
                    })
                }
                else
                {
                    let linked = true
                    resolve({linked})
                }

                

            })
            
        })
    },

    

    graphdata:(id)=>{
        return new Promise((resolve, reject) => {
            let monthly = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            let overall = [0,0,0,0,0,0,0,0,0,0,0,0]
            let arr3 = []
            let absent = 0
            let percentage =0

            Attendance.findOne({sid:id}).then((data)=>{

                if(data!=null)
                {
                    let arr = data.checkin
                let arr1 = data.checkin
            
                for(let i=0;i<arr.length;i++)
                {
                    let temp = new Date()
                    let time = new Date();
                    time.setHours(3, 40, 0);
                    let time1 = arr[i]

                    console.log("incoming date: ",time1)
                    let month = time1.getMonth()
                    let month1 = temp.getMonth()

                    if(month==month1)
                    {
                        
                        if(time1<=time)
                        {
                            let temp = arr[i].toISOString().substring(0, 10) 
                        
                        temp = temp[8] + temp[9] 
                        
                        let day = Number(temp)
    
                        monthly[day] = 1
                        }
                    }
                    
                    if(time1<time)
                    {
                        arr1[i] = arr[i].toISOString().substring(0, 10);
                        arr3.push(arr1[i])
                    }
                    
                

                }

                const arr2 = [...new Set(arr1)];
              
                 //oevrall data

                

                 const arr4 = [...new Set(arr3)];

                 let jan = []
                 let feb = []
                 let mar = []
                 let apr = []
                 let may = []
                 let jun = []
                 let jul = []
                 let aug = []
                 let sep = []
                 let oct = []
                 let nov = []
                 let dec = []

                 arr4.forEach(element => {

                    let time = new Date();
                    time.setHours(3,40,0);

                    let current = new Date(element)

                    if(current.getTime()<time.getTime())
                    {
                       
                    let temp = new Date(element)
                    temp = temp.getMonth()
                    if(temp===0)
                    {
                        jan.push(element)
                    }
                    else if(temp===1)
                    {
                        feb.push(element)
                    }
                    else if(temp===2)
                    {
                        mar.push(element)
                    }
                    else if(temp===3)
                    {
                        apr.push(element)
                    }
                    else if(temp===4)
                    {
                        may.push(element)
                    }
                    else if(temp===5)
                    {
                        jun.push(element)
                    }
                    else if(temp===6)
                    {
                        jul.push(element)
                    }
                    else if(temp===7)
                    {
                        aug.push(element)
                    }
                    else if(temp===8)
                    {
                        sep.push(element)
                    }
                    else if(temp===9)
                    {
                        oct.push(element)
                    }
                    else if(temp===10)
                    {
                        nov.push(element)
                    }
                    else if(temp===11)
                    {
                        dec.push(element)
                    }
                    }
                    

                    
                 });

                 overall[0] = jan.length
                 overall[1] = feb.length
                 overall[2] = mar.length
                 overall[3] = apr.length
                 overall[4] = may.length
                 overall[5] = jun.length
                 overall[6] = jul.length
                 overall[7] = aug.length
                 overall[8] = sep.length
                 overall[9] = oct.length
                 overall[10] = nov.length
                 overall[11] = dec.length

               

                 

                console.log(arr4);
               


               
                      

              let present = 0
              monthly.forEach(element => {

                present = present+element
                
              });

              absent = 0
              let now = new Date()
              let day = now+""
              day = day[8] + day[9]
              let day1 = Number(day) 
              absent = day1 - present
           
              percentage = (present/day1)*100

              console.log(overall);
              console.log(monthly);

              Attendance.findByIdAndUpdate(data._id,{
                $set:{
                    attendance:percentage
                }
              }).then(()=>{
                console.log(monthly)
                console.log("monthlyy");
                resolve({monthly,overall,absent,percentage})


              })


                }
                else
                {
                    resolve({monthly,overall,absent,percentage})
                }

            })
        })
    },

    getUser:(id)=>{
        return new Promise((resolve, reject) => {

            User.findById(id).then((data)=>{
                resolve(data)
            })
            
        })
    }

    
}