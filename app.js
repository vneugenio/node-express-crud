const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let session = require('express-session');

mongoose.connect('mongodb://eugeniov:test123@ds113003.mlab.com:13003/crud');
let db = mongoose.connection;

// Init app
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret: 'olats-olats-olats',
    resave: true,
    saveUninitiallized: true,
    cookie: {
        loggedIn:false
    }

}));

// Bring in model
let User = require('./app/models/users');

// Start server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});



// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// home route - login
app.get('/', (req, res) => {
    console.log(req.session.cookie);
    res.render('index', {
        title: 'Login'
    });
});


app.post('/login', (req, res) => {
    const handle = req.body.handle;
    const password = req.body.password;

    console.log(handle);

    User.findOne({username: handle}, (err, obj) => {
        if(err){
            console.log(err);
        }

        if(obj === null) {
            User.findOne({email: handle}, (err, obj) =>{
                if(obj === null) {
                    res.render('index', {
                        title: 'User does not exist!'
                    });
                }
            });
        } else if(obj !== null){
            bcrypt.compare(password, obj.password, (err, result) => {
                if(result){
                    let appSesh = req.session
                    appSesh.cookie.loggedIn = true;
                    appSesh.save();
                    console.log(appSesh)
                    res.redirect('/users');
                }
            });

        }
    });


});


// Display users
app.get('/users', (req, res) => {
    req.session.save();
    let appSesh = req.session;
    console.log(appSesh);
    if(appSesh.cookie.loggedIn === true) {
        User.find({}, (err, users) => {
            if(err) {
                console.log(err);
            }
            res.render('users', {
                title: 'View All Users',
                users: users
            });
        });
    } else {
        res.redirect('/');
    }
});

// Route for Add user form
app.get('/users/registration', (req, res) => {
    res.render('register_user', {
        title: 'Register New User'
    });
});

// Add submit POST route
app.post('/users/registration', (req, res) => {
    let user = new User();

    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;

    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash;
        console.log(user.password);
        user.save((err) => {
            if(err) {
                console.log(err);
            } else {
                res.redirect('/users');
            }
        });
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
