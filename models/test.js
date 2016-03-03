var keystone = require('keystone');
var Types = keystone.Field.Types;

var PostCategory = new keystone.List('test', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'Test',
});

PostCategory.add({
	name: { type: String, required: true },
	sex: { type: String},
});


PostCategory.relationship({ ref: 'Post', refPath: 'categories' });

PostCategory.track = true;
PostCategory.register();