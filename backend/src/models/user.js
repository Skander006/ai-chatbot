import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            required : [true, "Email requis"],
            lowercase : true,
            unique : true,
            trim : true
        },

        password : {
            type : String,
            required : [true, "Mot de passe requis"],
            minlength : [6, "Minimum 6 caractères"]
        },
    },
    {timestamps : true}
);

UserSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function(pass){
    return bcrypt.compare(pass, this.password);
}

export default mongoose.model("User",UserSchema);