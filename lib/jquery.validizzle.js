(function($){
	function d(input){
		if (d.dbg){
			console.log(input);
		}
	}
	d.dbg = false;
	//default options
	var regexes = {
		// 'required': false,
		// 	'minLength': -1, 
		// 	'maxLength': -1,
		'email': /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//		'customValidators':[]
	};
	//built-in validation methods
	var validationMethods = {
		required: function($el){
			//return false if blank or all whitespace
			return $.trim($el.val()).length > 0;
		},
		// minLength: function($el){
		// 			return $el.val().length == 0 || $el.val().length >= params.minLength;
		// 		},
		// 		maxLength: function($el){
		// 			return $el.val().length == 0 || $el.val().length <= params.maxLength; 
		// 		},
		// matchRegex: function($el){
		// 			return $el.val().length == 0 || $el.val().match(params.regex);
		// 		},
		email: function($el){
			return $el.val().length == 0 || $el.val().match(regexes.email);
		}
	};
	
	function parseBuiltIns(validationFunctions,builtins){
		d("parsing builtins");
		
		builtins.map(function(fn){
			//add each builtin function to the validationFunctions queue
			validationFunctions.push(validationMethods[fn]);
		});
		delete builtins;
	};
	
	//public methods
	var methods = {
		init : function(validations){
			d("calling init");
			//via the options passed in, we determine which validations to run
			//there are four built-in validations
			//they are passed in via the builtin property in a string array
			//example: { builtin: ["required", "email"]}
			// $.extend( defaults, options );
			return this.each(function(){
				var $t = $(this);
				d("going over each");
				var validationFunctions = [];
				//define a validate function that hangs off the DOM element
				for(var name in validations){
					if(validations.hasOwnProperty(name)){
						if (name === 'builtins'){
							d("builtins is defined");
							parseBuiltIns(validationFunctions,validations.builtins);
							d("builtins is defined? " + (validations.builtins === undefined));
							
						}else{
							validationFunctions.push(validations[name]);
						}
					}
				}
				this.validate = (function(){
					return function(){
						var valid = true;
						//validation logic goes here
						validationFunctions.map(function(fn){
							valid = valid && !!fn($t);
						});
						d($t.attr('name') + " valid? " + valid);
						return valid;//required($t);
					}
				})();
			});
		},
		is_valid : function(){
			var valid;
			//do something to make sure this is called on individual elements
			this.each(function(){
				//call the previously defined DOM#validate method
				valid = this.validate();
			});
			return valid;
		} 
	};
	
	$.fn.validizzle = function(method){
		if(methods[method]){
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ){
			return methods.init.apply( this, arguments );
		} else {
			$.error('wtf?');
		}
	};
})(jQuery);