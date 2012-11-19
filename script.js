// Generated by CoffeeScript 1.3.3
var HTML5Form,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HTML5Form = (function() {
  "use strict";

  var CheckboxFormField, DateFormField, EmailFormField, FormField, FormPlaceholderDecorator, NumberFormField, SelectFormField, TelFormField, TextAreaFormField, TextFormField, UrlFormField;

  function HTML5Form() {}

  HTML5Form.FormPlaceholderDecorator = FormPlaceholderDecorator = (function() {

    function FormPlaceholderDecorator(textFormField) {
      this.textFormField = textFormField;
      this.blur = __bind(this.blur, this);

      this.focus = __bind(this.focus, this);

      this.textFormField.$element.bind('blur', this.blur);
      this.textFormField.$element.bind('focus', this.focus);
      if (!this.textFormField.$element.val().length > 0) {
        this.textFormField.$element.val(this.placeholder());
        this.textFormField.$element.addClass('placeholder');
      }
    }

    FormPlaceholderDecorator.prototype.placeholder = function() {
      return this.textFormField.$element.attr('placeholder');
    };

    FormPlaceholderDecorator.prototype.focus = function(e) {
      if (this.textFormField.element.value === this.placeholder()) {
        this.textFormField.element.value = '';
      }
      this.textFormField.$element.removeClass('placeholder');
      return true;
    };

    FormPlaceholderDecorator.prototype.blur = function() {
      if (this.textFormField.element.value === '' || this.textFormField.element.value === this.placeholder()) {
        this.textFormField.element.value = this.placeholder();
        this.textFormField.$element.addClass('placeholder');
      }
      return true;
    };

    return FormPlaceholderDecorator;

  })();

  HTML5Form.FormField = FormField = (function() {

    FormField.prototype.required = false;

    function FormField(element, form) {
      this.element = element;
      this.form = form;
      this.$form = $(form);
      this.$element = $(this.element);
      if (this.$element.attr('autofocus')) {
        this.$element.focus();
      }
    }

    FormField.prototype.validate = function() {
      var validate;
      validate = this._validate();
      if (!validate) {
        this.$element.addClass('invalid');
      }
      return validate;
    };

    FormField.prototype.fieldErrorEvent = function() {
      var feevent;
      feevent = jQuery.Event("fieldError");
      feevent.field = this.$element;
      return this.$form.trigger(feevent);
    };

    FormField.prototype._validate = function() {
      return true;
    };

    return FormField;

  })();

  HTML5Form.TextFormField = TextFormField = (function(_super) {

    __extends(TextFormField, _super);

    TextFormField.prototype.pattern = null;

    function TextFormField(element, form) {
      this.element = element;
      this.form = form;
      this.blur = __bind(this.blur, this);

      this.focus = __bind(this.focus, this);

      this.$element = $(this.element);
      if (this.$element.attr('placeholder')) {
        new HTML5Form.FormPlaceholderDecorator(this);
      }
      this.$element.bind('focus', this.focus);
      this.$element.bind('blur', this.blur);
      TextFormField.__super__.constructor.call(this, this.element, this.form);
    }

    TextFormField.prototype.focus = function(event) {
      return this.$element.removeClass('invalid');
    };

    TextFormField.prototype.blur = function(event) {
      console.log('valid', this._validate());
      if (!this._validate()) {
        this.fieldErrorEvent();
        return this.$element.addClass('invalid');
      }
    };

    TextFormField.prototype._validate = function() {
      var _return;
      if (this.$element.attr('pattern')) {
        this.pattern = new RegExp(this.$element.attr('pattern'));
      }
      this.val = this.$element.val();
      _return = true;
      if (this.pattern && this.val.length > 0 && this.val.search(this.pattern) === -1) {
        _return = false;
      } else if (this.$element.attr('required') && this.val.length === 0) {
        _return = false;
      }
      console.log(this.$element.attr('required'), this.val.length);
      return _return;
    };

    return TextFormField;

  })(HTML5Form.FormField);

  HTML5Form.EmailFormField = EmailFormField = (function(_super) {

    __extends(EmailFormField, _super);

    function EmailFormField() {
      return EmailFormField.__super__.constructor.apply(this, arguments);
    }

    EmailFormField.prototype.pattern = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i;

    return EmailFormField;

  })(HTML5Form.TextFormField);

  HTML5Form.TelFormField = TelFormField = (function(_super) {

    __extends(TelFormField, _super);

    function TelFormField() {
      return TelFormField.__super__.constructor.apply(this, arguments);
    }

    TelFormField.prototype.pattern = /^([0-9\(\)\/]*)$/i;

    return TelFormField;

  })(HTML5Form.TextFormField);

  HTML5Form.UrlFormField = UrlFormField = (function(_super) {

    __extends(UrlFormField, _super);

    function UrlFormField() {
      return UrlFormField.__super__.constructor.apply(this, arguments);
    }

    return UrlFormField;

  })(HTML5Form.TextFormField);

  HTML5Form.DateFormField = DateFormField = (function(_super) {

    __extends(DateFormField, _super);

    function DateFormField(element, form) {
      var $newEl;
      this.element = element;
      this.form = form;
      this.$element = $(this.element);
      if (this.$element.datepicker) {
        $newEl = this.$element.clone(true);
        $newEl.attr('type', 'text');
        this.$element.after($newEl);
        this.$element.remove();
        this.$element = $newEl;
        this.element = $newEl[0];
        $newEl.datepicker();
      }
      DateFormField.__super__.constructor.call(this, this.element, this.form);
    }

    return DateFormField;

  })(HTML5Form.TextFormField);

  HTML5Form.NumberFormField = NumberFormField = (function(_super) {

    __extends(NumberFormField, _super);

    function NumberFormField(element, form) {
      var max, min, step, value,
        _this = this;
      this.element = element;
      this.form = form;
      NumberFormField.__super__.constructor.call(this, this.element, this.form);
      if (this.$element.slider) {
        min = this.$element.attr('min') || 0;
        max = this.$element.attr('max') || 10;
        value = this.$element.attr('value') || min;
        step = this.$element.attr('step') || 1;
        this.element.value = value;
        this.slider = $('<div class="slider" style="display:inline-block"></div>');
        this.res = $('<span class="res">' + value + '</span>');
        this.$element.after(this.slider);
        this.slider.after(this.res);
        this.$element.hide();
        this.slider.slider({
          range: "min",
          value: Number(value),
          step: Number(step),
          min: Number(min),
          max: Number(max),
          slide: function(event, ui) {
            _this.element.value = Number(_this.slider.slider("value"));
            return _this.res.text(_this.slider.slider("value"));
          }
        });
      }
    }

    return NumberFormField;

  })(HTML5Form.FormField);

  HTML5Form.SelectFormField = SelectFormField = (function(_super) {

    __extends(SelectFormField, _super);

    function SelectFormField(element, form) {
      this.element = element;
      this.form = form;
      this.blur = __bind(this.blur, this);

      this.focus = __bind(this.focus, this);

      SelectFormField.__super__.constructor.call(this, this.element, this.form);
      this.$element.bind('focus', this.focus);
      this.$element.bind('blur', this.blur);
    }

    SelectFormField.prototype.focus = function(event) {
      return this.$element.removeClass('invalid');
    };

    SelectFormField.prototype.blur = function(event) {
      if (!this._validate()) {
        this.fieldErrorEvent();
        return this.$element.addClass('invalid');
      }
    };

    SelectFormField.prototype._validate = function() {
      this.val = this.$element.val();
      if (this.$element.attr('required') && this.val.length === 0) {
        return false;
      }
      return true;
    };

    return SelectFormField;

  })(HTML5Form.FormField);

  HTML5Form.CheckboxFormField = CheckboxFormField = (function(_super) {

    __extends(CheckboxFormField, _super);

    CheckboxFormField.names = [];

    function CheckboxFormField(element, form) {
      var name, _i, _len, _ref;
      this.element = element;
      this.form = form;
      CheckboxFormField.__super__.constructor.call(this, this.element, this.form);
      this.name = this.$element.attr('name');
      _ref = HTML5Form.CheckboxFormField.names;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        if (this.name === name) {
          return {
            validate: function() {
              return true;
            }
          };
        }
      }
      HTML5Form.CheckboxFormField.names.push(this.$element.attr('name'));
    }

    CheckboxFormField.prototype.validate = function() {
      if ($('form input[name=' + this.name + ']:checked').length > 0) {
        return true;
      }
      return false;
    };

    return CheckboxFormField;

  })(HTML5Form.FormField);

  HTML5Form.TextAreaFormField = TextAreaFormField = (function(_super) {

    __extends(TextAreaFormField, _super);

    function TextAreaFormField() {
      return TextAreaFormField.__super__.constructor.apply(this, arguments);
    }

    return TextAreaFormField;

  })(HTML5Form.TextFormField);

  return HTML5Form;

}).call(this);

