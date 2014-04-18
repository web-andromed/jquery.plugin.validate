/***
*	Плагин валидации (вторая версия)
*	@author Ефременков Антон
*	@copyright ООО "Студия Волга-Веб"
*	@version 2.0 (2014/04/18)
*/
jQuery.fn.validate = (function ($, undefined) {
	/***
	*	@var object defaultOptions Набор стандартных опций
	*		 		string errorClass класс, который будет присваиваться эл-ту, не прошедшему проверку
	*				boolean isAjax 
	*				boolean isLive 
	*				funciton fieldFocusFn 
	*				funciton completeFn 
	*/
	var defaultOptions = {
		errorClass : 'error',
		isAjax : false,
		isLive : false,
		fieldFocusFn : function(){},
		completeFn : function(status,form,fields){ if(status=='done' && !this.isAjax) form.submit(); }
	};
	
	/***
	*	@var object defaultReg Набор стандартных регулярных выражений
	*/
	var defaultReg = {
		'email' : /.+@.+\..+/,
		'phone' : /^(8|\+7)+[\-\s]?(\(?\d{3,5}\)?)[\-\s]?([\d\- ]{5,10})$/,
		'number' : /^[0-9]+$/
	}
	
	/***
	*	Метод проверки значения поля
	*	@var string value начение поля
	*	@var object data объект с данными поля
	*	@return boolean
	*/
	function _checkFieldValue(value,data){
		if(typeof data["rule"]==='undefined') return true;
		value = $.trim(value);
		
		switch(data["rule"]){
			case 'required':
				if(value) return true;
				break;
			case 'match':
				if($.isArray(data["value"]))
					for(var i in data["value"]){
						if(_checkMatch(value,data["value"][i])) return true;
					}
				else
					if(_checkMatch(value,data["value"])) return true;
				break;
		}
		
		return false;
	}
	
	function _checkMatch(value,type){
		var match = defaultReg[type];
		if(typeof match==='undefined'){
			match = eval(type);
		}
		
		return value.match(match);
	}
	
	var Constr = function(options, element){

		if (!(this instanceof Constr)) {
			return new Constr(options, $(this));
		}
	
		this.options = $.extend(true, {}, defaultOptions, options || {});

		var self = this;
		this.form = element;
		this.fields = new Array();
		
		this.form.submit(function(event){
			event.preventDefault();
			
			self.checkForm();
			
			//if(!self.options.isAjax)
			//	self.form.unbind();
			
			//self.options.completeFn('done',self.form);
		})
		
	};
	
	Constr.prototype = {
		checkForm : function(){
			var self = this;
			var fields = this.form.find('[data-validate]');
			fields.each(function(){
				self.checkField($(this));
			})
		},
		checkField : function(field){
			if(!field.length) return false;
			var validate = field.data('validate'),
				value = field.val();
			
			if(!$.isArray(validate)){
				var tmp = validate;
				validate = new Array(tmp);
			}
			
			for(var i in validate){
				if(!_checkFieldValue(value,validate[i]))
					return false;
			}
			
			return true;
		}
	};

	return Constr;
})(jQuery);