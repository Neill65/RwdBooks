Meteor.subscribe("Categories");
  
  Meteor.autosubscribe(function(){
	 Meteor.subscribe("listdetails",Session.get('current_list'));
	});
  
  
  Template.categories.lists=function(){
		return lists.find({},{sort:{Category:1}});
  };
  
  //add category
  Session.set('adding_category', false);
  
  //if true
  Template.categories.new_cat = function () {
		return Session.equals('adding_category',true);
	}
	
	Template.categories.events({
		'click #btnNewCat': function (e, t) {
			Session.set('adding_category', true);
			Meteor.flush();
			focusText(t.find('#add-category'));
			
			},
			 //if user presses enter
				'keyup #add-category': function (e,t){
					if (e.which === 13)
					{
						var catVal = String(e.target.value || "");
						if (catVal)
						{
							lists.insert({Category:catVal , owner: this.userId});
							Session.set('adding_category', false);
						}
					}
				},
				
				//remove input box if focus is not on box
				'focusout #add-category': function(e,t){
					Session.set('adding_category',false);
				},
				
				'click .category':selectCategory
				
		
	});
	
	//place cursor
	function focusText(i,val) {
		i.focus();
		i.value=val ? val : "";
		i.select();
	};
	
	function selectCategory(e,t){
		Session.set('current_list',this._id);
	}
	
	function addItem(list_id,item_name){
		if (!item_name && !list_id)
		return;
		lists.update({_id:list_id},
		{ $addToSet : { items : {Name : item_name } } } ) ;
	}
	
	function removeItem(list_id,item_name){
		if(!item_name&&!list_id)
			return;
			lists.update({_id : list_id},
			{$pull:{items:{Name:item_name} } } );
		}
	
	
	
	function updateRating(list_id,item_name,Rating_name){
		var l = lists.findOne({"_id":list_id,"items.Name":item_name});
		if(l && l.items)
		{
			for(var i = 0 ; i <l.items.length;i++)
			{
				if(l.items[i].Name===item_name)
				{
					l.items[i].Rated=Rating_name;
				}
			}
			
			lists.update({"_id":list_id},{$set:{"items":l.items}});
		}
	};
	
	//Rate book
	Template.list.items=function(){
		if(Session.equals('current_list',null))
			return null;
		
		else
		{
			var cats = lists.findOne({_id:Session.get('current_list') } );
			if(cats && cats.items)
			{
				for(var i = 0 ; i < cats.items.length;i++)
				{
					var d = cats.items[i]; 
					d.Rating=d.Rated ? d.Rated :
					"What do you think?"; 
					d.Rating_book = d.Rated ?
					"label-important" : "Good , Ok , Bad";
				}
				return cats.items;
			};
		};
	};
	
	Template.list.list_selected=function(){
		return( (Session.get('current_list') != null) && (!Session.equals('current_list',null) ) );
	};
	
	Template.categories.list_status=function(){
		if(Session.equals('current_list',this._id))
			return "" ;
		else
			return "btn-inverse";
	};
	
	Template.list.list_adding=function(){
		return(Session.equals('list_adding',true));
	};
	
	Template.list.Rating_editing = function(){
		return(Session.equals('Rating_input',this.Name));
	}
	
	Template.list.events({
		'click #btnAddItem' : function(e,t){
		Session.set( 'list_adding',true);
		Meteor.flush();
		focusText(t.find("#book_to_add"));
	},
	
	'keyup #book_to_add': function(e,t){
		if(e.which===13)
		{
			addItem(Session.get('current_list'),e.target.value);
			Session.set('list_adding',false);
		}
	},
	
	'focusout #book_to_add': function(e,t){
		Session.set('list_adding',false);
	},
	
	'click .delete_item': function(e,t){
		removeItem(Session.get('current_list'),e.target.id);
	},

	'click .Rating' : function(e,t){
		Session.set('Rating_input',this.Name);
		Meteor.flush();
		focusText(t.find("#edit_Rating"),this.Rated);
	},

	'keyup #edit_Rating': function (e,t){
		if (e.which === 13)
		{
			updateRating(Session.get('current_list'),this.Name,
			e.target.value);
			Session.set('Rating_input',null);
		}
		if (e.which === 27)
		{
			Session.set('Rating_input',null);
		}
	}
});
	
//sign in functionality
Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
	});
