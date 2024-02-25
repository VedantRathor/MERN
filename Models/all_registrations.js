require("dotenv").config() 
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registrationSchema = new mongoose.Schema({
    fname : String,
    lname : String,
    username : String,
    city : String, 
    zip : Number,
    email : String,
    password : String,
    tokens : [{
        token:{
            type : String,
            required : true 
        }
    }]
})


registrationSchema.methods.generateToken = async function(){
    try{
          const token = await jwt.sign({_id: `${this._id}`.toString }, process.env.SECRET_KEY)           
        //   console.log(token)
        this.tokens = this.tokens.concat({token:token}) 
        await this.save()
        return token
    }catch{
        (err) => {
            console.log(err) 
        }
    }
}

registrationSchema.pre("save",async function(){
     try{if( this.isModified("password")){
        console.log(`${this.password}`.cyan.bgYellow)
        this.password = await bcrypt.hash(this.password,10)
        console.log(`${this.password}`.cyan.bgYellow)
     }     
    next() ;} catch (error) {
      
    }
})

const AllRegistration = new mongoose.model("AllRegistration" , registrationSchema ) 
module.exports = AllRegistration