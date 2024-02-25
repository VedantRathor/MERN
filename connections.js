const mongoose = require("mongoose") 
mongoose.connect("mongodb://localhost:27017/REGISTRATIONS")
.then(
    () =>{
          console.log("connected succesfully".cyan.bgGreen)
    } 
)
.catch(
    (err) =>{
            console.log(`${err}`.cyan.bgRed)
    } 
)