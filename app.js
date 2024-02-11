const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { STATUS_CODES } = require("http");

const app = express();

// Serve static files from the 'public' directory
app.use(express.static("public"));
// Use body-parser to parse urlencoded data
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  const data = {            // using post  /lists/{list_id} from mailchimp
    members: [  
                            // member body parameter  -> and properties -> email_address, status etc
      {                 
        email_address: email,
        status: "subscribed", // Corrected "suscribed" to "subscribed"
        merge_fields: {
          FNAME: fName,                 // merge_fields  by default -> FNAME< LNAME
          LNAME: lName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  // Corrected API endpoint URL
  const url = "https://us22.api.mailchimp.com/3.0/lists/9a610c9e24";    // API     https://usX.api.mailchimp.com/3,0/lists/{lists_id}"

  const options = {
    method: "POST",
    // Corrected authentication format
    auth: "Ali1:8d374b0d399bbe16bd9d16f14e916937-us22", // //auth: "AnyString: API"  auth: -> authentication 
  };

    //https.request(url,options, funtion(para)

  const request = https.request(url, options, (response) => {


    if(response.statusCode === 200)
    {
        res.sendFile(__dirname + "/success.html");
    }
    else{
        res.sendFile(__dirname + "/failure.html");
    }
    
    response.on("data", (data) => {
        console.log(JSON.parse(data));
    })

   
  });

  //request.write(jsonData);
  request.end();
});

app.post("/failure", (req,res)=>{
    res.redirect("/")
})


// process.env.PORT     // a dynamic that heroku will find for the go
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is listening on port 3000.");
});


// In terminal:

/*
// login to heroku
heroku login
git init
git add.
git commit -m "msg"  ->"FIrt Commit"


*/