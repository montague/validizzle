(function($){
	//default options
	var defaults = {
		'required': false,
		'minLength': -1, 
		'maxLength': -1,
		'email': /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		'customValidators':[]
	};
	
	//builtvalidation
	var validationMethods = {
		required: function($el){
			//return false if blank or all whitespace
			return $.trim($el.val()).length == 0;
		},
		minLength: function($el){
			return $el.val().length >= defaults.minLength
		},
		maxLength: function($el){
			return $el.val().length <= defaults.maxLength 
		},
		email: function($el){
			return $el.val().match(defaults.email)
		}
	};
	
	//public methods
	var methods = {
		set : function(options){
			$.extend( defaults, options );
			return this.each(function(){
				this.validate = function(){
					var $t = $(this);
					//validation logic goes here
					console.log("validating... " + $t.attr('name'));
					return required($t);
				};
			});
		},
		is_valid : function(){
			var valid = true;
			this.each(function(){
				valid = valid && this.validate();
			});
			return valid;
		} 
	};
	
	$.fn.validizzle = function(method){
		if(methods[method]){
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ){
			return methods.set.apply( this, arguments );
		} else {
			$.error('wtf?');
		}
		
			// 	
			// var settings = {
			// 	'builtin': 'required'
			// };
			// //want to call a series of functions on each element, then return true
			// return this.each(function(){
			// 	$t = $(this);
			// 	$t.validate = (function(){
			// 		return function(){
			// 			var attr = $t.attr('name');
			// 			console.log(attr);
			// 			return attr;
			// 		}
			// 	})();
			// });
	};
})(jQuery);