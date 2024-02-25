require("dotenv").config() 
const path = require("path")
const colors = require("colors")
const validator = require("validator")
const Express = require("express")
const app = Express()
const hbs = require("hbs")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const PORT = process.env.PORT || 5500
require("C:/Users/vedan/Desktop/html,css,javascript/NodeJS/formSubmission/connections.js")
const AllRegistration = require("C:/Users/vedan/Desktop/html,css,javascript/NodeJS/formSubmission/Models/all_registrations.js")
app.set("view engine", "hbs")
app.set("views", "C:/Users/vedan/Desktop/html,css,javascript/NodeJS/formSubmission/templates/views")
// Middleware to parse form data
// app.use(req.urlencoded({ extended: false }));
// app.use(Express.json());       // to support JSON-encoded bodies
app.use(Express.urlencoded()); // to support URL-encoded bodies

app.get("/", (req, res) => {
    console.log("im in home".cyan.bgMagenta)
    res.render("C:/Users/vedan/Desktop/html,css,javascript/NodeJS/formSubmission/templates/views/index.hbs")
})

app.post("/login", async (req, res) => {
    try {
        
        const getemail = req.body.getemail
        const getpass = req.body.getpass
     
        const result = await AllRegistration.findOne({ email: getemail })
        const isvalid = await bcrypt.compare(getpass, result.password )
     

        // MIDDLE WARE  
        const token = await result.generateToken()
        console.log("token is: " + " " + token + "".cyan.bgRed )
        

        if (isvalid) {

            console.log(result)
            res.send(result)
        } else {
            console.log("error".cyan.bgMagenta)
            res.send("Invalid credentials")
        }
    } catch {
        (err) => {
            console.log(`${err}`.cyan.bgRed)
        }
    }
})

app.post("/register", async (req, res) => {
    const fname = req.body.firstname
    const lname = req.body.lastname
    const username = req.body.username
    const city = req.body.city
    const zip = req.body.zip
    const pass = req.body.password
    const cpass = req.body.cpassword
    const email = req.body.email
    if (pass === cpass) {
        // insert in the database ! 
        const doc1 = new AllRegistration({
            fname: fname,
            lname: lname,
            username: "@" + username,
            city: city,
            zip: zip,
            email: email,
            password: pass
        })
        // password is hashed using middleware and bcryptjs 
        // getting the token using middle ware! 
        const getToken = await doc1.generateToken() 
        console.log(getToken)
        const result = await doc1.save()
        console.log(`${result}`.cyan.bgWhite)
        res.send("Succesfully registered")

    } else {
        res.status(401).send("PASSWORDS ARE NOT MATCHING")
    }
})



app.listen(PORT, () => {
    console.log(`started listening at port no : ${PORT}`.cyan.bgGreen)
})