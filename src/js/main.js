$(document).ready(function(){

    // Grid

    $('.js-toggle').on('click', function(event) {
        $('#grid').toggleClass('is-active');
    });




    // Header

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


    // $('.js-search').on('click', '.js-search-btn', function(event) {
    //     event.preventDefault();
    //     if ($('html').is('.is-searchOpen')) {
    //         $('html').removeClass('is-searchOpen');
    //     }
    //     else {
    //         $('html').addClass('is-searchOpen');
    //         $('.js-search-input').focus();
    //     }
    // });

    $(document).on('click', '.js-search-open', function(event) {
        event.preventDefault();
        $('html').addClass('is-searchOpen');
        $('.js-search-input').focus();
    });

    $(document).on('click', '.js-search-clear', function(event) {
        $('html').removeClass('is-searchOpen');
    });


    $(document).on('click', function(e) {
        if($(e.target).closest('.js-search').length == 0) {
           $('html').removeClass('is-searchOpen');
           // ('.js-search-input').trigger('focusout');
    
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

    // var rellax = new Rellax('.js-rellax', {
    //     speed: -0.2,
    //     center: false,
    //     round: true,
    //     vertical: true,
    //     horizontal: false
    // });


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

    // $('.slides-v__item').matchHeight({
    //     byRow: false,
    //     property: 'height',
    //     target: null,
    //     remove: false
    // }).parent('.js-slides-v')

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
  $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});


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