$.fn.originalVal = $.fn.val;

$.fn.val = function(val) {
  var $this, attr;
  if (val) {
    return $.fn.originalVal.call(this, val);
  } else {
    $this = $(this);
    val = $this.originalVal.call(this);
    attr = $this.attr('placeholder');
    if (!typeof attr === 'undefined' || !attr === false && attr === val) {
      val = '';
    }
    return val;
  }
};

$.fn.html5FormValidator = function() {
  var formFieldFactory, html5form;
  html5form = new HTML5Form();
  formFieldFactory = function(element, form) {
    if (element.tagName.toUpperCase() === 'SELECT') {
      return new HTML5Form.SelectFormField(element, form);
    } else if (element.tagName.toUpperCase() === 'TEXTAREA') {
      return new HTML5Form.TextAreaFormField(element, form);
    } else {
      switch ($(element).attr('type')) {
        case 'email':
          return new HTML5Form.EmailFormField(element, form);
        case 'tel':
          return new HTML5Form.TelFormField(element, form);
        case 'url':
          return new HTML5Form.UrlFormField(element, form);
        case 'checkbox':
          return new HTML5Form.CheckboxFormField(element, form);
        case 'date':
          return new HTML5Form.DateFormField(element, form);
        case 'number':
          return new HTML5Form.NumberFormField(element, form);
        default:
          return new HTML5Form.TextFormField(element, form);
      }
    }
  };
  return this.each(function() {
    var $form, checkInputFields, errors, fields, form, input, _i, _len, _ref, _results,
      _this = this;
    $form = $(this);
    form = this;
    fields = [];
    errors = [];
    $form.find('textarea, select, input:not(:submit,:button,:image)').each(function() {
      return fields.push(formFieldFactory(this, form));
    });
    checkInputFields = function() {
      var field, _i, _len;
      errors = [];
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        if (!field.validate()) {
          errors.push(field.element);
        }
      }
      return errors;
    };
    _ref = $form.find('input:submit, input:image, input:button');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input = _ref[_i];
      _results.push($(input).click(function(event) {
        var feevent;
        errors = checkInputFields();
        if (!errors.length) {
          return true;
        } else {
          event.preventDefault();
          feevent = jQuery.Event("formError");
          feevent.fields = errors;
          $form.trigger(feevent);
          return false;
        }
      }));
    }
    return _results;
  });
};
