const mongoose = require('mongoose');
const config = require('config');
const dataBase = config.get('mongoURI');

const connectDB = async()=>{
    
    try{
        await mongoose.connect(dataBase,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex:true
        });
        console.log('mongo db Connected')
    }catch(err){
        console.error(err.message);
        //exit process with failure
        process.exit(1);
    }

}
module.exports = connectDB;