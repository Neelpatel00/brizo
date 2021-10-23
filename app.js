const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const User = require('./models/user');
const multer = require('multer');
let jwToken = require('jsonwebtoken');
var bodyParser = require('body-parser');
require('dotenv').config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

const upload = multer({ storage: storage });

const port = process.env.PORT || 1000;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const dburi = "mongodb+srv://neel:neel007@node.tflje.mongodb.net/brizo?retryWrites=true&w=majority";
mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log('not connected'));


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/'));

const apis = require('./controller/apis');

const middleware = require('./controller/middleware');


    var tk;
    var uid;


app.get('/', (req, res) => {

    Product.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { product: result });
            
        })
        .catch((err) => {
            console.log(err);
        });
    // res.render('index');
});

app.get('/product', (req, res) => {

    Product.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('product', { product: result });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/product/:id', (req, res) => {

    Product.findById(req.params.id)
        .then((result) => {
            res.render('details', { product: result });
        })
        .catch(err => console.log('err'));
});


app.get('/products/:id', (req, res) => {

    Product.findById(req.params.id)
        .then((result) => {
            res.render('detailsu', { product: result });
        })
        .catch(err => console.log('err'));
});



app.post('/addproduct', upload.single('image'),apis.addproduct);

app.post('/signin', apis.signin);

app.post('/update/:id', upload.single('image'), apis.update);

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/sign', (req, res) => {
    res.render('sign');
});

app.get('/add', (req, res) => {

    res.render('add');
});

app.get('/update/:id', (req, res) => {

    Product.findById(req.params.id)
        .then((result) => {
            res.render('update', { product: result });
        })
        .catch(err => console.log('error'));

});

app.get('/delete/:id', (req, res) => {

    Product.deleteOne({ _id: req.params.id })
        .then((result) => {
            console.log(result);
            res.redirect('/dash');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/dash', (req, res) => {

    Product.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('dash', { product: result });
        })
        .catch((err) => {
            console.log(err);
        });

})



app.post('/user', (req, res) => {

    const user = new User({
        name: req.body.unm,
        password: req.body.pwd
    });

    user.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => console.log('eror'));
});

app.get('/popup/:id', (req, res) => {
    Product.findById(req.params.id)
        .then((result) => {
            res.render('popup', { product: result });
        })
        .catch(err => console.log('error'));
})

app.listen(port, () => {
    console.log('listing on 1000');
});