const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

// to use public directory as static accross server.
app.use(express.static(__dirname + '/public'));

const https = require('https');

app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/index.html');
})


app.post('/',(req,res)=>{

    var jsonData = {
        members:[
        {
            email_address:req.body.email,
            status:"subscribed",
            merge_fields:{
                FNAME:req.body.fname,
                LNAME:req.body.lname
            }
        }
    ]}
    jsonData = JSON.stringify(jsonData)

    // to authorize right user while posting data using https module
    const options={
        auth:'ashish:8a0146c24ecfdbaf3db1a8bde7e231d6-us18',
        method:'POST'
    }
    const url="https://us18.api.mailchimp.com/3.0/lists/4a03cb61b8";

    // to post data first need to store it in variable and for writing need to call .write method on this const.
    const request= https.request(url,options, (resp)=>{
        if(resp.statusCode===200){
            res.sendFile(__dirname+'/success.html')
        }else{
            res.sendFile(__dirname+'/failure.html')
        }

    })
    request.write(jsonData);
    request.end();

})

//when user click on try again button(on failure page) it send user to home page again.
app.post('/failure',(req,res)=>{
    res.redirect('/')
})




app.listen(3000 || process.env.PORT, ()=>{
    console.log('Running at port 3000!')
})

// API Key for mailchimp= 8a0146c24ecfdbaf3db1a8bde7e231d6-us18
// Unique id = 4a03cb61b8