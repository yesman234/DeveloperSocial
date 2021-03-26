const mongoose = require('mongoose');
const config = require('config');
//const dataBase = config.get('mongoURI');

const connectDB = async()=>{
    
    try{
        await mongoose.connect(MONGO_URI = 'mongodb+srv://Brad_Traverse:Garagec250@cluster0.o5kvx.mongodb.net/beaver?retryWrites=true&w=majority',{
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