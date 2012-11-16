Html5FormValidation
===================

A complete cross-browser form validation script, either stand-alone, or as a JQuery plugin.

I aimed to make an easy to use form validation plugin, which will work in any browser and any circumstance. It is easy to use and will conform to the HTML5 spec.

If you need a lightweight and unobtrusive plugin to make your forms behave, this might be good for you.

Test coverage
-------------

Test coverage is approx. 50%.

Features
--------

HTML5FormValidation support for the following input types:

* input:text
* input:email
* input:url
* input:tel
* input:checkbox
* textarea
* select

Support for the following attributes is added.

* required
* pattern
* placeholder

How to use
----------

To use the jQuery plugin, simply add the following code on page load:

	$('form').html5form();

Add invalid and placeholder classes to your CSS to give your user feedback on what is happening. Find an example below.

	input.invalid, textarea.invalid, select.invalid{
		border:1px solid red
	}
	input.placeholder{
		color:#ccc
	}

If there are errors in the form, the form will not submit. If you want to give your users additional feedback, just listen to the error handler on your form.

	$('form').html5form().bind('error', function(e){});


Requirements
------------

jQuery is currently required.



