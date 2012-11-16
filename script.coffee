
class HTML5Form
	"use strict"

	@FormPlaceholderDecorator = class FormPlaceholderDecorator
		constructor : (@textFormField) ->
			@textFormField.$element.bind 'blur', @blur
			@textFormField.$element.bind 'focus', @focus
			@textFormField.element.value = @placeholder()
			@textFormField.$element.addClass('placeholder')
		placeholder : ->
			@textFormField.$element.attr('placeholder')
		focus : (e) =>
			if @textFormField.$element.val() == @placeholder()
				@textFormField.element.value = ''
				@textFormField.$element.removeClass('placeholder')
		blur : () =>
			if @textFormField.$element.val() == ''
				@textFormField.element.value = @placeholder()
				@textFormField.$element.addClass('placeholder')

	@FormField = class FormField
		required : false
		constructor : (@element) ->
			@$element = $(@element)
			if @$element.attr('autofocus') then @$element.focus();
		validate : -> 
			validate = @_validate()
			if not validate then @$element.addClass 'invalid'
			validate
		_validate : -> true


	@TextFormField = class TextFormField extends HTML5Form.FormField
		pattern : null
		constructor : (@element) ->
			super(@element)
			@$element.bind('focus', @focus)
			@$element.bind('blur', @blur)
			if @$element.attr('placeholder') then new HTML5Form.FormPlaceholderDecorator(@)
		focus : (event) => 
			@$element.removeClass 'invalid'
		blur  : (event) => 
			if not @_validate() then @$element.addClass 'invalid'
		_validate : -> 
			if @$element.attr('pattern') then @pattern = new RegExp(@$element.attr('pattern'))
			@val = @$element.val()
			_return = true
			if @pattern and @val.length > 0 and @val.search(@pattern) is -1 then _return = false
			else if @$element.attr('required') and @val.length == 0 then _return = false
			_return


	@EmailFormField = class EmailFormField extends HTML5Form.TextFormField
		pattern : /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i

	@TelFormField = class TelFormField extends HTML5Form.TextFormField
		pattern : /^([0-9\(\)\/]*)$/i

	@UrlFormField = class UrlFormField extends HTML5Form.TextFormField

	@SelectFormField = class SelectFormField extends HTML5Form.FormField
		constructor : (@element) ->
			super(@element)
			@$element.bind('focus', @focus)
			@$element.bind('blur', @blur)
		focus : (event) => 
			@$element.removeClass 'invalid'
		blur  : (event) => 
			if not @_validate() then @$element.addClass 'invalid'
		_validate : -> 
			@val = @$element.val()
			if @$element.attr('required') and @val.length == 0 then return false
			true

	@CheckboxFormField = class CheckboxFormField extends HTML5Form.FormField
		@names : []
		constructor : (@element) ->
			super(@element)
			@name = @$element.attr('name')
			for name in HTML5Form.CheckboxFormField.names
				if(@name == name) 

					return {validate: -> true}
			HTML5Form.CheckboxFormField.names.push(@$element.attr('name'))
			console.log(@name)
		validate : ->
			if $('form input[name='+@name+']:checked').length > 0 then return true
			false

	@TextAreaFormField = class TextAreaFormField extends HTML5Form.TextFormField





$.fn.html5FormValidator = () ->
	# Default settings
		html5form = new HTML5Form()
		formFieldFactory = (element) ->
			console.log( element.tagName )
			if element.tagName.toUpperCase() is 'SELECT'
				return new HTML5Form.SelectFormField(element)
			else if element.tagName.toUpperCase() is 'TEXTAREA'
				return new HTML5Form.TextAreaFormField(element)
			else	
				switch $(element).attr('type')
					when 'email' 
						return new HTML5Form.EmailFormField(element)
					when 'tel' 
						return new HTML5Form.TelFormField(element)
					when 'url' 
						return new HTML5Form.UrlFormField(element)
					when 'checkbox' 
						return new HTML5Form.CheckboxFormField(element)
					else
						return new HTML5Form.TextFormField(element)
		
		@each ()->
			form = $(this);
			fields = []
			errors = [];
			form.find('textarea, select, input:not(:submit,:button,:image)').each () ->
				fields.push formFieldFactory( this )
			checkInputFields = () =>
				errors = []
				for field in fields 
					if not field.validate() then errors.push(field)

			# on submit, validate all the fields
			for input in form.find('input:submit, input:image, input:button')
				$(input).click (event) => 
					errors = checkInputFields()
					if not errors.length
						true
					else 
						event.preventDefault()
						form.trigger('error', errors)
						false


$().ready () ->
	$('form').html5FormValidator()
