import mongoose from "mongoose";
import { createHash } from "../utils.js";

const userCollection = "users"; 

const userSchema = new mongoose.Schema({
    first_name: {type:String, required: true},
    last_name: {type:String, required: true},
    email: {type:String, required: true},
    age: {type: Number, required: true},
    password: {type:String, required: true},
});

userSchema.pre('save', function(next){
    if(!this.isModified('password')) return next();
    this.password = createHash(this.password);
    next();
})

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;