//Lets load the mongoose module in our program
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require("express");
app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('views', __dirname + '/templates/')
app.set('view engine', 'jade')
// app.use(express.logger('dev'))
// app.use(stylus.middleware(
//   { src: __dirname + '/public'
//   , compile: compile
//   }
// ))
app.use(express.static(__dirname + '/public'))

app.listen(3001);
//Lets connect to our database using the DB server URL.
mongoose.connect('mongodb://localhost/keystone-demo');

var postSchema = Schema({
	_id 	: String,
	key  	: String,
	name	: String,
	state	: String,
	author	: [{ type: Schema.Types.ObjectId, ref : 'Users'}],
	categories : [{type: Schema.Types.ObjectId, ref : 'Postcategories'}],
	relatedposts : [{type: Schema.Types.ObjectId, ref : 'Posts'}],
});

var postCategorySchema = Schema({
	_id 	: Schema.Types.ObjectId,
	key  	: String,
	name	: String,
	state	: String,
	position: String
});

var userSchema = Schema({
	_id 	: Schema.Types.ObjectId,
	email  	: String,
	password: String,
	name	: Array
});

app.get('/', function (req, res) {
  res.render('index',{ title : 'Home' });
});

app.get('/post/:key', function (req, res) {
	var Post = mongoose.model('Posts', postSchema);
	var PostCat = mongoose.model('Postcategories', postCategorySchema);
	var User = mongoose.model('Users', userSchema);

	Post
	.findOne({ key: req.params.key })
		.populate('author')
		.populate('categories')
		.populate('relatedposts')
		.exec(function(err, result) {
	  		if (err) return console.error(err);

	  		if(result == null){
	  			error404(res);
	  		}

	  		res.render('news', { result : result });
	  	}
	);
});

function error404(res) {
	var err = new Error('Not Found');
	err.status = 404;
	res.render('errors/404', {
		message: err.message,
		error: {}
	});
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  error404(res);
});

app.get("/getMenus", function(req, res){
	
	var Post = mongoose.model('Posts', postSchema);
	var PostCat = mongoose.model('Postcategories', postCategorySchema);
	var User = mongoose.model('Users', userSchema);

	Post
		.find()
		// .find()
		.populate('author')
		.populate('categories')
		.where('name').in(['mySecondPost'])
		.exec(function(err, result){
			if(err) return console.error(err);
			console.log('author is %s', result[0].categories[0].name)
			res.json(result);
	});
});