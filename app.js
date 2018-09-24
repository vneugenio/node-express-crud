const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://eugeniov:test123@ds113003.mlab.com:13003/crud');
let db = mongoose.connection;

// Check connection
db.once('open', () => {
    console.log('Connected to MongoDB!');
});

// check for db errors
db.on('error', (err) => {
    console.log(err);
});

// Init app
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Bring in model
let User = require('./app/models/users');


// Start server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});



// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// home route
app.get('/', (req, res) => {
    res.render('index');
});

// Display users
app.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        if(err) {
            console.log(err);
        }
        res.render('users', {
            title: 'View All Users',
            users: users
        });
    });
});

// Route for Add user form
app.get('/users/add', (req, res) => {
    res.render('add_user', {
        title: 'Add User'
    });
});

// Add submit POST route
app.post('/users/add', (req, res) => {
    let user = new User();

    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save((err) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/users');
        }
    });
});


// Prepare form for edit
app.get('/users/edit/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        const title = user.username;
        res.render('edit_user', {
            title: title,
            user: user
        })
    });
});


// Edit Submission
app.post('/users/edit/:id', (req, res) => {
    let user = {};

    user.username = req.body.username;
    user.email = req.body.email;

    let query = {_id:req.params.id};

    User.update(query, user, (err) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/users');
        }
    });
});

app.get('/users/delete/:id', (req, res) => {
    let query = {_id:req.params.id};
    User.deleteOne(query, (err, obj) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/users');
        }

    })
});
