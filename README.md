Html5FormValidation
===================

A small (4.9KB minified), unobstrusive Javascript library to add support for HTML5 forms to most browser.

I aimed to make an easy to use form validation plugin, which will work in any browser and any circumstance. It is easy to use and will conform to the HTML5 spec.

If you need a lightweight and unobtrusive plugin to make your forms behave, this might be good for you.

API status
----------

Alpha. API's are likely to change.

Test coverage
-------------

Test coverage is approx. 50%.

Features
--------

HTML5FormValidation supports the following input types:

* input:text
* input:email
* input:url
* input:tel
* input:checkbox
* input:date
* input:number
* input:range
* textarea
* select

The following attributes are supported:

* required
* pattern
* placeholder
* min (for number and range elements)
* max (for number and range elements)
* step (for number and range elements)

Two event types are fired when a validation error occurs. A 'fieldError' on blur and a 'formError' on a failed submit. 

Have a look at the 'how to use' and examples for more information.

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

	$('form').html5form().bind('formError', function(e){});
	$('form').html5form().bind('fieldError', function(e){});

Examples
--------

Have a look in the examples folder.

Let's set up a simple example form.

	<form method="post" action="/" novalidate>
		<label for="name">Name:</label>
		<input type="text" placeholder="Your name" name="name" required title="Please enter your name." />
		<label for="email">Email:</label>
		<input type="email" placeholder="Your email" name="email" required title="Please enter your email." />
		<label for="url">Website:</label>
		<input type="url" name="url" placeholder="http://www.mywebsite.net" title="Please enter the url to your website." />
		<label for="message">Message:</label>
		<textarea name="massage" required title="Please enter your message"></textarea>
		<input type="submit" value="submit" />
	</form>
	<div id="errors"></div>
Simple initialization:

	$('form').html5form();

To display errors when they are encountered:
	
	$('form').bind('formError', function(e){
		$('#errors').html('')
		var html = ''
		$(e.fields).each(function(){
			html += $(this).attr('title') + '<br />';
		})
		$('#errors').html(html)
	})


Requirements
------------

jQuery is currently required.



