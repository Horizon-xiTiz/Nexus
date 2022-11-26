var express = require('express')
var bodyParser = require('body-parser')
var app = express()

//we want socket.io server(backend) to tie in with express for that 
var http = require('http').Server(app) // this http library will share with express and socket.io
var io = require('socket.io')(http) // giving referrence of 'http' to the socket.io server

//importing mongoose to connect mongodb
var mongoose = require('mongoose')
mongoose.Promise = global.Promise;

//creating port
var port = process.env.PORT || 5000


const { connect } = require('http2')
var dbUrl = 'mongodb+srv://admin:xiTiz2001@nodejsmongodb.rzlbite.mongodb.net/?retryWrites=true&w=majority'
app.use(express.static(__dirname))  // (__dirname + '/index.html')
app.use(express.json())
app.use(bodyParser.json()) //this will make the bp know that we r expecting json on http request
app.use(bodyParser.urlencoded({extended:true})) //since url is encoded we need this to support the encoding

//to save data to mongodb, create model
// var Message = mongoose.model('Message', {
//     name : String,
//     message : String
// })
const userSchema = new mongoose.Schema({
    name: String,
    message: String
}) //what is structure of data 
const Message = mongoose.model("Message", userSchema)

//placeholder messages list, two objects
// var messages =[
//     {name: "Kshitij", message: "I am Kshitij"},
//     {name: "xiTiz", message:"This is xiTiz"}
// ]

//add route for end point which is messages, app.get for adding route
app.get('/messages', function(req,res){
    //here we will get the messges form database mongodb
    Message.find({}, function(err, messages){ // not passing any arg since everything will be passed in
        res.send(messages)
    })

    //callback to handle request
    // res.send(messages) // move to message.find
})

//point a node
app.post('/messages', function(req,res){
    //create object of Mssg
     var msg = new Message(req.body);
    // msg.name = "Test"
    // msg.message = "Testing to save data to mongodb"

    // msg.save((err,data)=>{
    //     if(err){
    //         console.error(err)
    //     }
    //     else{
    //         res.status(200).send("success")
    //     }
    // })
    msg.save()
        .then(item => {
    //         // if(err) throw err
            
    //             //from below code 
    //             // messages.push(req.body) // no need to push as we push it to mongodb
    //             // io.emit('messageee', req.body)
    //             // console.log("msg saved in db")
    //             // res.sendStatus(200) 
            
    //         console.log(item)
            messages.push(req.body)
            io.emit('messageee', req.body)
            res.send("item saved to db")
        })
        .catch(err => {
            res.status(400).send("unable to save to database")
    //         console.error(err)
        })

    // //console.log(req.body) // body of the req will be printed
    // messages.push(req.body) // this is pushing the message to /messages of current client

    // //emit messages to all client
    // io.emit('messageee', req.body) // this will emit event for other clients

    // res.sendStatus(200) //status request 200 informs the client that data req is OK

    //
    //trying from gfg : https://www.geeksforgeeks.org/how-to-connect-node-js-to-a-mongodb-database/
    // const msg = new Message({
    //     name: req.body.name,
    //     message: req.body.message,
    // });
    // msg.save(function(err) {
    //     if(err){
    //         throw err;
    //     }
    //     else{
    //         messages.push(req.body)
    //         io.emit('messageee', req.body)
    //         console.log('msg saved to db')
    //         res.sendStatus(200)
    //     }
    // })

    
})

io.on('connection', function(socket){
    console.log('User Connected')
    
})

//connect mongoose
mongoose.connect(dbUrl,function(err){
    console.log('connection to MondgoDB is successful')
})

// async function connect(){
//     try{
//         await mongoose.connect(dbUrl)
//         console.log('2 connected to mongodb')
//     }catch(error){
//         console.log(error)
//     }
// }

var server = http.listen(port, function(){   
    //changed from app.listen, app.listen will not work since backend wont serve only express, we use http server such that both socket.io and express will be running
    console.log('I am listing on port %d', port)
})
