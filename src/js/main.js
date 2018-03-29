$(document).ready(function() {

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  var easingSwing = [.02, .01, .47, 1]; // default jQuery easing for anime.js

  // maps settings
  // should be on top
  var map;
  var markers = [];
  var markerDefault = {
    url: "img/pin.png",
    scaledSize: new google.maps.Size(44, 60)
  }
  var markerHover = {
    url: "img/pin_hover.png",
    scaledSize: new google.maps.Size(44, 60)
  }
  var markersCoord = [
    {
      lat: 55.797139,
      lng: 37.6093601,
      marker: markerHover
    },
    {
      lat: 59.854462,
      lng: 30.4811287,
      marker: markerDefault
    },
    {
      lat: 51.174037,
      lng: 71.4223829,
      marker: markerDefault
    }
  ]

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

    matchHeight()
    _window.on('resize', debounce(matchHeight, 200));

    skuOffset();
    _window.on('resize', debounce(skuOffset, 200));

    initScrollMonitor();
    initLazyLoad();
    initMap();
    initTeleport();

    toggleBodyClass();

    // revealFooter();
    // _window.on('resize', throttle(revealFooter, 100));

    // development helper's
    _window.on('resize', debounce(setBreakpoint, 200))
    pixelPerfect();
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
  if ( isMobile() ){
    $('body').addClass('is-mobile');
  }
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

  isChrome ? $('body').addClass('is-chrome') : null

  //////////
  // COMMON
  //////////

  function legacySupport() {
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: false,
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

  function toggleBodyClass(){
    var targetClass = $('.js-toggle-body-class').data('class');

    if ( targetClass ){
      $('body').addClass(targetClass);
    }

  }

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
    closeSearch()
  });

  // Search :: Focusout
  _document.on('click', function(e) {
    if ($(e.target).closest('.js-search').length == 0) {
      $('html').removeClass('is-search-open is-search-keyup is-search-found is-search-notfound')
      closeSearch();
    }
  });

  // Search :: Keyup

  $('.js-search-input').on('input', debounce(function(event) {

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
              // $('html').removeClass('is-search-found').addClass('is-search-notfound');
              $('.search__results').slideUp('fast');
              $('.search__notfind').slideDown('fast');
              $('.search__dropdown').slideDown('fast');
            } else {
              // $('html').removeClass('is-search-notfound').addClass('is-search-found');
              $('.search__results').slideDown('fast');
              $('.search__notfind').slideUp('fast');
              $('.search__dropdown').slideDown('fast');
            }
          });
        });
    } else {
      // Keyup Reset
      $('html').removeClass('is-search-keyup is-search-found is-search-notfound');
      closeSearch();

      // Progress Reset
      $('.js-search-progress').stop().width(0);
    }

  }, 200));

  function closeSearch(){
    $('.search__results').slideUp('fast');
    $('.search__notfind').slideUp('fast');
    $('.search__dropdown').slideUp('fast');
  }

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

  _document.on('mouseenter', '.js-categories-trigger, .catalog__categories', function(){
    $('html').addClass('is-categories-open')
  })

  _document.on('mouseleave', '.js-categories-trigger, .catalog__categories', function(){
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
      $('html').removeClass('is-categories-open-fixed');
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

  _document.on('click', '.btn--load', function(){
    var _btn = $(this)
    _btn.addClass('is-loading');

    // some fancy ajax staff here

    setTimeout(function(){
      _btn.removeClass('is-loading');
    }, 1500)
  })

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

  function matchHeight(){
    _document.find('.product').each(function(i, product){
      var desc = $(product).find('.product__desc');
      var descHeight = 0;
      desc.find('li').each(function(i, li){
        descHeight = descHeight + $(li).height();
      })
      var boxOffset = 40;
      if ( _window.width() < 768 ){
        boxOffset = 30
      }
      var calcHeight =
        Math.abs(parseInt($(desc).css('top')))
        + $(product).find('.product__image').outerHeight()
        + parseInt($(product).find('.product__image').css('margin-bottom'))
        + $(product).find('.product__title').height()
        + $(product).find('.product__price').height()
        + 22

      desc.css({
        'padding-top': calcHeight,
        'bottom': '-' + ((boxOffset * 2) + descHeight) + 'px'
      })
    })
  }

  // catch ajax
  function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
      XMLHttpRequest.callbacks.push( callback );
    } else {
      XMLHttpRequest.callbacks = [callback];
      oldSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function(){
        for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
          XMLHttpRequest.callbacks[i]( this );
        }
        oldSend.apply(this, arguments);
      }
    }
  }

  addXMLRequestCallback( function( xhr ) {
    matchHeight();
  });



  //////////
  // SKU OFFSET
  //////////
  function skuOffset(){
    var el = $('.sku-info');
    var target = $('.sku-info__text div:nth-child(2)');
    if ( el.length > 0 && target.length > 0 ){
      var elPosL = el.offset().left
      var targetPosL = target.offset().left + parseInt(target.css('paddingLeft').slice(0, -1))
      var diffInPx = Math.abs(targetPosL - elPosL)
      console.log(elPosL, targetPosL, diffInPx)

      el.css({
        'padding-left': Math.floor(diffInPx)
      })
    }
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

    // control removing class for animations
    $('.js-slides-v').on('beforeChange', function(event, slick, currentSlide, nextSlide){
      $(slick.$slides[currentSlide]).addClass('slick-removing');
    });
    $('.js-slides-v').on('afterChange', function(event, slick, currentSlide, nextSlide){
      $('.slides-v .slick-slide').removeClass('slick-removing');
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

    var slickContacts = $('.js-slides-contacts')
    var slickContactsOptions = {
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
          breakpoint: 992,
          settings: 'unslick'
        }
      ]
    }

    slickContacts.slick(slickContactsOptions);

    _window.on('resize', debounce(function(e){
      if ( _window.width() > 992 ) {
        if (slickContacts.hasClass('slick-initialized')) {
          slickContacts.slick('unslick');
        }
        return
      }
      if (!slickContacts.hasClass('slick-initialized')) {
        return slickContacts.slick(slickContactsOptions);
      }
    }, 300));

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

      map = new google.maps.Map(document.getElementById('contacts__map'), {
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

      $.each(markersCoord, function(i, coords){
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(coords.lat, coords.lng),
          map: map,
          icon: coords.marker
        });
        markers.push(marker);

        // click handler
        google.maps.event.addListener(marker, 'click', function() {
          changeMapsMarker(null, marker)
        });
      })

    }
  }

  // change marker onclick
  _document
    .on('mouseenter', '.contacts__address', function(){
      var markerId = $(this).data('marker-id') - 1;
      if ( markerId !== undefined ){
        changeMapsMarker(markerId)
      }
    })

  function changeMapsMarker(id, marker){
    if ( id !== null){
    } else if ( marker ){
      id = markers.indexOf(marker) // get id
    }
    var targetMarker = markers[id];

    // maps controls
    if ( targetMarker ){
      // reset all markers first
      $.each(markers, function(i, m){
        m.setIcon(markerDefault)
      });

      targetMarker.setIcon(markerHover) // set target new image

      map.panTo(targetMarker.getPosition());
    }

    // set active class
    var linkedControl = $('.contacts__address[data-marker-id='+ (id + 1) +']');

    console.log(linkedControl)
    if ( linkedControl.length > 0 ){
      $('.contacts__address').removeClass('is-active');
      linkedControl.addClass('is-active');
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
      scrollPastBottom, scrollStart, scrollEnd, pastScroll = 0,
      fixedByMarginTop = 0, fixedByMarginBottom = 0

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

      // envoke scroll
      stickyScroll();
    }


    // stick in parent emulation
    function stickyScroll(){
      // parse scroll and do manupilations based on it
      var wScroll = _window.scrollTop();
      var scrollDirection = pastScroll >= wScroll ? 'up' : 'down'

      if ( _window.width() > 992 ){
        // debug
        // console.log(
        //   'wScroll', wScroll, scrollDirection,
        //   'scrollStart', scrollStart,
        //   'scrollPastBottom', scrollPastBottom,
        //   'scrollEnd', scrollEnd,
        //   'fixedByMarginTop', fixedByMarginTop
        // )

        // styles object
        var elStyles = {
          'position': "",
          'bottom': "",
          'top': "",
          'width': "",
          'marginTop': "",
          'classFixed': ""
        }

        // calculate which styles to apply
        if ( wScroll > scrollStart ){
          // element at the top of viewport, start monitoring
          elStyles.classFixed = "is-fixed"
          elStyles.width = parentDimensions.width // prevent fixed/abs jump

          if ( wScroll > scrollPastBottom ){
            // element at the bottom of viewport
            // stick it !
            elStyles.position = "fixed"
            elStyles.bottom = 0

            // but monitor END POINT and absolute it
            if ( wScroll > scrollEnd ){
              elStyles.position = "absolute"
              elStyles.classFixed = ""
            }
          } else {
            elStyles.position = "static"
          }

          // make scrollable to the up dir
          if (scrollDirection == "up" && wScroll < scrollEnd) {

            // if fixed is zero - than it's a first time
            if ( fixedByMarginTop == 0 ){

              fixedByMarginTop = pastScroll // store the point when it's fixed with margin

            } else {
              // fixedByMarginTop = pastScroll
            }

            // if momentum is kept
            if ( wScroll < fixedByMarginTop){
              elStyles.position = "static"
              elStyles.marginTop = ( fixedByMarginTop + wHeight ) - scrollStart - elHeight
            } else {
              // momentum is broken
            }

            if ( wScroll < fixedByMarginTop - (elHeight - wHeight) ){
              // scrolled all with margin fixed
              // stick to top
              elStyles.position = "fixed"
              elStyles.top = 0
              elStyles.marginTop = 0
              elStyles.bottom = "auto"
            }

          } else if ( scrollDirection == "down" ){

          }

        } else {
          // scrilling somewhere above sticky el
          elStyles.classFixed = ""
        }


        // apply styles
        $el.css(elStyles)
        // $el.addClass(elStyles.classFixed)

        // required for scroll direction
        pastScroll = wScroll
      } else {
        $el.attr('style', '')
      }

    }

    // event bindings

    stickyParse();

    _window.on('scroll', throttle(stickyScroll, 5)) // just a minor delay
    _window.on('resize', debounce(stickyParse, 250))

  })

  ////////////
  // TELEPORT PLUGIN
  ////////////
  function initTeleport(){
    $('[js-teleport]').each(function (i, val) {
      var self = $(val)
      var objHtml = $(val).html();
      var target = $('[data-teleport-target=' + $(val).data('teleport-to') + ']');
      var conditionMedia = $(val).data('teleport-condition').substring(1);
      var conditionPosition = $(val).data('teleport-condition').substring(0, 1);

      if (target && objHtml && conditionPosition) {

        function teleport() {
          var condition;

          if (conditionPosition === "<") {
            condition = _window.width() < conditionMedia;
          } else if (conditionPosition === ">") {
            condition = _window.width() > conditionMedia;
          }

          if (condition) {
            target.html(objHtml)
            self.html('')
          } else {
            self.html(objHtml)
            target.html("")
          }
        }

        teleport();
        _window.on('resize', debounce(teleport, 100));


      }
    })
  }

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
