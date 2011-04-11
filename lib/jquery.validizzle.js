(function($){
	function d(input){
		if (d.dbg){
			console.log(input);
		}
	}
	d.dbg = true;
	//default options
	var regexes = {
		'email': /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	};
	
	var validationMethods = {
		required: function($el){
			//return false if blank or all whitespace
			return $.trim($el.val()).length > 0;
		},
		minLength: function($el,n){
			return $el.val().length === 0 || $el.val().length >= n;
		},
		maxLength: function($el,n){
			return $el.val().length == 0 || $el.val().length <= n; 
		},
		matchRegex: function($el,regex){
			return $el.val().length == 0 || !!$el.val().match(regex);
		},
		email: function($el){
			return $el.val().length === 0 || !!$el.val().match(regexes.email);
		}
	};
	
	//public methods
	var methods = {
		init : function(settings){
			return this.each(function(){
				var $t = $(this),
					validationFunctions = [];
				this.onValid = function(){};
				this.onInvalid = function(){};
					
				//define a validate function that hangs off the DOM element
				for(var name in settings){
					if(settings.hasOwnProperty(name)){
						switch(name){
							case 'builtins':
								//parseBuiltins(validationFunctions, settings.builtins);
								settings.builtins.map(function(fn){
									//add each builtin function to the validationFunctions queue
									validationFunctions.push(validationMethods[fn]);
								});
								break;
							case 'minLength':
								validationFunctions.push(function($el){
									return validationMethods.minLength($el, settings.minLength);
								});
								break;
							case 'maxLength':
								validationFunctions.push(function($el){
									return validationMethods.maxLength($el, settings.maxLength);
								});
								break;
							case 'matchRegex':
								validationFunctions.push(function($el){
									return validationMethods.matchRegex($el, settings.matchRegex);
								});
								break;
							case 'custom':
								validationFunctions.push(function($el){
									return $el.val().length === 0 || settings.custom($el);
								});
								break;
							case 'onInvalid':
								this.onInvalid = settings.onInvalid;
								break;
							case 'onValid':
								this.onValid = settings.onValid;
								break
							default:
								d("in default... shouldn't hit this right now");
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
						return valid;
					}
				})();
			});
		},
		is_valid : function(){
			var valid = true;
			//do something to make sure this is called on individual elements
			this.each(function(){
				//call the previously defined DOM#validate method
		 		if(this.validate()){ 
					this.onValid($(this)); 
				}
				else {
					this.onInvalid($(this));
					valid = false;
				}
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
			$.error('son of a...');
		}
	};
})(jQuery);