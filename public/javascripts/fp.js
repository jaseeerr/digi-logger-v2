
      // Initialize the agent on page load.
      const fpPromise = import('https://fpjscdn.net/v3/cHJPS3egMxwxjE3kR0BO')
      .then(FingerprintJS => FingerprintJS.load({
        region: "ap"
      }))
     // Define a function to send the Ajax request
  function sendStringToBackend(myString) {
let err = true
    setTimeout(()=>{
      if(err)
      {
        window.alert("It seems like your browser or a plugin in your browser is blocking the website.Disable any anti-tracker or protection plugin/extension")
      }
    },6000)
    // Wait for fpPromise to resolve and obtain the visitorId
    fpPromise.then(fp => fp.get()).then(result => {
      err = false
      const visitorId = result.visitorId;
      console.log("Visitor ID:", visitorId);


      // Send the Ajax request with the visitorId and myString as data
      $.ajax({
        method: 'POST',
        url: '/linkdevice',
        data: { message: myString, visitorId: visitorId },
        success: function(response) {
          console.log('Backend response:', response);
          location.reload()
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Ajax request failed:', textStatus, errorThrown);
        }
      });
    });
  }

  //get fp
  function getfingerprint(myString) {
    // Wait for fpPromise to resolve and obtain the visitorId
    fpPromise.then(fp => fp.get()).then(result => {
      const visitorId = result.visitorId;
      console.log("Visitor ID:", visitorId);

      // Send the Ajax request with the visitorId and myString as data
      $.ajax({
        method: 'POST',
        url: '/getfingerprint',
        data: { message: myString, visitorId: visitorId },
        success: function(response) {
          console.log('Backend response:', response);
          location.reload()
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Ajax request failed:', textStatus, errorThrown);
        }
      });
    });
  }


  // Call the sendStringToBackend function with the string from the script tag
  const myString = 'Hello from the front end!';

  

  document.getElementById('link').onclick = function()
  {
    sendStringToBackend(myString);
    console.log("gotchhhaa")
    
  }

  let thisfp = document.getElementById('thisfp').value 
  console.log("FINGERPRITT");
  console.log(thisfp);

  if(thisfp==0)
  {
    console.log("GETTING FP")
    getfingerprint(myString)
  }
  else
  {
    console.log("GOT FP")
  }