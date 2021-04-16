const mongoose = require('mongoose');
const config = require('config');
//const db = config.get('mongoURI');

const connectDB = async () => {
	try {
		await mongoose.connect("mongodb+srv://Brad_Traverse:Garagec250@cluster0.o5kvx.mongodb.net/beaver?retryWrites=true&w=majority"
        , {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});

		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
