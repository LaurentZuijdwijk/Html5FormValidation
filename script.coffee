
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
			if @textFormField.$element.originalVal() == @placeholder()
				@textFormField.element.value = ''
				@textFormField.$element.removeClass('placeholder')
		blur : () =>
			if @textFormField.$element.originalVal() == ''
				@textFormField.element.value = @placeholder()
				@textFormField.$element.addClass('placeholder')

	@FormField = class FormField
		required : false
		constructor : (@element, @form) ->
			@$form = $(form)
			@$element = $(@element)
			if @$element.attr('autofocus') then @$element.focus();
		validate : -> 
			validate = @_validate()
			if not validate then @$element.addClass 'invalid'
			validate
		fieldErrorEvent : ->
			feevent = jQuery.Event("fieldError");
			feevent.field = @$element;
			@$form.trigger(feevent);

		_validate : -> true


	@TextFormField = class TextFormField extends HTML5Form.FormField
		pattern : null
		constructor : (@element, @form) ->
			@$element = $(@element)
			if @$element.attr('placeholder') then new HTML5Form.FormPlaceholderDecorator(@)
			@$element.bind('focus', @focus)
			@$element.bind('blur', @blur)
			super(@element, @form)
		focus : (event) => 
			@$element.removeClass 'invalid'
		blur  : (event) => 
			if not @_validate() 
				@fieldErrorEvent()
				@$element.addClass 'invalid'
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

	@DateFormField = class DateFormField extends HTML5Form.TextFormField
		constructor : (@element,@form) ->
			super(@element, @form)
			if @$element.datepicker
				$newEl = @element.toString()

				console.log $newEl 
				@$element.datepicker()

	@NumberFormField : class NumberFormField extends HTML5Form.FormField
		constructor : (@element,@form) ->
			super(@element, @form)
			if @$element.slider
				min = @$element.attr('min') || 0
				max = @$element.attr('max') || 10
				value = @$element.attr('value') || min
				step = @$element.attr('step') || 1
				@element.value = value
				@slider = $ '<div class="slider" style="width:100px;display:inline-block"></div>'
				@res = $ '<span class="res">'+value+'</span>'
				@$element.after @slider
				@slider.after @res
				@$element.hide()
				@slider.slider(
					range: "min",
					value: Number(value),
					step: Number(step),
					min: Number(min),
					max: Number(max),
					slide: (event, ui) => 
						@element.value = Number(@slider.slider("value"))
						@res.text @slider.slider("value")
				)

	@SelectFormField = class SelectFormField extends HTML5Form.FormField
		constructor : (@element,@form) ->
			super(@element, @form)
			@$element.bind('focus', @focus)
			@$element.bind('blur', @blur)
		focus : (event) => 
			@$element.removeClass 'invalid'
		blur  : (event) => 
			if not @_validate() 
				@fieldErrorEvent()
				@$element.addClass 'invalid'
		_validate : -> 
			@val = @$element.val()
			if @$element.attr('required') and @val.length == 0 then return false
			true

	@CheckboxFormField = class CheckboxFormField extends HTML5Form.FormField
		@names : []
		constructor : (@element, @form) ->
			super(@element, @form)
			@name = @$element.attr('name')
			for name in HTML5Form.CheckboxFormField.names
				if(@name == name) 

					return {validate: -> true}
			HTML5Form.CheckboxFormField.names.push(@$element.attr('name'))
		validate : ->
			if $('form input[name='	+@name+']:checked').length > 0 then return true
			false

	@TextAreaFormField = class TextAreaFormField extends HTML5Form.TextFormField

$.fn.originalVal = $.fn.val
$.fn.val = (val) ->
	if val then $.fn.originalVal(val)
	else
		$this = $(this)
		val = $this.originalVal()
		if $this.attr('placeholder') is val then val = ''
		val


$.fn.html5FormValidator = () ->
	# Default settings
		html5form = new HTML5Form()
		formFieldFactory = (element, form) ->
			if element.tagName.toUpperCase() is 'SELECT'
				return new HTML5Form.SelectFormField(element, form)
			else if element.tagName.toUpperCase() is 'TEXTAREA'
				return new HTML5Form.TextAreaFormField(element, form)
			else	
				console.log $(element).attr('type')
				switch $(element).attr('type')
					when 'email' 
						return new HTML5Form.EmailFormField(element, form)
					when 'tel' 
						return new HTML5Form.TelFormField(element, form)
					when 'url' 
						return new HTML5Form.UrlFormField(element, form)
					when 'checkbox' 
						return new HTML5Form.CheckboxFormField(element, form) 
					when 'date' 
						return new HTML5Form.DateFormField(element, form)
					when 'number' 
						return new HTML5Form.NumberFormField(element, form)

					else
						return new HTML5Form.TextFormField(element, form)
		
		@each ()->
			$form = $(this);
			form = this
			fields = []
			errors = [];
			$form.find('textarea, select, input:not(:submit,:button,:image)').each () ->
				fields.push formFieldFactory( this, form )
			checkInputFields = () =>
				errors = []
				for field in fields
					if not field.validate()
						errors.push(field.element)
				errors
			# on submit, validate all the fields
			for input in $form.find('input:submit, input:image, input:button')
				$(input).click (event) => 
					errors = checkInputFields()
					if not errors.length
						true
					else 
						event.preventDefault()
						feevent = jQuery.Event("formError");
						feevent.fields = errors;
						$form.trigger(feevent);
						false

