$(document).ready(function() {

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  var easingSwing = [.02, .01, .47, 1]; // default jQuery easing for anime.js

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  function pageReady() {
    legacySupport();
    // updateHeaderActiveClass();

    headerMonitor();
    _window.on('scroll', throttle(headerMonitor, 10))

    initPopups();
    initSliders();
    initMasks();
    initReadmore();
    matchHeight();
    _window.on('resize', debounce(matchHeightFix, 200));

    initScrollMonitor();
    initLazyLoad();
    initMap();

    revealFooter();
    _window.on('resize', throttle(revealFooter, 100));

    // development helper's
    _window.on('resize', debounce(setBreakpoint, 200))
    pixelPerfect();
    // _window.on('resize', debounce(pixelPerfect, 200))
  }

  // this is a master function which should have all functionality
  pageReady();


  ///////////////////
  // DETECTORS
  ///////////////////

  function isRetinaDisplay() {
    if (window.matchMedia) {
      var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
      return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  var _mobileDevice = isMobile();
  // detect mobile devices
  function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
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

  if (msieversion()) {
    $('body').addClass('is-ie');
  }

  //////////
  // COMMON
  //////////

  function legacySupport() {
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: true,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }

  // Prevent # behavior
  _document
    .on('click', '[href="#"]', function(e) {
      e.preventDefault();
    })
    .on('click', 'a[href^="#section"]', function() { // section scroll
      var el = $(this).attr('href');
      $('body, html').animate({
        scrollTop: $(el).offset().top
      }, 1000);
      return false;
    })


  //////////
  // HEADER MONITOR
  //////////
  function headerMonitor() {
    var offset = 0;
    var offsetScroll = _window.scrollTop();

    if (offsetScroll > offset) {
      $('html').addClass('is-headerFixed');
    } else {
      $('html').removeClass('is-headerFixed');
    }
  }

  // Navigation
  _document
    .on('click', '.js-nav-trigger', function(event) {
      event.preventDefault();
      if ($('html').is('.is-navOpen')) {
        $('html').removeClass('is-navOpen');
        $('.js-nav-collapse').slideUp('fast');
      } else {
        $('html').addClass('is-navOpen');
        $('.js-nav-collapse').slideDown('fast')
      }
    })
    .on('click', function(e) {
      if ($(e.target).closest('.nav, .btn--nav').length == 0) {
        $('html').removeClass('is-navOpen');
        $('.js-nav-collapse').slideUp('fast');
      }
    })


  //////////
  // SEARCH
  //////////

  // Search :: Open
  _document.on('click', '.js-search-open', function(event) {
    event.preventDefault();

    if ($('html').is('.is-search-open')) {
      $('html').removeClass('is-search-open');
    } else {
      $('html').addClass('is-search-open');
      $('.js-search-input').focus();
    }
  });

  // Search :: Clear
  _document.on('click', '.js-search-clear', function(event) {
    event.preventDefault();
    $('.js-search').find('form').trigger('reset');
    $('html').removeClass('is-search-keyup is-search-found is-search-notfound');
  });

  // Search :: Focusout
  _document.on('click', function(e) {
    if ($(e.target).closest('.js-search').length == 0) {
      $('html').removeClass('is-search-open is-search-keyup is-search-found is-search-notfound')
    }
  });

  // Search :: Keyup

  $('.js-search-input').on('input', function(event) {

    var searchValue = this.value.toLowerCase(),
      searchLength = this.value.length;

    if (searchLength >= 1) {

      // Keyup

      $('html').addClass('is-search-keyup');

      // Progress

      $('.js-search-progress').width(0).stop().animate({
          width: '100%'
        }, 1000, function() {

          $('.js-search-progress').width(0);

          // Results Start

          $('.search__item-name').each(function() {

            var name = $(this).text(),
              nameL = name.toLowerCase(),
              nameReplace = '<mark>' + name.substr(0, searchLength) + '</mark>' + name.substr(searchLength);

            if (nameL.indexOf(searchValue) == 0) {
              $(this).html(nameReplace).closest('li').addClass('is-visible');
            } else {
              $(this).html(nameReplace).closest('li').removeClass('is-visible');
            }

            var elLength = $('.search__item-name').closest('li').length,
              elLengthVisible = $('.search__item-name').closest('li.is-visible').length;

            if (elLengthVisible == 0) {
              $('html').removeClass('is-search-found').addClass('is-search-notfound');
            } else {
              $('html').removeClass('is-search-notfound').addClass('is-search-found');
            }
          });
        });
    } else {
      // Keyup Reset
      $('html').removeClass('is-search-keyup is-search-found is-search-notfound');

      // Progress Reset
      $('.js-search-progress').stop().width(0);
    }

  });


  //////////
  // CATALOG
  //////////

  _document.on('click', '.catalog__sorting-btn', function(event) {
    event.preventDefault();
    if ($('html').is('.is-sorting-open')) {
      $('html').removeClass('is-sorting-open');
    } else {
      $('html').addClass('is-sorting-open');
    }
  });

  _document.on('change', '[name=sorting]', function(event) {
    $('html').removeClass('is-sorting-open');
    var sortingType = $(this).val();
    $('.catalog__sorting-selected').text(sortingType);
  });


  _document.on('click', '.js-filter-trigger', function(event) {
    event.preventDefault();
    if ($('html').is('.is-filter-open')) {
      $('html').removeClass('is-filter-open');
    } else {
      $('html').addClass('is-filter-open');
    }
  });

  _document.on('mouseenter', '.js-categories-trigger', function(){
    $('html').addClass('is-categories-open')
  })

  _document.on('mouseleave', '.js-categories-trigger', function(){
    $('html').removeClass('is-categories-open')
  })

  _document.on('click', '.js-categories-trigger', function(event) {
    event.preventDefault();
    if ($('html').is('.is-categories-open-fixed')) {
      $('html').removeClass('is-categories-open-fixed');
    } else {
      $('html').addClass('is-categories-open-fixed');
    }
  });

  _document.on('click', function(e) {
    if ($(e.target).closest('.catalog__categories, .js-categories-trigger').length == 0) {
      $('html').removeClass('is-categories-open')
    }
  });

  _document.on('click', function(e) {
    if ($(e.target).closest('.catalog__sorting').length == 0) {
      $('html').removeClass('is-sorting-open')
    }
  });

  _document.on('click', '[js-showAllCheckboxes]', function(e) {
    var textToggler = $(this).is('.is-opened') ? $(this).data('text-more') : $(this).data('text-less')

    $(this).toggleClass('is-opened');
    $('[js-hiddenCheckboxes]').slideToggle();
    $(this).find('.btn').text(textToggler);

    e.preventDefault();
  })

  // Label
  $('.ui__input, .ui__textarea').on('focus blur', function(e) {
    $(this).parents('.ui__group').toggleClass('is-focused', (e.type === 'focus' || this.value.length > 0));
  }).trigger('blur');


  //////////
  // SKU
  //////////

  _document.on('click', '.js-sku-trigger', function(event) {
    event.preventDefault();
    if ($('html').is('.is-sku-open')) {
      $('html').removeClass('is-sku-open');
    } else {
      $('html').addClass('is-sku-open');
    }
  });

  //////////
  // READMORE
  //////////
  function initReadmore(){
    $('.js-readmore').readmore({
      speed: 75,
      moreLink: '<a href="#" class="btn btn--collapse">развернуть текст</a>',
      lessLink: '<a href="#" class="btn btn--collapse">свернуть текст</a>'
    });
  }

  //////////
  // MATCHHEIGHT
  //////////
  $.fn.matchHeight._throttle = 200;

  function matchHeight(){

    $('.product').closest('[class^="col"]').matchHeight({
      byRow: true,
      property: 'height',
      target: $('.product'),
      remove: false
    });

    matchHeightFix();

    // $.fn.matchHeight._update()
  }

  function matchHeightFix(){
    $('.product').each(function(i, product){
      var closestRow = $(product).closest('[class^="col"]')

      closestRow.css({
        'margin-bottom': $(product).css('margin-bottom')
      })
    })

  }

  //////////
  // FOOTER REVEAL
  //////////

  function revealFooter() {
    var footer = $('[js-reveal-footer]');
    if (footer.length > 0) {
      var footerHeight = footer.outerHeight();
      var maxHeight = _window.height() - footerHeight > 100;
      if (maxHeight && !msieversion()) {
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

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering when header is inside barba-container
  function updateHeaderActiveClass() {
    $('.header__menu li').each(function(i, val) {
      if ($(val).find('a').attr('href') == window.location.pathname.split('/').pop()) {
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }

  //////////
  // SLIDERS
  //////////

  function initSliders() {
    var slidesPrev = '<button class="slick-arrow slick-prev"><svg class="ico ico-prev"><use xlink:href="img/sprite.svg#ico-prev"></use></svg></button>',
      slidesNext = '<button class="slick-arrow slick-next"><svg class="ico ico-next"><use xlink:href="img/sprite.svg#ico-next"></use></svg></button>';

    $('.js-slides-fade').slick({
      fade: true,
      dots: false,
      arrows: false,
      asNavFor: '.js-slides-h, .js-slides-v',
      cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      mobileFirst: true,
      responsive: [{
        breakpoint: 1200,
        settings: {
          arrows: false,
          dots: true
        }
      }]
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
      responsive: [{
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
      responsive: [{
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
      responsive: [{
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
      responsive: [{
        breakpoint: 767,
        settings: {
          slidesToShow: 5
        }
      }]
    });

  }

  //////////
  // MODALS
  //////////

  function initPopups() {
    // Magnific Popup
    var startWindowScroll = 0;
    $('[js-popup]').magnificPopup({
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
          startWindowScroll = _window.scrollTop();
          // $('html').addClass('mfp-helper');
        },
        close: function() {
          // $('html').removeClass('mfp-helper');
          _window.scrollTop(startWindowScroll);
        }
      }
    });

    $('[js-popup-gallery]').magnificPopup({
      delegate: 'a',
      type: 'image',
      tLoading: 'Загрузка #%curr%...',
      mainClass: 'popup-buble',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1]
      },
      image: {
        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
      }
    });
  }

  function closeMfp() {
    $.magnificPopup.close();
  }


  ////////////
  // UI
  ////////////

  // textarea autoExpand
  // _document
  //   .one('focus.autoExpand', '.ui__textarea', function() {
  //     var savedValue = this.value;
  //     this.value = '';
  //     this.baseScrollHeight = this.scrollHeight;
  //     this.value = savedValue;
  //   })
  //   .on('input.autoExpand', '.ui__textarea', function() {
  //     var minRows = this.getAttribute('data-min-rows') | 0,
  //       rows;
  //     this.rows = minRows;
  //     rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 12);
  //     this.rows = minRows + rows;
  //   });

  // Masked input
  function initMasks() {
    $(".js-dateMask").mask("99.99.99", {
      placeholder: "ДД.ММ.ГГ"
    });
    $("input[type='tel']").mask("+7 (000) 000-00-00");
  }

  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor() {
    $('.wow').each(function(i, el) {

      var elWatcher = scrollMonitor.create($(el));

      var delay;
      if ($(window).width() < 768) {
        delay = 0
      } else {
        delay = $(el).data('animation-delay');
      }

      var animationClass = $(el).data('animation-class') || "wowFadeUp"

      var animationName = $(el).data('animation-name') || "wowFade"

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

  //////////
  // LAZY LOAD
  //////////
  function initLazyLoad() {
    _document.find('[js-lazy]').Lazy({
      threshold: 500,
      enableThrottle: true,
      throttle: 100,
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      effectTime: 350,
      // visibleOnly: true,
      // placeholder: "data:image/gif;base64,R0lGODlhEALAPQAPzl5uLr9Nrl8e7...",
      onError: function(element) {
        console.log('error loading ' + element.data('src'));
      },
      beforeLoad: function(element) {
        // element.attr('style', '')
      }
    });
  }


  // Barba PJAX

  Barba.Pjax.Dom.containerClass = "page";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      var deferred = Barba.Utils.deferred();

      anime({
        targets: this.oldContainer,
        opacity: .5,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim) {
          deferred.resolve();
        }
      })

      return deferred.promise
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility: 'visible',
        opacity: .5
      });

      anime({
        targets: "html, body",
        scrollTop: 0,
        easing: easingSwing, // swing
        duration: 150
      });

      anime({
        targets: this.newContainer,
        opacity: 1,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim) {
          triggerBody()
          _this.done();
        }
      });
    }
  });

  // set barba transition
  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {
    var response = newPageRawHTML.replace(/(<\/?)body( .+?)?>/gi, '$1notbody$2>', newPageRawHTML);
    var bodyClasses = $(response).filter('notbody').attr('class');
    $('html').removeClass();
    $('body').attr('class', bodyClasses);

    pageReady();

  });

  // some plugins get bindings onNewPage only that way
  function triggerBody() {
    $(window).scroll();
    $(window).resize();
  }


  //////////
  // MAP
  //////////
  function initMap() {
    if ($('#contacts__map').length) {

      var map = new google.maps.Map(document.getElementById('contacts__map'), {
        center: {
          lat: 54.3181598,
          lng: 48.3837915
        },
        zoom: 4,
        disableDefaultUI: true,
        styles: [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{
              "color": "#636363"
            }]
          },
          {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{
              "color": "#fffcf2"
            }]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
              "color": "#aad3e6"
            }, {
              "visibility": "on"
            }]
          }
        ]
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


  //////////
  // PIXEL PERFECT GRID
  //////////
  function pixelPerfect(){
    var wHost = window.location.host.toLowerCase()
    var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
    if (displayCondition) {
      $('body').addClass('is-dev-env');

      _document
        .on('click', '[js-pixelPerfect]', function(event) {
          var target = $(this).data('target');

          $(this).toggleClass('is-active')
          $(target).siblings().removeClass('is-active')
          $(target).toggleClass('is-active')
        })

        .on('click', '[js-pixelPerfectInvert]', function(event) {
          $(this).toggleClass('is-active')
          $('body').toggleClass('grid-inverted');
        })

    }
  }


  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint() {
    var wHost = window.location.host.toLowerCase()
    var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
    if (displayCondition) {
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>" + wWidth + "</div>";

      $('.page').append(content);
      setTimeout(function() {
        $('.dev-bp-debug').fadeOut();
      }, 1000);
      setTimeout(function() {
        $('.dev-bp-debug').remove();
      }, 1500)
    }
  }


  // Sticky
  $('.js-sticky').each(function(i, sticky){
    var
      $el, elHeight, parent, parentDimensions, wHeight,
      scrollPastBottom, scrollStart, scrollEnd, pastScroll = 0

    function stickyParse(){
      // general selectors and params get's cached
      $el = $(sticky);
      elHeight = $el.height();
      parent = $el.parent();
      parentDimensions = {
        'top': parent.offset().top,
        'left': parent.offset().left,
        'height': parent.height(),
        'width': parent.outerWidth()
      }
      wHeight = _window.height();

      // we need parent top offset because $el would be fixed
      scrollStart = Math.floor(parentDimensions.top)
      scrollPastBottom = Math.floor((parentDimensions.top + elHeight) - wHeight)
      scrollEnd = Math.floor(scrollStart + parentDimensions.height - wHeight)
    }


    // stick in parent emulation
    function stickyScroll(){
      // parse scroll and do manupilations based on it
      var wScroll = _window.scrollTop();
      var scrollDirection = pastScroll > wScroll ? 'up' : 'down'

      // debug
      // console.log(
      //   'wScroll', wScroll, scrollDirection,
      //   'scrollStart', scrollStart,
      //   'scrollPastBottom', scrollPastBottom,
      //   'scrollEnd', scrollEnd,
      // )

      // styles object
      var elStyles = {
        'position': "",
        'bottom': "",
        'width': "",
        'margin-top': ""
      }

      // calculate which styles to apply
      if ( wScroll > scrollStart ){
        // element at the top of viewport, start monitoring
        $el.addClass('is-fixed')

        if ( wScroll > scrollPastBottom ){
          // element at the bottom of viewport
          // stick it !
          elStyles.position = "fixed"
          elStyles.bottom = 0
          elStyles.width = parentDimensions.width // prevent fixed/abs jump

          // but monitor END POINT and absolute it
          if ( wScroll > scrollEnd ){
            elStyles.position = "absolute"
            $el.removeClass('is-fixed')
          }
        } else {
          elStyles.position = "static"
        }

      } else {
        $el.removeClass('is-fixed')
      }

      // apply styles
      $el.css(elStyles)

      // required for scroll direction
      pastScroll = wScroll
    }

    // event bindings

    stickyParse();
    stickyScroll();

    _window.on('scroll', throttle(stickyScroll, 5)) // just a minor delay
    _window.on('resize', debounce(stickyParse, 250))

  })

  // $('.js-sticky').stick_in_parent({
  //   offset_top: 0
  // });
  // $('.contacts__map').stick_in_parent({
  //   inner_scrolling: false,
  //   offset_top: 0
  // });
  //
  // _window.on('resize', debounce(function(event) {
  //   $('.js-sticky').trigger("sticky_kit:recalc");
  // },300));



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
