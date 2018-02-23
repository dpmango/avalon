$(document).ready(function(){

    ////////////////
    // FORM VALIDATIONS
    ////////////////



    $.validator.addMethod("regexp", function (value, element) {
        return this.optional(element) || /^\+\d \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value);
    });

    
    var validateCounter = function () {
        var errorCount = $('.js-validate').find('.is-error').length;

        if(errorCount > 0) {
            $('.js-validate').addClass('is-invalid');
        }
        else {
            $('.js-validate').removeClass('is-invalid');
        }
      
    }


    var validateHighlight = function(element) {
        $(element).addClass("is-error");

        validateCounter();
    }
    var validateUnhighlight = function(element) {
        $(element).removeClass("is-error");

        validateCounter();
       
    }


    $('.js-validate').validate({
        errorClass: 'is-error',
        ignore: ":disabled,:hidden",
        highlight: validateHighlight,
        unhighlight: validateUnhighlight,
        rules: {
            name: {
                required: true
            },
            tel: {
                required: true,
                regexp: true
            },
            email: {
                required: true,
                email: true
            },
            message: {
                required: true
            }

        },
        errorPlacement: function(error,element) {
            return true;
        },
        submitHandler: function(form) {

            $(form).addClass('is-valid');

            setTimeout(function() {

                $('.js-validate').trigger('reset').removeClass('is-valid').find('.ui__group').removeClass('is-focused');


            }, 2000);

            console.log('Отправили!');

            return false;

        }
    });




  // jQuery validate plugin
  // https://jqueryvalidation.org


  // GENERIC FUNCTIONS
  ////////////////////

//   var validateErrorPlacement = function(error, element) {
//     error.addClass('ui-input__validation');
//     error.appendTo(element.parent("div"));
//   }
//   var validateHighlight = function(element) {
//     $(element).parent('div').addClass("has-error");
//   }
//   var validateUnhighlight = function(element) {
//     $(element).parent('div').removeClass("has-error");
//   }
//   var validateSubmitHandler = function(form) {
//     $(form).addClass('loading');
//     $.ajax({
//       type: "POST",
//       url: $(form).attr('action'),
//       data: $(form).serialize(),
//       success: function(response) {
//         $(form).removeClass('loading');
//         var data = $.parseJSON(response);
//         if (data.status == 'success') {
//           // do something I can't test
//         } else {
//             $(form).find('[data-error]').html(data.message).show();
//         }
//       }
//     });
//   }

//   var validatePhone = {
//     required: true,
//     normalizer: function(value) {
//         var PHONE_MASK = '+X (XXX) XXX-XXXX';
//         if (!value || value === PHONE_MASK) {
//             return value;
//         } else {
//             return value.replace(/[^\d]/g, '');
//         }
//     },
//     minlength: 11,
//     digits: true
//   }

//   ////////
//   // FORMS


//   /////////////////////
//   // REGISTRATION FORM
//   ////////////////////
//   $(".js-registration-form").validate({
//     errorPlacement: validateErrorPlacement,
//     highlight: validateHighlight,
//     unhighlight: validateUnhighlight,
//     submitHandler: validateSubmitHandler,
//     rules: {
//       last_name: "required",
//       first_name: "required",
//       email: {
//         required: true,
//         email: true
//       },
//       password: {
//         required: true,
//         minlength: 6,
//       }
//       // phone: validatePhone
//     },
//     messages: {
//       last_name: "Заполните это поле",
//       first_name: "Заполните это поле",
//       email: {
//           required: "Заполните это поле",
//           email: "Email содержит неправильный формат"
//       },
//       password: {
//           required: "Заполните это поле",
//           email: "Пароль мимимум 6 символов"
//       },
//       // phone: {
//       //     required: "Заполните это поле",
//       //     minlength: "Введите корректный телефон"
//       // }
//     }
//   });

});
