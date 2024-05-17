const userHelper = require('../helpers/userhelper')


module.exports = {

  

    homepage: (req, res) => {

      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      console.log("ipppppppppppppppppppppppp");
      console.log(ipAddress);
      

      let thisfp = req.session.thisfp
      let inout = req.session.inout
      req.session.inout = false



      

      let noip = req.session.noip
     
      let ip = req.session.ip

        let userdata1 = req.session.userdata
        let signedin = req.session.signedin
       



      console.log(userdata1);
      console.log("usd^^")
       
         userHelper.getUser(userdata1._id).then((userdata)=>{

          console.log(userdata)
      if(userdata.checkin)
      {
        req.session.signedin = true
      }
      else
      {
        req.session.signedin = false
      }

          userHelper.graphdata(userdata._id).then((graphdata)=>{

            let daily = graphdata.monthly
            let overall = graphdata.overall
            overall.splice(12)

            let percentage =  graphdata.percentage 
            percentage = Math.round(percentage)

            let absent = graphdata.absent
            res.render('user/index', {userdata, signedin,  percentage, absent,daily,overall,noip,ip,thisfp,inout});

          })


         })

         
           
          


       
     

    },


    upload:(req, res) => {


    
      console.log(req.body);
      console.log("GOTCHHHAA......................");
   




 
      req.session.img = req.file.filename
     
        
  
        res.redirect("/checkin")
   
   
     
    },

    upload1:(req, res) => {

      console.log(req.file)
      req.session.img = req.file.filename

    
      
  
      res.redirect("/checkout")
    },


    login: (req, res) => {

        if (req.session.user) {
            res.redirect('/')
        } else {
            let loginerr = req.session.loginerr
            let blockerr = req.session.block
            let signup = req.session.signup
            req.session.block = false
            req.session.loginerr = false
            req.session.signup = false
           


            res.render('user/login', {loginerr, blockerr, signup})
        }


    },

    postlogin: (req, res) => {

      if(req.session.user)
      {
        res.redirect('/')
      }
      else
      {
        userHelper.postlogin(req.body).then((response) => {

          req.session.block = response.block
          req.session.loginerr = response.loginerr

          if (!response.loginerr) {
              req.session.userdata = response.pdata
              req.session.user = true
              res.redirect('/')
          } else {
              req.session.user = false
              res.redirect('/login')
          }

      })
      }

        


    },

    signup: (req, res) => {

      if(req.session.user)
      {
     res.redirect('/')
      }
      else
      {
        let exphone = req.session.exphone
        req.session.exphone = false

        res.render('user/signup', {exphone})
      }
        
    },

    postsignup: (req, res) => {

        if(req.session.user)
        {
           res.redirect('/')
        }
        else
        {
          userHelper.postsignup(req.body).then((response) => {

            if (response.exphone) {
                req.session.exphone = true
                res.redirect('/signup')
            } else {
                req.session.signup = true
                res.redirect('/login')
            }


        })
        }

    },

    checkin: (req, res) => {


      if(req.session.signedin)
      {
           res.redirect('/')
      }


     




      let img = req.session.img
        
       
              
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      let title = ipAddress
      let title1
      title = title.split("")
      title1 = title.slice(0,11)
      title1 = title1.join("")
      req.session.ip = ipAddress

      // title1=="103.214.235" || title1=="115.246.245"
       console.log("incoming ip:::::::::::::: ",title1 );
       console.log("network ip:::::::::::::::::: 115.246.245 & 103.214.235");      
      if (title1=="103.214.235" || title1=="115.246.245"|| true) {

        req.session.noip = false
       
        // req.session.userdata.dev1==req.session.thisfp || req.session.userdata.dev2==req.session.thisfp
        if(req.session.userdata.dev1==req.session.thisfp || req.session.userdata.dev2==req.session.thisfp )
        {
          

          const date = new Date();


       
        let data = {
            date: date,
            sid: req.session.userdata._id
        }
       
   
      
       

        userHelper.checkin(data,img).then((userdata) => {

          if(userdata)
          {
            req.session.userdata = userdata
          }
          else
          {
            req.session.inout = true
          }
         
          // console.log(userdata);

            req.session.signedin = true
            res.redirect('/')

        })


        }
        else
        {
          res.redirect('/')
        }
        
        
            
        


         }
    else{
      req.session.noip = true
      res.redirect('/')
       
        }   
       
           
         
           

            

            // Output the timezone date and time
           
      
    },

    checkout: (req, res) => {



      if(!req.session.signedin)
      {
           res.redirect('/')
      }



        const date = new Date();

        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      let title = ipAddress
      let title1
      title = title.split("")
      title1 = title.slice(0,11)
      title1 = title1.join("")
      req.session.ip = ipAddress

        if (title1=="103.214.235" || title1=="115.246.245" || true)
        {
          req.session.noip = false
          if(req.session.userdata.dev1==req.session.thisfp || req.session.userdata.dev2==req.session.thisfp)
          {

            let data = {
              date: date,
              sid: req.session.userdata._id
          }
          let img = req.session.img
  
          userHelper.checkout(data,img).then((userdata) => {
  
  
            req.session.userdata = userdata
            console.log("From controller");
            console.log(userdata);
            console.log("From controller ends");
  
              req.session.signedin = false
              res.redirect('/')
  
          })

          }
          else
          {
                 res.redirect('/')
          }

        
          
        }
        else
        {
          req.session.noip = true
          res.redirect('/')
        }

       


    },

   


    linkdevice:(req,res)=>{

      
      let id = req.session.userdata._id
      let fp = req.body.visitorId
      userHelper.linkdevice(id,fp).then((user)=>{

        req.session.userdata = user


        res.redirect('/')
      })

    },

    getfingerprint:(req,res)=>{

      req.session.thisfp = req.body.visitorId
      

      res.redirect('/')

    },

    logout:(req,res)=>{

      req.session.user = false
      req.session.userdata = null
      res.redirect('/')
    }

}
