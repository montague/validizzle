$(document).ready(function(){
    /* HELPER FUNCTIONS */
    function d(input){
  		if (d.dbg){
  			console.log(input);
  		}
  	}
  	d.dbg = true;
  	
    function setUp(val){
      var value = val === undefined ? "" : val;
      return $('<input type="text" value="' + value + '" name="test_input"/>')
    }
    
    function v($el){
      return $el.validizzle('is_valid');
    }
    
    /* TEST CODE */
    module("validizzle");
    test("testing unobtrusiveness", function(){
      var $el = setUp().validizzle();
      strictEqual(v($el), true, "no params passed in should always return true");
      
      $el = setUp().validizzle({
        builtins: ['email']
      });
      
      strictEqual(v($el), true, "empty value should return true if not required");
    });

    test("test email builtin success", function(){
      $.each(["valid@test.com", "ian.asaff@test.com", "Test_You@boo.gov"], function(i,input){
        (function(){
          var $el = setUp(input).validizzle({
            builtins: ['email']
          });
          strictEqual(v($el), true, "email should have passed: " + input);
        })();
      });
    });
    
    test("test email validation that is not required", function(){
      var $el = setUp("").validizzle({builtins:['email']});
      strictEqual(v($el), true, "blank value should be valid if email is not required");
      
      $el.val("   ");
      strictEqual(v($el), false, "whitespace should be invalid if email is not required");
    });
    
    test("test email builtin failure", function(){
      $.each(["valid@testcom", "ian.asafftest.com", "Test_You[]00&@@boo.gov"], function(i,input){
        (function(){
          var $el = setUp(input).validizzle({
            builtins: ['email']
          });
          strictEqual(v($el), false, "email should have failed: " + input);
        })();
      });
    });
    
    test("test required builtin success", function(){
      var $el = setUp("hi").validizzle({
        builtins: ['required']
      });
      strictEqual(v($el), true, "required input should have been valid: " + $el.val());
    });
    
    test("test required failure", function(){
      var $el = setUp("").validizzle({
        builtins: ['required']
      });
      strictEqual(v($el), false, "blank input should fail");
      
      $el.val('   ');
      strictEqual(v($el), false, "whitespace input should fail");
    });
    
    test("test required email. order of rules shouldn't matter.",function(){
       $.each([['email','required'],['required','email']],function(i,input){
          (function(){
            var $el = setUp("").validizzle({
              builtins: input
            });
            strictEqual(v($el), false, "blank fails if email is required");

            $el.val('  ');
            strictEqual(v($el), false, "whitespace fails if email is required");

            $el.val('test@test');
            strictEqual(v($el), false, "invalid email fails if email is required: |test@test|");

            $el.val('bite@me.gov');
            strictEqual(v($el), true, "valid email passes if email is required")
          })();
        });
    });
	
	test("test minimum length", function(){
		var $el = setUp("").validizzle({
			minLength: 4
		});
		strictEqual(v($el), true, "minimum length passes if field is not required and blank")
		
		$el.val("h");
		strictEqual(v($el), false, "minimum length fails if field is less than minimum length");
		
		$el.val("1234");
		strictEqual(v($el), true, "minimum length passes if field is equal to minimum length");
		
		$el.val("1234jjadsf");
		strictEqual(v($el), true, "minimum length passes if field is greater than minimum length");	
	});

	test("test minimum length required", function(){
		var $el = setUp("").validizzle({
			builtins: ['required'],
			minLength: 4
		});
		strictEqual(v($el), false, "minimum length fails if field is blank and required");
		
		$el.val("hhhh");
		strictEqual(v($el), true, "minimum length passes if field is equal to minimum length and is required");

		$el.val("hhhhjjjj");
		strictEqual(v($el), true, "minimum length passes if field is greater than minimum length and is required");
		
	});

	test("test maximum length", function(){
		var $el = setUp("").validizzle({
			maxLength: 4
		});
		strictEqual(v($el), true, "maximum length passes if field is not required and blank")
		
		$el.val("hdddddddd");
		strictEqual(v($el), false, "maximum length fails if field is greater than maximum length");
		
		$el.val("1234");
		strictEqual(v($el), true, "maximum length passes if field is equal to maximum length");
		
		$el.val("123");
		strictEqual(v($el), true, "maximum length passes if field is less than maximum length");
	});
	
	test("test maximum length required", function(){
		var $el = setUp("").validizzle({
			builtins: ['required'],
			maxLength: 4
		});
		strictEqual(v($el), false, "maximum length fails if field is blank and required");
		
		$el.val("hhhh");
		strictEqual(v($el), true, "maximum length passes if field is equal to maximum length and is required");

		$el.val("hhh");
		strictEqual(v($el), true, "maximum length passes if field is less than maximum length and is required");	
	});

	test("test matchRegex validation", function(){
		var $el = setUp("").validizzle({
			matchRegex:/\d{4}\.\w{4}/
		});
		strictEqual(v($el), true, "matchRegex passes if field is not required and is blank");
		
		$el.val("asdf");
		strictEqual(v($el), false, "matchRegex fails if field doesn't match regex");
		
		$el.val("4444.hhhh");
		strictEqual(v($el), true, "matchRegex passes if field matches regex");
	});
	
	test("test matchRegex validation required", function(){
		var $el = setUp("").validizzle({
			builtins: ['required'],
			matchRegex:/\d{4}\.\w{4}/
		});
		strictEqual(v($el), false, "matchRegex fails if field is required and is blank");
		
		$el.val("asdf");
		strictEqual(v($el), false, "matchRegex fails if field doesn't match regex");
		
		$el.val("4444.hhhh");
		strictEqual(v($el), true, "matchRegex passes if field matches regex");
	});
	
	test("test arbitrary function validations", function(){
		var $el = setUp("").validizzle({
			custom: function($input){
				return $input.val().match(/\w{2}/) && $input.val() === "hi";
			}
		});
		
		strictEqual(v($el), true, "custom validations pass if field is blank and isn't required");
		
		$el.val("as");
		strictEqual(v($el), false, "custom validations fail if one custom validation fails");
		
		$el.val("hi");
		strictEqual(v($el), true, "custom validations pass if all custom validations pass");
	});
	
	test("test arbitrary function validations that are required", function(){
		var $el = setUp("").validizzle({
			builtins: ['required'],
			custom: function($input){
				return $input.val().match(/\w{2}/) && $input.val() === "hi";
			}
		});
		
		strictEqual(v($el), false, "custom validations fail if field is blank and is required");
		
		$el.val("as");
		strictEqual(v($el), false, "custom validations fail if one custom validation fails");
		
		$el.val("hi");
		strictEqual(v($el), true, "custom validations pass if all custom validations pass");
	});
	
	test("test onInvalid callback", function(){
		var $el = setUp("HERRO").validizzle({
			builtins: ['required'],
			matchRegex: /\w{8}/,
      onInvalid: function($el){
        $('<div class="oninvalid"></div>').text($el.val()).appendTo('body');
      }
		});
		strictEqual(v($el), false, "validation should fail");
		strictEqual($('.oninvalid').length, 1, "onInvalid callback fires on validation failure");
		
		$el.val('xxxxxxxx');
		strictEqual(v($el), true, "validation should pass");
		strictEqual($('.oninvalid').length, 1, "onInvalid callback doesn't fire when validation passes");
    
    $('.oninvalid').remove();
	});
	
  test("test onValid callback", function(){
     var $el = setUp("dddd").validizzle({
       builtins: ['required'],
       matchRegex: /\w{4}/,
       onValid: function($el){
         $('<div class="onvalid"></div>').text($el.val()).appendTo('body');
       }
     });
     strictEqual(v($el), true, "validation should pass");
     strictEqual($('.onvalid').length, 1, "onValid callback fires on validation pass");
     
     $el.val('eee');
     strictEqual(v($el), false, "validation should fail");
     strictEqual($('.onvalid').length, 1, "onValid callback doesn't fire when validation fails");
    
    $('.onvalid').remove();
    });
  
    test("test on multiple elements", function(){
      var $el = setUp().add('<input type="text" value="" name="test_input_2"/>');

      $el.validizzle({
        builtins: ['required']
      });
      
      strictEqual($el.length, 2, "should have 2 elements");
      
      strictEqual(v($el), false, "should fail if all elements fail");
      
      $($el.get(0)).val('hi mom');
      
      strictEqual($($el.get(0)).val(), 'hi mom', "one element should have a value set");
      strictEqual($($el.get(1)).val(), '', "one element should have no value set");
      strictEqual(v($el), false, "validation should fail if one element is invalid");
      
      $($el.get(1)).val('hi dad');
      strictEqual(v($el), true, "validation should pass if all elements are valid");
    });
    
    test("multiple elements callbacks", function(){
      var $el = setUp("input1").add('<input type="text" value="input2" name="test_input_2"/>');

      $el.validizzle({
        matchRegex: /\d{4}/,
        onValid: function($el){
          $('<div class="onvalid"></div>').text($el.val()).appendTo('body');
        },
        onInvalid: function($el){
          $('<div class="oninvalid"></div>').text($el.val()).appendTo('body');
        }
      });
      
      v($el);
      strictEqual($(".oninvalid").length, 2, "both elements get callbacks if they fail");
      strictEqual($($(".oninvalid").get(0)).text(), "input1", "oninvalid callback is executed in the correct context");
      strictEqual($($(".oninvalid").get(1)).text(), "input2", "oninvalid callback is executed in the correct context");
      
      $('.oninvalid').remove();
      
      $($el.get(0)).val('9999');
      $($el.get(1)).val('8888');
      
      v($el);
      strictEqual($(".onvalid").length, 2, "both elements get callbacks if they pass");
      strictEqual($($(".onvalid").get(0)).text(), "9999", "onvalid callback is executed in the correct context");
      strictEqual($($(".onvalid").get(1)).text(), "8888", "onvalid callback is executed in the correct context");

      $('.onvalid').remove();
    });
    
    test("called on a non-existent element", function(){
      var $el = $('#blargh').validizzle({
        builtins:['required']
      });
      
      strictEqual(v($el), false, "should return false because no element was found");
    });
    
    test("multiple elements callbacks with elements set independently", function(){
      var $el_1 = setUp("input1"),
          $el_2 = $('<input type="text" value="input2" name="test_input_2"/>'),
          els = [$el_1, $el_2],
          els_length = els.length;

      for(var i=0; i<els_length; i++){
        els[i].validizzle({
          matchRegex: /\d{4}/,
          onValid: function($el){
            $('<div class="onvalid"></div>').text($el.val()).appendTo('body');
          },
          onInvalid: function($el){
            $('<div class="oninvalid"></div>').text($el.val()).appendTo('body');
          }
        });
      }

      
      
      v($el_1);
      v($el_2);
      strictEqual($(".oninvalid").length, 2, "both elements get callbacks if they fail");
      strictEqual($($(".oninvalid").get(0)).text(), "input1", "oninvalid callback is executed in the correct context");
      strictEqual($($(".oninvalid").get(1)).text(), "input2", "oninvalid callback is executed in the correct context");
      
      $('.oninvalid').remove();
      
      $el_1.val('9999');
      $el_2.val('8888');
      
      v($el_1);
      v($el_2);
      strictEqual($(".onvalid").length, 2, "both elements get callbacks if they pass");
      strictEqual($($(".onvalid").get(0)).text(), "9999", "onvalid callback is executed in the correct context");
      strictEqual($($(".onvalid").get(1)).text(), "8888", "onvalid callback is executed in the correct context");

      $('.onvalid').remove();
    });
    
  
});//end of $(document).ready
