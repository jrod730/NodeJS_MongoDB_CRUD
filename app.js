//require modules that we want to use
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var expressValidator = require('express-validator')
var mongojs = require('mongojs')
var db = mongojs('customerapp', ['users'])
var ObjectId = mongojs.ObjectId
var app = express()

const { check, validationResult } = require('express-validator/check');

//middleware

//global var
app.use(function(req, res, next){
	res.locals.errors = [];
	next();
});

// loggin
var logger = function(req, res, next){
	console.log('logging...')
	next()
}

app.use(logger)


// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))



// view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


// Set static path
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.post('/users/add', [check('firstName').isLength({min: 1}).withMessage('Please Enter First Name'), check('email').isEmail().withMessage('Must be a valid email')],function(req, res){


	var errors = validationResult(req);
		
	if(! errors.isEmpty()){
		db.users.find(function(err, docs){
			console.log(docs);
			res.render('index', {
				title: 'Customer',
				users: docs,
				errors: errors.array()

			});
		});
	}
	else{

		var newUser = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email
		};
		db.users.insert(newUser, function(err, record){
			if(err){
				console.log(err);
			}

			res.redirect('/');
		});
		
	}
});
	

app.get('/', function(req, res){
		
		db.users.find(function(err, docs){
			res.render('index', {
				title: 'Customer',
				users: docs
			});
		});	

});

app.delete('/users/delete/:id', function(req, res){
	console.log(req.params.id);
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, record){
		console.log(req.params.id);
		if(err){
			console.log(err);
		}
		console.log(record);
		res.redirect('/');

	});
});

//TODO: get update working.

app.put('/users/edit/:id', function (req, res) {

	//grab user and convert to array
	var user = db.users.find({ _id: ObjectId(req.params.id) }).toArray(function(err, record){
		if(err){
			console.log(err);
		}
		console.log(record);
	});

	res.render('edit',  {
		put: true,
		title: 'Editing User:',
		users: user

	});

	db.users.update({ _id: ObjectId(req.params.id) }, {set: {firstName: req.body.firstName}, {lastName: req.body.lastName}, {email: req.body.email}}, 
					function(err, record){
						if(err){
							console.log(err);
						}
						console.log(record);
						redirect('/');

					});
	

})



// app.put('/user/edit/:id', [check('firstName').isLength({min: 1}).withMessage('Please Enter First Name'), check('email').isEmail().withMessage('Must be a valid email')], function(req, res){
// 	var errors = validationResult(req);
		
// 	if(! errors.isEmpty()){
// 		var user = db.users.find({ _id: ObjectId(req.params.id) }).toArray(function(err, record){
// 			if(err){
// 				console.log(err);
// 			}
// 			console.log(record);
// 		});

// 		res.render('edit',  {
// 			put:true,
// 			title: 'Editing User: ' + user.firstName + " " + user.lastName,
// 			user: user,
// 			errors: errors.array()

// 		});
// 	}
// 	else{
// 		console.log(req.params.id);
// 		// db.users.update({ _id: ObjectId(req.params.id) }, {$set: {firstName: req.body.firstName}, {lastName: req.body.lastName}, {email: req.body.email}});
// 	}


// })



// server
app.listen(3000, function(){
	console.log('Server started on port 3000')
})