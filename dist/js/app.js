$(document).ready(function(){


    // Barba

    // Barba.Pjax.Dom.containerClass = "barba-container";

    // var FadeTransition = Barba.BaseTransition.extend({
    //     start: function() {
    //         Promise
    //             .all([this.newContainerLoading, this.fadeOut()])
    //             .then(this.fadeIn.bind(this));
    //     },

    //     fadeOut: function() {
    //         return $(this.oldContainer).animate({ opacity: .5 }, 200).promise();
    //     },

    //     fadeIn: function() {

    //         var _this = this;
    //         var $el = $(this.newContainer);

    //         $(this.oldContainer).hide();


    //         $el.css({
    //             visibility : 'visible',
    //             opacity : .5
    //         });

    //         $el.animate({ opacity: 1 }, 200, function() {
    //             document.body.scrollTop = 0;
    //             _this.done();
    //         });



    //     }
    // });

    // Barba.Pjax.getTransition = function() {
    //     return FadeTransition;
    // };

    // Barba.Prefetch.init();

    // Barba.Pjax.start();

    // Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

    //     var response = newPageRawHTML.replace(/(<\/?)body( .+?)?>/gi, '$1notbody$2>', newPageRawHTML);
    //     var bodyClasses = $(response).filter('notbody').attr('class');
    //     $('html').removeClass();
    //     $('body').attr('class', bodyClasses);


    //     init();

    // });

    // Grid

    $('.js-desktop').on('click', function(event) {
        $('#grid-desktop').toggleClass('is-active');
    });

    $('.js-tablet').on('click', function(event) {
        $('#grid-tablet').toggleClass('is-active');
    });

    $('.js-mobile').on('click', function(event) {
        $('#grid-mobile').toggleClass('is-active');
    });



    // --------------------------------------------------------------------------
    // Functions :: Map
    // --------------------------------------------------------------------------


    function initMap() {


        if ($('#contacts__map').length) {

            var map = new google.maps.Map(document.getElementById('contacts__map'), {
                center: { lat: 54.3181598, lng: 48.3837915 },
                zoom: 4,
                disableDefaultUI: true,
                styles: [{
                    "featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#636363"}]},
                    {"featureType":"landscape","elementType":"all","stylers":[{"color":"#fffcf2"}]},
                    {"featureType":"water","elementType":"all","stylers":[{"color":"#aad3e6"},{"visibility":"on"}]}]
            });

            // Москва
            var marker1 = new google.maps.Marker({
                position: new google.maps.LatLng(55.797139, 37.6093601),
                map: map,
                icon: {
                    url: "img/pin.png",
                    scaledSize: new google.maps.Size(44, 60)
                }
            });

            // Санкт-Петербург
            var marker2 = new google.maps.Marker({
                position: new google.maps.LatLng(59.854462, 30.4811287),
                map: map,
                icon: {
                    url: "img/pin.png",
                    scaledSize: new google.maps.Size(44, 60)
                }
            });

            // Астана
            var marker3 = new google.maps.Marker({
                position: new google.maps.LatLng(51.174037, 71.4223829),
                map: map,
                icon: {
                    url: "img/pin.png",
                    scaledSize: new google.maps.Size(44, 60)
                }
            });

        }

    }

    initMap();


    // Header Fixed

    function headerStyle() {
        var offset = 0,
            offsetScroll = $(window).scrollTop();

        if(offsetScroll > offset) {
            $('html').addClass('is-headerFixed');
        }
        else {
            $('html').removeClass('is-headerFixed');
        }
    }

    headerStyle();

    $(window).on('scroll', function(event) {
        headerStyle();
    });


    // Navigation


    $(document).on('click', '.js-nav-trigger', function(event) {
        event.preventDefault();
        if ($('html').is('.is-navOpen')) {
            $('html').removeClass('is-navOpen');
            $('.js-nav-collapse').slideUp('fast');
        }
        else {
            $('html').addClass('is-navOpen');
            $('.js-nav-collapse').slideDown('fast')
        }
    });


    $(document).on('click', function(e) {
        if($(e.target).closest('.nav, .btn--nav').length == 0) {
           $('html').removeClass('is-navOpen');
           $('.js-nav-collapse').slideUp('fast');
        }
    });


    // Search


    // Search :: Open
    $(document).on('click', '.js-search-open', function(event) {
        event.preventDefault();

        if ($('html').is('.is-search-open')) {
            $('html').removeClass('is-search-open');
        }
        else {
            $('html').addClass('is-search-open');
            $('.js-search-input').focus();
        }
    });

    // Search :: Clear
    $(document).on('click', '.js-search-clear', function(event) {
        event.preventDefault();
        $('.js-search').find('form').trigger('reset');
        $('html').removeClass('is-search-keyup is-search-found is-search-notfound');
    });


    // Search :: Focusout
    $(document).on('click', function(e) {
        if($(e.target).closest('.js-search').length == 0) {
           $('html').removeClass('is-search-open is-search-keyup is-search-found is-search-notfound')
        }
    });




    // Search :: Keyup

    $('.js-search-input').on('input', function(event) {

        var searchValue  = this.value.toLowerCase(),
            searchLength = this.value.length;

            if(searchLength >= 1) {

                // Keyup

                $('html').addClass('is-search-keyup');

                // Progress

                $('.js-search-progress').width(0).stop().animate({
                    width: '100%'
                },
                1000, function() {
                    
                    $('.js-search-progress').width(0);


                    // Results Start

                    $('.search__item-name').each(function () {

                        var name  = $(this).text(),
                            nameL = name.toLowerCase(),
                            nameReplace = '<mark>' + name.substr(0, searchLength) + '</mark>' + name.substr(searchLength);


                        if (nameL.indexOf(searchValue) == 0) {
                            $(this).html(nameReplace).closest('li').addClass('is-visible');
                        }
                        else {
                            $(this).html(nameReplace).closest('li').removeClass('is-visible');
                        }

                        
                        var elLength = $('.search__item-name').closest('li').length,
                            elLengthVisible = $('.search__item-name').closest('li.is-visible').length;


                            if (elLengthVisible == 0) {
                                $('html').removeClass('is-search-found').addClass('is-search-notfound');
                            }
                            else {
                                $('html').removeClass('is-search-notfound').addClass('is-search-found');
                            }
        
                        

                    });

                    // Results End



                });

            }
            else {

                // Keyup Reset

                $('html').removeClass('is-search-keyup is-search-found is-search-notfound');

                // Progress Reset

                $('.js-search-progress').stop().width(0);

            }


    });
   




    // Sticky

    // $('.js-sticky').stick_in_parent({
    //     offset_top: 0
    // });


    // $(window).on('resize', function(event) {
    //    $('.js-sticky').trigger("sticky_kit:recalc");
    // });



    // ScrollMagic

    // var controller = new ScrollMagic.Controller();

    // var scene = new ScrollMagic.Scene({
    //   triggerElement: ".news__grid", // point of execution
    //   duration: $(window).height() - 100, // pin element for the window height - 1
    //   triggerHook: 0, // don't trigger until #pinned-trigger1 hits the top of the viewport
    //   reverse: true // allows the effect to trigger when scrolled in the reverse direction
    // })
    // .setPin(".news__sticky") // the element we want to pin
    // .addTo(controller);



    // Slides


    var slidesPrev = '<button class="slick-arrow slick-prev"><svg class="ico ico-prev"><use xlink:href="img/sprite.svg#ico-prev"></use></svg></button>',
        slidesNext = '<button class="slick-arrow slick-next"><svg class="ico ico-next"><use xlink:href="img/sprite.svg#ico-next"></use></svg></button>';

    $('.js-slides-fade').slick({
        fade: true,
        dots: false,
        arrows: false,
        asNavFor: '.js-slides-h, .js-slides-v',
        cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    arrows: false,
                    dots: true
                }
            }
        ]
    });

   

    $('.js-slides-v').slick({
        // vertical: true,
        fade: true,
        arrows: true,
        swipe: false,
        asNavFor: '.js-slides-fade, .js-slides-h',
        mobileFirst: true,
        cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        nextArrow: slidesPrev,
        prevArrow: slidesNext,
        // adaptiveHeight: true,
        // variableWidth: true,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    arrows: false
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    arrows: false,
                    dots: false
                }
            }
        ]
    });

    $('.js-slides-h').slick({
        arrows: false,
        dots: true,
        asNavFor: '.js-slides-fade, .js-slides-v',
        mobileFirst: true,
        cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        nextArrow: slidesPrev,
        prevArrow: slidesNext,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    arrows: true
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    dots: false,
                    arrows: true
                }
            }
        ]
    });



    $('.js-slides-portfolio').slick({
        fade: true,
        dots: false,
        arrows: true,
        cssEase: 'ease',
        nextArrow: slidesPrev,
        prevArrow: slidesNext
    });


    $('.js-slides-contacts').slick({
        arrows: true,
        dots: true,
        mobileFirst: true,
        cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        nextArrow: slidesPrev,
        prevArrow: slidesNext,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    arrows: true
                }
            },
            {
                breakpoint: 1200,
                settings: 'unslick'
            }
        ]
    });

    // Catalog

    $(document).on('click', '.catalog__sorting-btn', function(event) {
        event.preventDefault();
        if ($('html').is('.is-sorting-open')) {
            $('html').removeClass('is-sorting-open');
        }
        else {
            $('html').addClass('is-sorting-open');
        }
    });

    $(document).on('change', '[name=sorting]', function(event) {
        $('html').removeClass('is-sorting-open');
        var sortingType = $(this).val();
        $('.catalog__sorting-selected').text(sortingType);
    });


    $(document).on('click', '.js-filter-trigger', function(event) {
        event.preventDefault();
        if ($('html').is('.is-filter-open')) {
            $('html').removeClass('is-filter-open');
        }
        else {
            $('html').addClass('is-filter-open');
        }
    });

    $(document).on('click', '.js-categories-trigger', function(event) {
        event.preventDefault();
        if ($('html').is('.is-categories-open')) {
            $('html').removeClass('is-categories-open');
        }
        else {
            $('html').addClass('is-categories-open');
        }
    });


    $(document).on('click', function(e) {
        if($(e.target).closest('.catalog__categories, .js-categories-trigger').length == 0) {
           $('html').removeClass('is-categories-open')
        }
    });

    $(document).on('click', function(e) {
        if($(e.target).closest('.catalog__sorting').length == 0) {
           $('html').removeClass('is-sorting-open')
        }
    });


    $('.product').closest('[class^="col"]').matchHeight({
        byRow: true,
        property: 'height',
        target: null,
        remove: false
    });

    // Readmore


    $('.js-readmore').readmore({
        speed: 75,
        moreLink: '<a href="#" class="btn btn--collapse">развернуть текст</a>',
        lessLink: '<a href="#" class="btn btn--collapse">свернуть текст</a>'
    });


    // Gallery

    $('.js-gallery-slides').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.js-gallery-thumbs'
    });
    $('.js-gallery-thumbs').slick({
        vertical: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.js-gallery-slides',
        arrows: false,
        // dots: true,
        centerMode: false,
        focusOnSelect: true,
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 5
                }
            }
        ]
    });


    // Label

    $('.ui__input, .ui__textarea').on('focus blur', function (e) {
        $(this).parents('.ui__group').toggleClass('is-focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');


    // Sku

    $(document).on('click', '.js-sku-trigger', function(event) {
        event.preventDefault();
        if ($('html').is('.is-sku-open')) {
            $('html').removeClass('is-sku-open');
        }
        else {
            $('html').addClass('is-sku-open');
        }
    });

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  var _mobileDevice = isMobile();
  // detect mobile devices
  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    } else {
      return false
    }
  }

  function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true
    } else {
      return false
    }
  }

  if ( msieversion() ){
    $('body').addClass('is-ie');
  }

  //////////
  // COMMON
  //////////

  // svg support for laggy browsers
  svg4everybody();

  // Viewport units buggyfill
  window.viewportUnitsBuggyfill.init({
    force: true,
    hacks: window.viewportUnitsBuggyfillHacks,
    refreshDebounceWait: 250,
    appendToBody: true
  });


 	// Prevent # behavior
	$('[href="#"]').click(function(e) {
		// e.preventDefault();
	});

	// Smoth scroll
	$('a[href^="#section"]').click( function() {
        var el = $(this).attr('href');
        $('body, html').animate({
            scrollTop: $(el).offset().top}, 1000);
        return false;
	});

  // FOOTER REVEAL
  function revealFooter() {
    var footer = $('[js-reveal-footer]');
    if (footer.length > 0) {
      var footerHeight = footer.outerHeight();
      var maxHeight = _window.height() - footerHeight > 100;
      if (maxHeight && !msieversion() ) {
        $('body').css({
          'margin-bottom': footerHeight
        });
        footer.css({
          'position': 'fixed',
          'z-index': -10
        });
      } else {
        $('body').css({
          'margin-bottom': 0
        });
        footer.css({
          'position': 'static',
          'z-index': 10
        });
      }
    }
  }
  revealFooter();
  _window.resized(100, revealFooter);

  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  // if ( $('.header-static').length == 0 ){
  //   _window.scrolled(10, function() { // scrolled is a constructor for scroll delay listener
  //     var vScroll = _window.scrollTop();
  //     var header = $('.header').not('.header--static');
  //     var headerHeight = header.height();
  //     var heroHeight = $('.hero').outerHeight() - headerHeight;

  //     if ( vScroll > headerHeight ){
  //       header.addClass('header--transformed');
  //     } else {
  //       header.removeClass('header--transformed');
  //     }

  //     if ( vScroll > heroHeight ){
  //       header.addClass('header--fixed');
  //     } else {
  //       header.removeClass('header--fixed');
  //     }
  //   });
  // }

  // // HAMBURGER TOGGLER
  // $('.hamburger').on('click', function(){
  //   $('.hamburger').toggleClass('active');
  //   $('.mobile-navi').toggleClass('active');
  // });

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering
  // user .active for li instead
  $('.header__menu li').each(function(i,val){
    if ( $(val).find('a').attr('href') == window.location.pathname.split('/').pop() ){
      $(val).addClass('active');
    } else {
      $(val).removeClass('active')
    }
  });


  // VIDEO PLAY
  $('.promo-video .icon').on('click', function(){
    $(this).closest('.promo-video').toggleClass('playing');
    $(this).closest('.promo-video').find('iframe').attr("src", $("iframe").attr("src").replace("autoplay=0", "autoplay=1"));
  });


  //////////
  // SLIDERS
  //////////

  $('.trending__wrapper').slick({
    autoplay: true,
    dots: false,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true
  });

  //////////
  // MODALS
  //////////
  // Custom modals
  // $('*[data-modal]').on('click', function(){
  //   // remove all active first
  //   $('.modal').removeClass('opened');
  //
  //   // find by id
  //   var target = $(this).data('modal');
  //   $('#'+target).addClass('opened');
  //
  //   window.location.hash = target;
  // });
  //
  // $('.modal__close').on('click', function(){
  //   $(this).closest('.modal').removeClass('opened');
  //   window.location.hash = "";
  // });
  //
  // // CHECK SAVED STATE
  // if(window.location.hash) {
  //   var hash = window.location.hash.substring(1);
  //   $('#'+hash).addClass('opened');
  // }
  //


  // Magnific Popup
  // var startWindowScroll = 0;
  $('.js-popup').magnificPopup({
    type: 'inline',
    fixedContentPos: true,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'popup-buble',
    callbacks: {
      beforeOpen: function() {
        // startWindowScroll = _window.scrollTop();
        // $('html').addClass('mfp-helper');
      },
      close: function() {
        // $('html').removeClass('mfp-helper');
        // _window.scrollTop(startWindowScroll);
      }
    }
  });

  // $('.popup-gallery').magnificPopup({
	// 	delegate: 'a',
	// 	type: 'image',
	// 	tLoading: 'Loading image #%curr%...',
	// 	mainClass: 'mfp-img-mobile',
	// 	gallery: {
	// 		enabled: true,
	// 		navigateByImgClick: true,
	// 		preload: [0,1]
	// 	},
	// 	image: {
	// 		tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
	// 	}
	// });


  ////////////
  // UI
  ////////////

  // custom selects
  $('.ui-select__visible').on('click', function(e){
    var that = this
    // hide parents
    $(this).parent().parent().parent().find('.ui-select__visible').each(function(i,val){
      if ( !$(val).is($(that)) ){
        $(val).parent().removeClass('active')
      }
    });

    $(this).parent().toggleClass('active');
  });

  $('.ui-select__dropdown span').on('click', function(){
    // parse value and toggle active
    var value = $(this).data('val');
    if (value){
      $(this).siblings().removeClass('active');
      $(this).addClass('active');

      // set visible
      $(this).closest('.ui-select').removeClass('active');
      $(this).closest('.ui-select').find('input').val(value);

      $(this).closest('.ui-select').find('.ui-select__visible span').text(value);
    }

  });

  // handle outside click
  $(document).click(function (e) {
    var container = new Array();
    container.push($('.ui-select'));

    $.each(container, function(key, value) {
        if (!$(value).is(e.target) && $(value).has(e.target).length === 0) {
            $(value).removeClass('active');
        }
    });
  });

  // numeric input
  $('.ui-number span').on('click', function(e){
    var element = $(this).parent().find('input');
    var currentValue = parseInt($(this).parent().find('input').val()) || 0;

    if( $(this).data('action') == 'minus' ){
      if(currentValue <= 1){
        return false;
      }else{
        element.val( currentValue - 1 );
      }
    } else if( $(this).data('action') == 'plus' ){
      if(currentValue >= 99){
        return false;
      } else{
        element.val( currentValue + 1 );
      }
    }
  });

  // Masked input
  $(".js-dateMask").mask("99.99.99",{placeholder:"ДД.ММ.ГГ"});
  $("input[type='tel']").mask("+7 (000) 000-00-00");


  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////

  var monitorActive = false;
  window.runScrollMonitor = function(){
    setTimeout(function(){

      // require
      if ( !monitorActive ){
        monitorActive = true;
        $('.wow').each(function(i, el){

          var elWatcher = scrollMonitor.create( $(el) );

          var delay;
          if ( $(window).width() < 768 ){
            delay = 0
          } else {
            delay = $(el).data('animation-delay');
          }

          var animationClass

          if ( $(el).data('animation-class') ){
            animationClass = $(el).data('animation-class');
          } else {
            animationClass = "wowFadeUp"
          }

          var animationName

          if ( $(el).data('animation-name') ){
            animationName = $(el).data('animation-name');
          } else {
            animationName = "wowFade"
          }

          elWatcher.enterViewport(throttle(function() {
            $(el).addClass(animationClass);
            $(el).css({
              'animation-name': animationName,
              'animation-delay': delay,
              'visibility': 'visible'
            });
          }, 100, {
            'leading': true
          }));
          elWatcher.exitViewport(throttle(function() {
            $(el).removeClass(animationClass);
            $(el).css({
              'animation-name': 'none',
              'animation-delay': 0,
              'visibility': 'hidden'
            });
          }, 100));
        });
      }

    },300);
  }

  runScrollMonitor();

});

