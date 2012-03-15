(function($){
	function d(input){
		if (d.dbg){
			console.log(input);
		}
	}
	d.dbg = false;
	d("why you debuggin?");
	//default options
	var regexes = {
		'email': /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	};
	
	var validizzleMethods = {
		required: function($el){
			//return false if blank or all whitespace
			return $.trim($el.val()).length > 0;
		},
		minLength: function($el,n){
			return $el.val().length === 0 || $el.val().length >= n;
		},
		maxLength: function($el,n){
			return $el.val().length === 0 || $el.val().length <= n; 
		},
		matchRegex: function($el,regex){
			return $el.val().length === 0 || !!$el.val().match(regex);
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
				this.validateOnBlur = true;
				this.validateSelectOnChange = true;
				//define a validate function that hangs off the DOM element
				for(var name in settings){
					if(settings.hasOwnProperty(name)){
						switch(name){
							case 'builtins':
								$.each(settings.builtins,function(index,fn){
									//add each builtin function to the validationFunctions queue
									validationFunctions.push(validizzleMethods[fn]);
								});
								break;
							case 'minLength':
								validationFunctions.push(function($el){
									return validizzleMethods.minLength($el, settings.minLength);
								});
								break;
							case 'maxLength':
								validationFunctions.push(function($el){
									return validizzleMethods.maxLength($el, settings.maxLength);
								});
								break;
							case 'matchRegex':
								validationFunctions.push(function($el){
									return validizzleMethods.matchRegex($el, settings.matchRegex);
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
							case 'validateOnBlur':
								this.validateOnBlur = settings.validateOnBlur;
							// case 'onFocus':
							// 	this.onFocus = settings.onFocus;
							default:
								d("in default... shouldn't hit this right now");
						}
					}
				}
				this.validate = function(){
					var valid = true;
					$.each(validationFunctions,function(index,fn){
						valid = valid && !!fn($t);
					});
					return valid;
				};
				
				//if we are dealing with a select element, 
				//validate on change
				if ($t.is('select') && this.validateSelectOnChange === true){
					$t.change(function(){
						$t.validizzle('is_valid');
					});	
				}
				//attach onBlur validation if it exists
				//and we haven't set validateSelectOnChange
				else if(this.validateOnBlur === true){
					$t.blur(function(){
						$t.validizzle('is_valid');
					});
				}
			});
		},
		is_valid : function(){
			var valid = (this.length > 0);
			
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