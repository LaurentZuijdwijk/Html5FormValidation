
describe("FormField test", function() {
  var formField;
  var textFormField, emailFormField, telFormField
  
  beforeEach(function() {
    formField = new HTML5Form.FormField();
    input = document.createElement('input')
    input.value = ''
  });
  it("jQuery val() test", function() {  
    input.value = 'test'
    expect($(input).val()).toBe('test')
    expect($(input).originalVal()).toBe('test')
    input.placeholder = 'test'
    expect($(input).val()).toBe('')

  });
  it("Abstract class test", function() {
    expect(formField.validate()).not.toBeFalsy()
    expect(formField.required).toBeFalsy()
  });
  it("text class validation", function() {
    textFormField = new HTML5Form.TextFormField(input);
    expect(textFormField.element).not.toBeUndefined();
    expect(textFormField.validate()).not.toBeFalsy();
    input.setAttribute('required','required')
    expect(textFormField.validate()).toBeFalsy();
    input.value = 'test@example.com'
    expect(textFormField.validate()).not.toBeFalsy();

  });
  it("email class validation", function() {
    emailFormField = new HTML5Form.EmailFormField(input);
    expect(emailFormField.element).not.toBeUndefined();
    expect(emailFormField.validate()).not.toBeFalsy();
    input.value = 'test@example.com'
    expect(emailFormField.validate()).not.toBeFalsy();
    input.value = 'not Valid_example.com'
    expect(emailFormField.validate()).toBeFalsy();
    input.setAttribute('required','required')
    expect(emailFormField.validate()).toBeFalsy();
    input.value = ''
    expect(emailFormField.validate()).toBeFalsy();
  });
  it("custom pattern validation", function() {
    textFormField = new HTML5Form.TextFormField(input);
    input.setAttribute('pattern','^[a-z]+$')
    input.value = 'testfe@efcom'
    expect(textFormField.validate()).toBeFalsy();
    input.value = 'testfeefcom'
    expect(textFormField.validate()).not.toBeFalsy();
  })


  describe("Select ", function() {
    var formField, input, option
    beforeEach(function() {
      input = document.createElement('select')
      formField = new HTML5Form.SelectFormField(input);
      var option = document.createElement('option')
      input.appendChild(option)
      
      option = document.createElement('option')
      option.value = 'myValue'
      input.appendChild(option)

      var option = document.createElement('option')
      option.value = 'myValue2'
      input.appendChild(option)


    });
    it("Select test", function() {
      expect(formField.validate()).not.toBeFalsy()
      expect(formField.required).toBeFalsy()
    });
  });

});