// set dalay on scroll event
(function($) {
  var uniqueCntr = 0;
  $.fn.scrolled = function (waitTime, fn) {
    if (typeof waitTime === "function") {
        fn = waitTime;
        waitTime = 50;
    }
    var tag = "scrollTimer" + uniqueCntr++;
    this.scroll(function () {
        var self = $(this);
        var timer = self.data(tag);
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            self.removeData(tag);
            fn.call(self[0]);
        }, waitTime);
        self.data(tag, timer);
    });
  }
})(jQuery);

// set dalay on resize event
(function($) {
  var uniqueCntr = 0;
  $.fn.resized = function (waitTime, fn) {
    if (typeof waitTime === "function") {
        fn = waitTime;
        waitTime = 50;
    }
    var tag = "scrollTimer" + uniqueCntr++;
    this.resize(function () {
        var self = $(this);
        var timer = self.data(tag);
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            self.removeData(tag);
            fn.call(self[0]);
        }, waitTime);
        self.data(tag, timer);
    });
  }
})(jQuery);


// textarea autoExpand
$(document)
  .one('focus.autoExpand', 'textarea.autoExpand', function(){
      var savedValue = this.value;
      this.value = '';
      this.baseScrollHeight = this.scrollHeight;
      this.value = savedValue;
  })
  .on('input.autoExpand', 'textarea.autoExpand', function(){
      var minRows = this.getAttribute('data-min-rows')|0, rows;
      this.rows = minRows;
      rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
      this.rows = minRows + rows;
  });

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
