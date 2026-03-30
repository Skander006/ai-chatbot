import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connection réussie à la base de données !");
    } catch(err){
        console.log(`Erreur DB : ${err.message}`);
        process.exit(1);
    }
}

export default connectDB;