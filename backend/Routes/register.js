const express = require('express');
const { UserModel } = require('../Model/UserModel');
const Register = express.Router();

Register.post("/register" , async(req,res)=>{
  const {name , email , password , age } = req.body;
  const existingEmail = await UserModel.find({email});
 
})

module.exports = {
    Register
}