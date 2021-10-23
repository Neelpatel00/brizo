const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const User = require('../models/user');
let jwToken = require('jsonwebtoken');
const multer = require('multer');
var bodyParser = require('body-parser');
require('dotenv').config();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/uploads/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now()+ file.originalname )
//     }
//   });

// const upload = multer({ storage: storage });

const http = require('http');
const util = require('util');

// https://github.com/node-formidable/node-formidable
const Formidable = require('formidable');

//https://www.npmjs.com/package/dotenv
const cloudinary = require("cloudinary");
require('dotenv').config()


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

//Create a server

module.exports = {

    addproduct: async (req, res) => {
        //https://cloudinary.com/documentation/upload_images
        
        cloudinary.uploader.upload(req.file.path, result => {
            const product = new Product({
                productname:req.body.name,
                price:req.body.price,
                size:req.body.size,
                cat:req.body.cat,
                image:result.secure_url
            });
           // console.log(req.file);
            product.save()
                .then((result) => {
                    res.redirect('/dash');
                })
                .catch((err) => {
                    console.log('error');
                });
    
        });
        
    },


    update : async (req, res) => {

        cloudinary.uploader.upload(req.file.path, result => {

            Product.findByIdAndUpdate(
                req.params.id,
                { $set: {
                    productname:req.body.name,
                    price:req.body.price,
                    size:req.body.size,
                    cat:req.body.cat,
                    image:result.secure_url
                } }, (err) => {
                    if(err){
                        console.log('error');
                    }
                    else{
                        res.redirect('/dash');
                    }
                }
            )
        });
        

    },

    signin : async (req, res) => {

       const user = await User.findOne({ name: req.body.unm });
       if(user){
           const token = jwToken.sign({ _id: user._id }, 'brizo', { expiresIn: '365d' });

           User.findOneAndUpdate(
               { _id: user._id },
               {$set:
                   { token:token }
            },
            {returnOriginal: false}
           )
           .then((result) => {

            Product.find().sort( { createdAt: -1 } )
            .then((result) => {
                res.render('dash',{ product: result });
            })
            .catch((err) => {
                console.log(err);
            });
    
              
           })
           .catch(err => console.log('error'));
       }
       else{
           res.redirect('/');
       }
    },




}