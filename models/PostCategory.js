var keystone = require('keystone');
var Types = keystone.Field.Types;

var PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'Ангилалууд',
});

PostCategory.add({
	name: { type: String, required: true },
	position: { type: Types.Select, options: 'top, center, right, left, top-right, top-left, bottom', default: 'draft', index: true , required: true},
});


PostCategory.relationship({ ref: 'Post', refPath: 'categories' });

PostCategory.track = true;
PostCategory.register();
