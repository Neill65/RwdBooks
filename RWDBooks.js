//declare lists
var lists = new Meteor.Collection("Lists");


//admin only permissions
function adminUser(userId){
	var adminUser = Meteor.users.findOne({username:"admin"});
	
	return ( userId && adminUser && userId === adminUser.id);
}

//grant permissions to user
lists.allow({
	insert : function(userId, doc){
		//return (adminUser(userId) || (userId && doc.owner===userId));
		return _.all(docs, function(doc){//adminUser(userId) || _.all(docs, function(doc) {
			return true ;//doc.owner === userId;
		});
	},
	
	update: function(userId, docs , fields , modifier){
		return _.all(docs, function(doc){//adminUser(userId) || _.all(docs, function(doc) {
			return true ;//doc.owner === userId;
		});
	},
	
	remove: function ( userId, docs){
		return adminUser(userId) || _.all(docs , function(doc) {
			return doc.owner === userId;
		});
	}
});





