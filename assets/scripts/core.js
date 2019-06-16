'use strict';

/*  ////  --|    Polyfills

    * 
*/

// Object.assign

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

if (typeof Object.assign != 'function') {

  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) {
      // .length of function is 2
      'use strict';

      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
'use strict';

/*  ////  --|    Element.prototype.animateScroll( duration, buffer )

    * Scroll document to element
*/

Element.prototype.animateScroll = function () {
    var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
    var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


    // Update buffer to include height of header
    buffer += document.querySelector('.header').offsetHeight;

    var run = true;

    // Settings
    var start_pos = window.pageYOffset || document.documentElement.scrollTop,
        target_pos = this.getBoundingClientRect().top + start_pos,
        distance = target_pos - start_pos,
        distance = distance - buffer,
        currentTime = 0,
        increment = 16.66;

    // Do the animation
    var animate_scroll = function animate_scroll() {

        if (run === false) return;

        currentTime += increment;

        var val = Math.easeInOutQuad(currentTime, start_pos, distance, duration);

        document.documentElement.scrollTop = document.body.scrollTop = val;

        if (currentTime < duration) {
            setTimeout(animate_scroll, increment);
        }
    };

    // Easing...
    Math.easeInOutQuad = function (t, b, c, d) {

        t /= d / 2;

        if (t < 1) return c / 2 * t * t + b;

        t--;

        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    // Do initial iteration
    animate_scroll();
};
'use strict';

/*  ////  --|    Element.prototype.carousel( settings = Object )

    @since 1.0

    @polyfills: Object.assign
*/

Element.prototype.shiftrCarousel = function () {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    // The default settings
    var defaults = {
        autoplay: true,
        speed: 4000,
        transition: 800,
        show_markers: true,
        pause_on_marker_hover: true
    };

    var i = 0;

    // Assign settings as defaults if settings are not set
    if (Object.keys(settings).length == 0) settings = defaults;

    // Override the defaults with any defined settings
    var _ = Object.assign(defaults, settings);

    // The main carousel elements
    var carousel = this,
        stage = this.children[0],
        props = this.children[0].children;

    // Set the stage hieght based off offsetHeight of first prop
    stage.style.height = props[0].offsetHeight + 'px';

    // Create the navigation
    var stage_map = void 0;
    if (show_markers()) {
        stage_map = document.createElement('div');
        stage_map.classList.add('stage-map');

        carousel.appendChild(stage_map);
    }

    // The pause variable
    var pause_loop = false,
        transition_in_progress = false;

    // Init the Carousel
    for (i = 0; i < props.length; i++) {

        // Main Carousel data
        props[i].dataset.shiftrCarouselProp = i;
        props[i].dataset.shiftrCarouselActive = 'false';

        // Create the markers
        if (show_markers()) {
            var marker = document.createElement('div'),
                inner = document.createElement('span');

            marker.dataset.shiftrCarouselMarker = i;

            // Add marker to navigation element
            marker.appendChild(inner);
            stage_map.appendChild(marker);
        }
    }

    // Assign markers after creation
    var markers = void 0;
    if (show_markers()) {
        markers = Object.keys(stage_map.children).map(function (key) {
            return stage_map.children[key];
        });
    }

    // Set-up first prop and marker
    props[0].classList.add('active');
    props[0].dataset.shiftrCarouselActive = 'true';

    if (show_markers()) {
        markers[0].classList.add('active');
    }

    // Get all elements in the prop
    var images = [];
    for (i = 0; i < props.length; i++) {

        images.push([]);

        var prop_elements = props[i].querySelectorAll('*');

        prop_elements.forEach(function (el) {

            if (el.nodeName == 'IMG') {
                images[i].push(el);
            }
        });
    }

    // Get the first and second prop images
    if (images.length > 0) {
        get_images(images[0]);
    }

    if (images.length > 1) {
        setTimeout(function (e) {
            get_images(images[1]);
        }, _.speed / 2);
    }

    // The main loop
    var the_loop = function the_loop() {

        // Pause on hover
        if (pause_loop) return false;

        // Early exit if transition is in progress
        if (transition_in_progress) return false;

        // Define transition start
        transition_in_progress = true;

        // Get info of active prop
        var active_prop = get_active_prop(),
            active_prop_id = get_active_prop_id(active_prop);

        // Remove active marker
        if (show_markers()) {
            markers[active_prop_id].classList.remove('active');
        }

        // If on the last prop
        if (active_prop_id == props.length - 1) {

            // Set new prop
            props[0].style.zIndex = 150;
            props[0].classList.add('active');
            props[0].dataset.shiftrCarouselActive = 'true';

            if (show_markers()) {
                markers[0].classList.add('active');
            }

            setTimeout(function () {
                props[0].style.zIndex = '';
            }, _.transition);

            // Standard switch
        } else {

            var next_prop = active_prop.nextElementSibling,
                next_prop_id = parseInt(next_prop.dataset.shiftrCarouselProp, 10);

            next_prop.classList.add('active');
            next_prop.dataset.shiftrCarouselActive = 'true';

            if (show_markers()) {
                markers[next_prop_id].classList.add('active');
            }

            if (active_prop_id == props.length - 2) {
                // All prop images should have loaded...
            } else {

                if (images[next_prop_id + 1]) {
                    get_images(images[next_prop_id + 1]);
                }
            }
        }

        // Remove active prop
        active_prop.dataset.shiftrCarouselActive = 'false';
        setTimeout(function () {
            active_prop.classList.remove('active');

            // Define transition end
            transition_in_progress = false;
        }, _.transition);
    };

    var looping = void 0,
        restart = void 0;

    if (_.autoplay) {
        looping = setInterval(the_loop, _.speed);
    }

    if (show_markers()) {

        markers.forEach(function (marker) {

            marker.addEventListener('click', function () {

                // Early exit if transition is in progress
                if (transition_in_progress) {
                    pause_loop = false;
                    return false;
                }

                // active_prop and active_prop_id are corect
                var active_prop = get_active_prop(),
                    active_prop_id = get_active_prop_id(active_prop);

                // Issues with selected_prop
                var selected_prop = props[marker.dataset.shiftrCarouselMarker],
                    selected_prop_id = marker.dataset.shiftrCarouselMarker;

                // Turn off pause to allow change
                pause_loop = false;

                // Stop current actions
                if (_.autoplay) {
                    clearInterval(looping);
                    clearTimeout(restart);
                }

                if (active_prop_id != selected_prop_id) {

                    // Define transition start
                    transition_in_progress = true;

                    // Remove active props
                    markers[active_prop_id].classList.remove('active');

                    // Set prop
                    props[selected_prop_id].style.zIndex = 150;
                    props[selected_prop_id].classList.add('active');
                    props[selected_prop_id].dataset.shiftrCarouselActive = 'true';

                    markers[selected_prop_id].classList.add('active');

                    // Continue remove
                    active_prop.dataset.shiftrCarouselActive = 'false';
                    setTimeout(function () {
                        active_prop.classList.remove('active');
                        props[selected_prop_id].style.zIndex = '';

                        // Define transition end
                        transition_in_progress = false;
                    }, _.transition);
                }

                // Restart loop, if paused
                if (_.autoplay) {
                    restart = setTimeout(function () {
                        looping = setInterval(the_loop, _.speed);
                    }, _.speed);
                }
            });

            marker.addEventListener('mouseover', function () {

                // was using active_prop instead of selected_prop
                var selected_prop = props[marker.dataset.shiftrCarouselMarker],
                    selected_prop_id = marker.dataset.shiftrCarouselMarker;

                //console.log( selected_prop );

                if (_.pause_on_marker_hover) {
                    pause_loop = true;
                }

                // Make sure all prop images have loaded
                if (images[selected_prop_id]) {
                    get_images(images[selected_prop_id]);
                }
            });

            marker.addEventListener('mouseleave', function () {

                pause_loop = false;
            });
        });
    }

    // Get images
    function get_images(sub_images) {

        for (i = 0; i < sub_images.length; i++) {
            if (sub_images[i].hasAttribute('src') === false) {
                sub_images[i].src = sub_images[i].dataset.src;
                sub_images[i].dataset.src = '';
            }
        }
    }

    // Get data on the active prop
    function get_active_prop() {

        var the_prop = void 0;

        for (i = 0; i < props.length; i++) {
            if (props[i].dataset.shiftrCarouselActive == 'true') {
                the_prop = props[i];
            }
        }

        return the_prop;
    }

    // Get active prop id
    function get_active_prop_id(the_prop) {
        return parseInt(the_prop.dataset.shiftrCarouselProp, 10);
    }

    // Toggle for markers
    function show_markers() {
        if (_.show_markers) {
            return true;
        } else {
            return false;
        }
    }
};
'use strict';

/*  Element.prototype.floater
 *
 *  @since 1.0
 *
 *  @param settings Object The settings for the floater target element
 *  @polyfill Object.assign
 *
 */

Element.prototype.floater = function () {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    // The default settings
    var defaults = {
        bounding: this.parentElement, // Element
        float_buffer: 0, // Integar
        header: document.querySelector('.header'), // Element|null
        starting: null, // null|Element
        ending: null,
        events: {
            resize: window,
            orientationchange: window
        }
    };

    // Assign settings as defaults if settings are not set
    if (Object.keys(settings).length == 0) settings = defaults;

    // Override the defaults with any defined settings
    var _ = Object.assign(defaults, settings);

    // Global variables
    var floater = this,
        bounding = _.bounding,
        floater_position,
        floater_left,
        bounding_position,
        bounding_top,
        bounding_bottom,
        float_position = _.float_buffer,
        position_top,
        position_bottom,
        starting_point,
        ending_point;

    // Check if header height should be included in float_position
    if (_.header) float_position += _.header.offsetHeight;

    // The core function that event listeners are appended to
    var action = function action(e) {

        // Get the current scroll position
        var scroll_position = window.pageYOffset || document.documentElement.scrollTop;

        // We do not want to redefine the following on a scroll
        if (e.type != 'scroll') {

            floater_position = floater.getBoundingClientRect();
            bounding_position = bounding.getBoundingClientRect();

            floater_left = floater_position.left;

            if (_.starting !== null) {
                starting_point = _.starting.getBoundingClientRect().top + scroll_position;
            } else {
                starting_point = bounding_position.top + scroll_position;
            }

            if (_.ending !== null) {
                ending_point = _.ending.getBoundingClientRect().bottom + scroll_position;
            } else {
                ending_point = bounding_position.bottom + scroll_position;
            }
        }

        // Setup the starting and ending points including buffer areas
        position_top = scroll_position + float_position;
        position_bottom = scroll_position + float_position + floater.offsetHeight;

        // Decide what state the floater should be in based on scroll position...
        if (position_bottom >= ending_point) {
            floater.classList.add('pause');
            floater.classList.remove('sticky');
            floater.setAttribute('style', '');
        } else if (position_top >= starting_point) {
            floater.style.width = bounding.offsetWidth + 'px';
            floater.style.top = float_position + 'px';
            floater.style.left = bounding_position.left + 'px';
            floater.classList.add('sticky');
            floater.classList.remove('pause');
        } else if (position_top <= starting_point) {
            floater.classList.remove('sticky');
            floater.setAttribute('style', '');
        }
    };

    // The event listeners...
    Object.keys(_.events).forEach(function (e) {
        _.events[e].addEventListener(e, action);
    });

    document.addEventListener('DOMContentLoaded', action);
    window.addEventListener('scroll', action);
};
'use strict';

/*  Element.prototype.follower
 *
 *  @since 1.0
 *
 *  @param settings Object The settings for the floater target element
 *  @polyfill Object.assign
 *
 */

Element.prototype.follower = function () {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    // The default settings
    var defaults = {
        sections: document.querySelectorAll('section')
    };

    // Assign settings as defaults if settings are not set
    if (Object.keys(settings).length == 0) settings = defaults;

    // Override the defaults with any defined settings
    var _ = Object.assign(defaults, settings);

    // Global variables
    var nav = this,
        links = this.querySelectorAll('span'),
        sections = _.sections,
        section_position,
        section_id,
        section_top,
        section_bottom;

    links.forEach(function (link) {

        link.addEventListener('click', function (e) {

            document.querySelector(link.getAttribute('data-on-page-link')).animateScroll();
        });
    });

    var action = function action(e) {

        // Get the current scroll position
        var scroll_position = window.pageYOffset || document.documentElement.scrollTop,
            target_point = scroll_position + vh() / 2;

        sections.forEach(function (section) {

            if (e.type != 'scroll') {

                section_position = section.getBoundingClientRect();

                section_top = section_position.top + scroll_position;
                section_bottom = section_position.bottom + scroll_position;
            }

            var id = section.getAttribute('id').substring(8),
                section_top = section.getBoundingClientRect().top + scroll_position,
                section_bottom = section.getBoundingClientRect().bottom + scroll_position;

            if (target_point > section_top && target_point < section_bottom) {

                links[id - 1].classList.add('active');
            } else {

                links[id - 1].classList.remove('active');
            }
        });
    };

    document.addEventListener('DOMContentLoaded', action);
    window.addEventListener('scroll', action);
};
'use strict';

/*  
    ////  --|    INIT JS

    * Set-up JavaScript
*/

function on_load() {
				var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (e) {};


				document.addEventListener('DOMContentLoaded', function (e) {
								fn;
				});
}

/*  ////  --|    Return window size

    * Twin functions, one for width and another for height
*/

function vw() {
				return window.innerWidth;
}

function vh() {
				return window.innerHeight;
}

/*  ////  --|    Width Breakpoint - the JS equivilant to CSS media queries

    * Ensure breakpoint settings match those set in the styles
*/

var s = 's';
var m = 'm';
var l = 'l';
var xl = 'xl';
var max = 'max';

function x(width, fn) {
				var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
				var run_once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;


				var value;

				switch (width) {
								case s:
												value = 450;break;
								case m:
												value = 768;break;
								case l:
												value = 1024;break;
								case xl:
												value = 1600;break;
								case max:
												value = 1920;break;
								default:
												value = width;
				}

				var run = function run() {

								var allow = false;

								if (vw() > value) {

												if (run_once === true && allow === false) return;

												fn();

												allow = false;
								} else {

												if (run_once === true && allow === true) return;

												callback();

												allow = true;
								}
				};

				document.addEventListener('DOMContentLoaded', run);
				window.addEventListener('resize', run);
				window.addEventListener('orientationchange', run);
}
'use strict';

(function () {

    /*  ////  --|    Accordion
         @since 1.0
    */

    // Check Gallery component exists on page
    if (document.querySelector('[data-shiftr-accordion]') === null) return false;

    var accordion = document.querySelector('.accordion'),
        accordion_singles = accordion.querySelectorAll('.single');

    accordion_singles.forEach(function (single) {

        single.addEventListener('click', function (e) {
            e.preventDefault();

            single.classList.toggle('open');
        });
    });
})();
'use strict';

(function () {

    /*  ////  --|    Cookie
         * Handle the Shiftr Cookie Consent
    */

    //  ////  --|    This is where we set the cookie

    if (document.querySelector('.shiftr-cookie-notice') === null) return;

    var cookie_accepter = document.getElementById('shiftr-cookie-accept');
    var shiftr_cookie_notice = document.querySelector('.shiftr-cookie-notice');

    cookie_accepter.addEventListener('click', function (e) {
        e.preventDefault();

        shiftr_cookie_notice.classList.add('accepted');

        // Prepare the cookie
        var cookie_name = 'shiftr_' + shiftr.name + '_consent';

        cookie_name = cookie_name.replace(' ', '_');
        cookie_name = cookie_name.toLowerCase();

        var cookie_expiry = 'Thu, 18 Dec 2019 12:00:00 UTC';

        // Set the cookie
        document.cookie = cookie_name + '=' + true + '; expires=' + cookie_expiry + '; path=/';

        // Now, remove the notice
        setTimeout(function () {
            shiftr_cookie_notice.classList.remove('posted');
        }, 750);

        setTimeout(function () {
            document.body.removeChild(shiftr_cookie_notice);
        }, 2000);
    });
})();
'use strict';

(function () {

    /*  ////  --|    FORM HANDLER 0.5 [BETA]
         * Ships 100% dynamic, not tied to a specific form,
          allowing multiple forms to use the whole module
    */

    //  --|    SETTINGS
    var settings = shiftr.form;

    // Validation classes
    var vc = {
        focus: 'focus',
        success: 'success',
        error: 'error'
    };

    //  --|    FIELDS

    var inputs = document.querySelectorAll('input, textarea'),
        listed = ['name', 'text', 'email'];

    inputs.forEach(function (input) {

        if (listed.indexOf(input.type) >= 0 || input.nodeName == 'TEXTAREA') {

            // target is label
            var target = input.previousElementSibling;

            input.addEventListener('focus', function () {

                this.classList.add(vc.focus);
                target.classList.add(vc.focus);
            });

            input.addEventListener('blur', function () {

                this.className = '';
                target.className = '';

                if (this.value != '') {

                    if (this.checkValidity()) {
                        target.classList.add(vc.success);
                        clear_validation(this);
                    } else {
                        target.classList.add(vc.error);
                    }
                }
            });

            input.addEventListener('invalid', function (e) {
                e.preventDefault();

                target.classList.add(vc.error);

                do_validation(this, this.validationMessage);
            });
        } else if (input.type == 'checkbox') {

            input.addEventListener('change', function () {

                if (input.checked) {
                    clear_validation(input);
                }
            });

            input.addEventListener('invalid', function (e) {
                e.preventDefault();

                do_validation(this, this.validationMessage);
            });
        }
    });

    function do_validation(input, message) {

        var m = document.createElement('span');

        m.classList.add('validation');
        m.innerHTML = message;
        input.parentElement.appendChild(m);

        setTimeout(function () {
            m.classList.add('pop');
        }, 400);

        setTimeout(function () {
            clear_validation(input);
        }, 6000);
    }

    function clear_validation(input) {

        var nextEl = input.nextElementSibling;

        if (nextEl) {

            if (nextEl.nodeName == 'SPAN') {

                nextEl.classList.remove('pop');

                setTimeout(function () {
                    input.parentElement.removeChild(nextEl);
                }, 400);
            }
        }
    }

    /*  --|    Handle the submission
          * IE 10-11: does not support json as responseType
        * Firefox 6-9: does not support json as responseType
        * Firefox 6-11: does not support .timeout and .ontimeout
        * Chrome 7-28: does not support .timeout and .ontimeout
        * Chrome 7-30: does not support json as responseType
        * Safari 5-7: does not support .timeout and .ontimeout
        * Safari 6.1-7: does not support json as responseType
     */

    if (document.querySelector('.form')) {
        var form = document.querySelector('.form');

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            form.querySelector('input[type="submit"]').classList.add('submitting');

            var data = new FormData(form);

            var xhr = new XMLHttpRequest();

            xhr.onload = function () {

                if (this.status >= 200 && this.status < 400) {

                    console.log(this.responseText);

                    var _data = JSON.parse(this.responseText);

                    form.querySelector('input[type="submit"]').classList.remove('submitting');

                    if (_data.sent) {

                        do_submission(true);
                    }
                } else {

                    console.log('error', xhr);
                }
            };

            xhr.onerror = function () {
                alert(settings.xhr_error);
            };

            xhr.open('POST', settings.ajax);
            xhr.send(data);
        });
    }

    function do_submission(type) {

        var form = document.querySelector('form');

        var message = document.createElement('div'),
            wrap = document.createElement('div'),
            heading = document.createElement('span'),
            content = document.createElement('p'),
            error_ref = document.createElement('span'),
            closer = document.createElement('button');

        message.classList.add('submission');

        // Select corresponding confirmation content
        switch (type) {

            case 'POST' || 'MAIL':
                var body = {
                    h: settings.error_heading,
                    c: settings.error_body
                };
                error_ref.innerHTML = 'ERROR REF: ' + type;
                break;

            default:
                var body = {
                    h: settings.success_heading,
                    c: settings.success_body
                };
        }

        heading.innerHTML = body.h;
        content.innerHTML = body.c;

        closer.innerHTML = 'Close';
        closer.setAttribute('id', 'close-submission');
        closer.classList.add('button');

        wrap.appendChild(heading);
        wrap.appendChild(content);
        wrap.appendChild(error_ref);
        message.appendChild(wrap);
        message.appendChild(closer);

        form.appendChild(message);

        setTimeout(function () {
            message.classList.add('show');
        }, 100);

        closer.addEventListener('click', function (e) {
            e.preventDefault();
            clearTimeout(auto_clear);
            clear_submission(message, type);
        });

        var error_types = ['POST', 'MAIL'],
            auto_clear_delay = void 0;

        if (error_types.indexOf(type) == -1) {
            auto_clear_delay = 8100;
        } else {
            auto_clear_delay = 30000;
        }

        var auto_clear = setTimeout(function () {

            clear_submission(message, type);
        }, auto_clear_delay);
    }

    function clear_submission(el, action) {

        if (action === true) {

            var i;

            for (i = 0; i < inputs.length; i++) {

                if (listed.indexOf(inputs[i].type) > 0 || inputs[i].nodeName == 'TEXTAREA') {

                    inputs[i].value = '';
                    inputs[i].className = '';
                    inputs[i].previousElementSibling.className = '';
                } else if (inputs[i].type == 'checkbox') {
                    inputs[i].checked = false;
                }
            }
        }

        setTimeout(function () {
            el.classList.remove('show');
        }, 100);
    }
})();
'use strict';

(function () {

    /*  ////  --|    Gallery
         * Brand new component
    */

    // Check Gallery component exists on page
    if (document.querySelector('[data-shiftr-gallery]') === null) return false;

    // Create the viewer
    var viewer = document.createElement('div'),
        viewer_img = document.createElement('img');

    viewer.classList.add('gallery-viewer');

    viewer.appendChild(viewer_img);

    document.body.appendChild(viewer);

    var gallery_list = document.querySelector('.gallery-list'),
        gallery_images = document.querySelectorAll('[data-shiftr-gallery-image]');

    var sources = [];

    // Listen for image clicks
    gallery_images.forEach(function (image) {

        sources.push(image.src);

        image.addEventListener('click', function () {

            viewer_img.src = image.src;

            if (viewer.classList.contains('display')) return;

            viewer.classList.add('pre');

            setTimeout(function () {
                viewer.classList.add('display');
            }, 100);
        });
    });

    var counter = sources.length;

    // Close the viewer
    viewer.addEventListener('click', function () {

        viewer.classList.remove('display');
        setTimeout(function () {
            viewer.classList.remove('pre');
        }, 600);
    });

    viewer_img.addEventListener('click', function (e) {

        e.stopPropagation();
    });

    // Switch between images in the viewer
    document.addEventListener('keydown', function (e) {

        var key = e.keyCode || e.which,
            current_position = sources.indexOf(viewer_img.src);

        // Left arrow
        if (key == 37) {
            if (current_position == 0) {
                viewer_img.src = sources[counter - 1];

                return;
            }

            viewer_img.src = sources[current_position - 1];
        }

        // Right arrow
        if (key == 39) {
            if (current_position + 1 == counter) {

                viewer_img.src = sources[0];

                return;
            }

            viewer_img.src = sources[current_position + 1];
        }
    });
})();
'use strict';

(function () {

    /*  ////  --|    GENERIC
         * Just some magic
    */

    //  ////  --|    TOGGLE HIDDEN MENU


    var toggle = document.querySelector('.toggle'),
        nav = document.querySelector('.main-nav'),
        sub_navs = document.querySelectorAll('li.parent'),
        header = document.querySelector('.header'),
        body = document.body;

    //let header_transition_height = ( nav.offsetHeight / 10 ) + 7 + 'rem';
    var header_transition_height = '100vh';

    var stop = function stop(e) {
        e.stopPropagation();
    };

    var toggle_menu = function toggle_menu(e) {
        e.stopPropagation();

        toggle.classList.toggle('transition');
        body.classList.toggle('no-scroll');

        if (header.offsetHeight > nav.offsetHeight) {
            header.setAttribute('style', '');
        } else {
            header.style.height = header_transition_height;
        }

        nav.classList.toggle('show');
    };

    var toggle_window = function toggle_window() {
        toggle.classList.remove('transition');
        header.setAttribute('style', '');
        body.classList.remove('no-scroll');
        nav.classList.remove('show');
    };

    x(m, function () {
        toggle.removeEventListener('click', toggle_menu);
        nav.removeEventListener('click', stop);
        window.removeEventListener('click', toggle_window);
    }, function () {
        toggle.addEventListener('click', toggle_menu);
        nav.addEventListener('click', stop);
        window.addEventListener('click', toggle_window);
    }, true);

    x(m, function () {

        sub_navs.forEach(function (sub) {

            var link = sub.children[0],
                menu = sub.children[1],
                remove_open = void 0;

            link.addEventListener('mouseover', function (e) {
                e.preventDefault();

                clearTimeout(remove_open);

                if (sub.classList.contains('show') !== true) {
                    sub.classList.add('show');
                }
            });

            link.addEventListener('mouseleave', function (e) {

                remove_open = setTimeout(function () {
                    sub.classList.remove('show');
                }, 200);
            });

            menu.addEventListener('mouseover', function () {

                clearTimeout(remove_open);
            });

            menu.addEventListener('mouseleave', function () {

                remove_open = setTimeout(function () {
                    sub.classList.remove('show');
                }, 200);
            });
        });
    });

    //  ////  --|    SIZE UP SVG LOGO


    //const the_logo = document.getElementById( 'the_logo' ),
    //     viewbox = the_logo.getAttribute( 'viewBox' ),
    //     values = viewbox.split( ' ' ),
    //     ratio = values[2] / values[3],
    //     width = ( the_logo.parentElement.offsetHeight / 10 ) * ratio;

    // the_logo.style.width = `${ width }rem`;


    //  ////  --|    BLOG STICKY SIDEBAR


    x(l, function () {

        var sidebar = document.querySelector('.blog-sidebar'),
            blog_layout = document.querySelector('.blog-layout > div');

        if (sidebar === null) return;

        var sidebar_width = sidebar.offsetWidth,
            sidebar_pos = sidebar.getBoundingClientRect(),
            blog_layout_pos = blog_layout.getBoundingClientRect();

        window.addEventListener('scroll', function () {

            var curr_pos = window.scrollY;

            if (curr_pos + sidebar.offsetHeight + header.offsetHeight + 20 >= blog_layout_pos.bottom) {

                sidebar.classList.add('pause');
                sidebar.classList.remove('sticky');
            } else if (curr_pos + header.offsetHeight + 20 >= blog_layout_pos.top) {

                sidebar.style.width = sidebar.offsetWidth + 'px';
                sidebar.style.top = header.offsetHeight + 20 + 'px';
                sidebar.style.left = sidebar_pos.left + 'px';
                sidebar.classList.add('sticky');
                sidebar.classList.remove('pause');
            } else {

                sidebar.classList.remove('sticky');
                sidebar.setAttribute('style', '');
            }
        });
    });

    //  ////  --|    CAROUSEL

    if (document.querySelector('[data-shiftr-carousel]')) {

        if (document.querySelector('.hero-carousel')) {

            document.addEventListener('DOMContentLoaded', function () {

                setTimeout(function () {
                    document.querySelector('.hero-carousel .content').classList.add('load');
                }, 800);
            });

            document.querySelector('.hero-carousel').shiftrCarousel({
                pause_on_marker_hover: false,
                speed: 6000
            });
        }
    }
})();
'use strict';

(function () {

    /*  ////  --|    LAZY LOADER 2.0
         * The second iteration of the Lazy Loader
        * Now contained within function
        * Handles img, iframe and background-images all in one
        * Updated to ES6 with arrow functions and interpolation
    */

    var lazyContent = [].slice.call(document.querySelectorAll('.lazy')),
        listed = ['IMG', 'IFRAME'];

    if ('IntersectionObserver' in window) {

        var lazyObserver = new IntersectionObserver(function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    var lazyItem = entry.target;

                    if (listed.indexOf(lazyItem.nodeName) >= 0) {
                        lazyItem.src = lazyItem.dataset.src;
                        lazyItem.classList.remove('lazy');
                    } else {
                        lazyItem.classList.add('visible');lazyItem.classList.remove('lazy');
                    }

                    lazyObserver.unobserve(lazyItem);
                }
            });
        }, { rootMargin: '0px 0px ' + window.innerHeight + 'px 0px' });

        lazyContent.forEach(function (lazyItem) {
            lazyObserver.observe(lazyItem);
        });
    } else {

        var active = false,
            lazyLoad = function lazyLoad() {

            if (active === false) {
                active = true;

                setTimeout(function () {
                    lazyContent.forEach(function (lazyItem) {

                        if (lazyItem.getBoundingClientRect().top <= window.innerHeight && lazyItem.getBoundingClientRect().bottom >= window.innerHeight && getComputedStyle(lazyItem).display != 'none') {

                            if (listed.indexOf(lazyItem.nodeName) >= 0) {
                                lazyItem.src = lazyItem.dataset.src;
                                lazyItem.classList.remove('lazy');
                            } else {
                                lazyItem.classList.add('visible');lazyItem.classList.remove('lazy');
                            }

                            lazyContent = lazyContent.filter(function (item) {
                                return item !== lazyItem;
                            });

                            if (lazyContent.length == 0) {
                                document.removeEventListener('scroll', lazyLoad);
                                window.removeEventListener('resize', lazyLoad);
                                window.removeEventListener('orientationchange', lazyLoad);
                            }
                        }
                    });active = false;
                }, 200);
            }
        };

        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
    }
});
'use strict';

(function () {

    /*  ////  --|    GOOGLE MAPS API LAZY LOADER
         * The function is split, meaning lazy loading 
          can be toggled for diferent pages if necessary
    */

    function maps_api_lazy_loader(key) {

        if (api_key) {

            if (PHP_PAGE_ID == STATIC_PAGE_ID) {

                var window_height = window.innerHeight,
                    map = document.getElementById("half-map"),
                    api_url = 'https://maps.googleapis.com/maps/api/js?callback=initialize&key=' + key;

                if ('IntersectionObserver' in window) {

                    var options = {
                        rootMargin: window_height + 'px',
                        threshold: 0
                    };

                    var observer = new IntersectionObserver(function (entries, observer) {
                        var isIntersecting = typeof entries[0].isIntersecting === 'boolean' ? entries[0].isIntersecting : entries[0].intersectionRatio > 0;

                        if (isIntersecting) {

                            var script = document.createElement('script');
                            script.src = api_url;

                            document.body.appendChild(script);
                            observer.unobserve(map);
                        }
                    }, options);

                    observer.observe(map);
                } else {

                    var active = false;

                    var lazyMap = function lazyMap() {
                        if (active === false) {
                            active = true;

                            setTimeout(function () {
                                if (map.getBoundingClientRect().top <= window.innerHeight * 2 && map.getBoundingClientRect().bottom >= 0 && getComputedStyle(map).display !== 'none') {

                                    create_script();

                                    document.removeEventListener('scroll', lazyMap);
                                    window.removeEventListener('resize', lazyMap);
                                    window.removeEventListener('orientationchange', lazyMap);
                                }

                                active = false;
                            }, 200);
                        }
                    };

                    document.addEventListener('scroll', lazyMap);
                    window.addEventListener('resize', lazyMap);
                    window.addEventListener('orientationchange', lazyMap);
                }
            } else {
                // If current page doesn't match, load immediately

                create_script();
            }
        }

        function create_script() {
            var script = document.createElement('script');
            script.src = api_url;
            document.body.appendChild(script);
        }
    }

    maps_api_lazy_loader('AIzaSyB9nr_oTH1RtTgYWGXxZj6MSNW-yb6hE7c');
});
'use strict';

(function () {

    /*  ////  --|    ORPHAN
         * Say goodbye to orphan children in text;
          be it headings, paragraphs, list items or spans.
         * Exclude elements with data-orphan attribute
     */

    // Collect text elements
    var group = document.querySelectorAll('[data-orphan]');

    // The Loop
    group.forEach(function (el) {

        // Assign text content
        var content = el.innerHTML,
            newNode = [];

        // Target elements with break tags
        if (content.indexOf('<br>') >= 0 && content.indexOf(' ') >= 0) {
            var textNodes = content.split('<br>');

            textNodes.forEach(function (node) {

                // Update text with no more orphans!
                newNode.push(no_orphan(node));
            });

            // Rejoin whole element and update
            el.innerHTML = newNode.join('<br>');
        } else if (content.indexOf(' ') >= 0) {

            // Update text with no more orphans!
            el.innerHTML = no_orphan(content);
        }
    });

    // Replace space with &nbsp;
    function no_orphan(el) {

        // Get last space position
        var space = el.lastIndexOf(' ');

        // Do the magic
        return el.slice(0, space) + el.slice(space).replace(' ', '&nbsp;');
    }
})();
'use strict';

(function () {

    /*  ////  --|    POPUPS
         * Basic functionality to handle opening an closing
          of popup elements.
        * Can handle multiple popups per page
    */

    var open = document.querySelectorAll('.open'),
        close = document.querySelectorAll('.x'),
        body = document.body;

    open.forEach(function (opener) {
        opener.addEventListener('click', function () {

            var instance = opener.getAttribute('data-open'),
                popup = document.querySelector('[data-popup="' + instance + '"]');

            popup.classList.add('popup-appear');
            body.classList.add('no-scroll');
        });
    });

    close.forEach(function (closer) {
        closer.addEventListener('click', function () {

            var popup = closer.parentElement;

            popup.classList.add('popup-disappear');
            body.classList.remove('no-scroll');

            setTimeout(function () {
                popup.classList.remove('popup-appear');
                popup.classList.remove('popup-disappear');
            }, 1200);
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9wb2x5ZmlsbC5qcyIsImFuaW1hdGUuanMiLCJjYXJvdXNlbC5qcyIsImZsb2F0ZXIuanMiLCJmb2xsb3dlci5qcyIsImluaXQuanMiLCJhY2NvcmRpb24uanMiLCJjb29raWUuanMiLCJmb3JtX2hhbmRsZXIuanMiLCJnYWxsZXJ5LmpzIiwiZ2VuZXJpYy5qcyIsImxhenlfbG9hZGVyLmpzIiwibWFwc19hcGlfbGF6eV9sb2FkZXIuanMiLCJvcnBoYW4uanMiLCJwb3B1cHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8qICAvLy8vICAtLXwgICAgUG9seWZpbGxzXG5cbiAgICAqIFxuKi9cblxuLy8gT2JqZWN0LmFzc2lnblxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduXG5cbmlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiAhPSAnZnVuY3Rpb24nKSB7XG5cbiAgLy8gTXVzdCBiZSB3cml0YWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogZmFsc2UsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LCBcImFzc2lnblwiLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHZhckFyZ3MpIHtcbiAgICAgIC8vIC5sZW5ndGggb2YgZnVuY3Rpb24gaXMgMlxuICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICBpZiAodGFyZ2V0ID09IG51bGwpIHtcbiAgICAgICAgLy8gVHlwZUVycm9yIGlmIHVuZGVmaW5lZCBvciBudWxsXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcblxuICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdO1xuXG4gICAgICAgIGlmIChuZXh0U291cmNlICE9IG51bGwpIHtcbiAgICAgICAgICAvLyBTa2lwIG92ZXIgaWYgdW5kZWZpbmVkIG9yIG51bGxcbiAgICAgICAgICBmb3IgKHZhciBuZXh0S2V5IGluIG5leHRTb3VyY2UpIHtcbiAgICAgICAgICAgIC8vIEF2b2lkIGJ1Z3Mgd2hlbiBoYXNPd25Qcm9wZXJ0eSBpcyBzaGFkb3dlZFxuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChuZXh0U291cmNlLCBuZXh0S2V5KSkge1xuICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdG87XG4gICAgfSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiAgLy8vLyAgLS18ICAgIEVsZW1lbnQucHJvdG90eXBlLmFuaW1hdGVTY3JvbGwoIGR1cmF0aW9uLCBidWZmZXIgKVxuXG4gICAgKiBTY3JvbGwgZG9jdW1lbnQgdG8gZWxlbWVudFxuKi9cblxuRWxlbWVudC5wcm90b3R5cGUuYW5pbWF0ZVNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZHVyYXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDEwMDA7XG4gICAgdmFyIGJ1ZmZlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcblxuXG4gICAgLy8gVXBkYXRlIGJ1ZmZlciB0byBpbmNsdWRlIGhlaWdodCBvZiBoZWFkZXJcbiAgICBidWZmZXIgKz0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpLm9mZnNldEhlaWdodDtcblxuICAgIHZhciBydW4gPSB0cnVlO1xuXG4gICAgLy8gU2V0dGluZ3NcbiAgICB2YXIgc3RhcnRfcG9zID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AsXG4gICAgICAgIHRhcmdldF9wb3MgPSB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHN0YXJ0X3BvcyxcbiAgICAgICAgZGlzdGFuY2UgPSB0YXJnZXRfcG9zIC0gc3RhcnRfcG9zLFxuICAgICAgICBkaXN0YW5jZSA9IGRpc3RhbmNlIC0gYnVmZmVyLFxuICAgICAgICBjdXJyZW50VGltZSA9IDAsXG4gICAgICAgIGluY3JlbWVudCA9IDE2LjY2O1xuXG4gICAgLy8gRG8gdGhlIGFuaW1hdGlvblxuICAgIHZhciBhbmltYXRlX3Njcm9sbCA9IGZ1bmN0aW9uIGFuaW1hdGVfc2Nyb2xsKCkge1xuXG4gICAgICAgIGlmIChydW4gPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgICAgY3VycmVudFRpbWUgKz0gaW5jcmVtZW50O1xuXG4gICAgICAgIHZhciB2YWwgPSBNYXRoLmVhc2VJbk91dFF1YWQoY3VycmVudFRpbWUsIHN0YXJ0X3BvcywgZGlzdGFuY2UsIGR1cmF0aW9uKTtcblxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSB2YWw7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRUaW1lIDwgZHVyYXRpb24pIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoYW5pbWF0ZV9zY3JvbGwsIGluY3JlbWVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRWFzaW5nLi4uXG4gICAgTWF0aC5lYXNlSW5PdXRRdWFkID0gZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblxuICAgICAgICB0IC89IGQgLyAyO1xuXG4gICAgICAgIGlmICh0IDwgMSkgcmV0dXJuIGMgLyAyICogdCAqIHQgKyBiO1xuXG4gICAgICAgIHQtLTtcblxuICAgICAgICByZXR1cm4gLWMgLyAyICogKHQgKiAodCAtIDIpIC0gMSkgKyBiO1xuICAgIH07XG5cbiAgICAvLyBEbyBpbml0aWFsIGl0ZXJhdGlvblxuICAgIGFuaW1hdGVfc2Nyb2xsKCk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyogIC8vLy8gIC0tfCAgICBFbGVtZW50LnByb3RvdHlwZS5jYXJvdXNlbCggc2V0dGluZ3MgPSBPYmplY3QgKVxuXG4gICAgQHNpbmNlIDEuMFxuXG4gICAgQHBvbHlmaWxsczogT2JqZWN0LmFzc2lnblxuKi9cblxuRWxlbWVudC5wcm90b3R5cGUuc2hpZnRyQ2Fyb3VzZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNldHRpbmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuXG4gICAgLy8gVGhlIGRlZmF1bHQgc2V0dGluZ3NcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgICAgICBzcGVlZDogNDAwMCxcbiAgICAgICAgdHJhbnNpdGlvbjogODAwLFxuICAgICAgICBzaG93X21hcmtlcnM6IHRydWUsXG4gICAgICAgIHBhdXNlX29uX21hcmtlcl9ob3ZlcjogdHJ1ZVxuICAgIH07XG5cbiAgICB2YXIgaSA9IDA7XG5cbiAgICAvLyBBc3NpZ24gc2V0dGluZ3MgYXMgZGVmYXVsdHMgaWYgc2V0dGluZ3MgYXJlIG5vdCBzZXRcbiAgICBpZiAoT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aCA9PSAwKSBzZXR0aW5ncyA9IGRlZmF1bHRzO1xuXG4gICAgLy8gT3ZlcnJpZGUgdGhlIGRlZmF1bHRzIHdpdGggYW55IGRlZmluZWQgc2V0dGluZ3NcbiAgICB2YXIgXyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIHNldHRpbmdzKTtcblxuICAgIC8vIFRoZSBtYWluIGNhcm91c2VsIGVsZW1lbnRzXG4gICAgdmFyIGNhcm91c2VsID0gdGhpcyxcbiAgICAgICAgc3RhZ2UgPSB0aGlzLmNoaWxkcmVuWzBdLFxuICAgICAgICBwcm9wcyA9IHRoaXMuY2hpbGRyZW5bMF0uY2hpbGRyZW47XG5cbiAgICAvLyBTZXQgdGhlIHN0YWdlIGhpZWdodCBiYXNlZCBvZmYgb2Zmc2V0SGVpZ2h0IG9mIGZpcnN0IHByb3BcbiAgICBzdGFnZS5zdHlsZS5oZWlnaHQgPSBwcm9wc1swXS5vZmZzZXRIZWlnaHQgKyAncHgnO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBuYXZpZ2F0aW9uXG4gICAgdmFyIHN0YWdlX21hcCA9IHZvaWQgMDtcbiAgICBpZiAoc2hvd19tYXJrZXJzKCkpIHtcbiAgICAgICAgc3RhZ2VfbWFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHN0YWdlX21hcC5jbGFzc0xpc3QuYWRkKCdzdGFnZS1tYXAnKTtcblxuICAgICAgICBjYXJvdXNlbC5hcHBlbmRDaGlsZChzdGFnZV9tYXApO1xuICAgIH1cblxuICAgIC8vIFRoZSBwYXVzZSB2YXJpYWJsZVxuICAgIHZhciBwYXVzZV9sb29wID0gZmFsc2UsXG4gICAgICAgIHRyYW5zaXRpb25faW5fcHJvZ3Jlc3MgPSBmYWxzZTtcblxuICAgIC8vIEluaXQgdGhlIENhcm91c2VsXG4gICAgZm9yIChpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgLy8gTWFpbiBDYXJvdXNlbCBkYXRhXG4gICAgICAgIHByb3BzW2ldLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxQcm9wID0gaTtcbiAgICAgICAgcHJvcHNbaV0uZGF0YXNldC5zaGlmdHJDYXJvdXNlbEFjdGl2ZSA9ICdmYWxzZSc7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtYXJrZXJzXG4gICAgICAgIGlmIChzaG93X21hcmtlcnMoKSkge1xuICAgICAgICAgICAgdmFyIG1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgICAgIGlubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG4gICAgICAgICAgICBtYXJrZXIuZGF0YXNldC5zaGlmdHJDYXJvdXNlbE1hcmtlciA9IGk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBtYXJrZXIgdG8gbmF2aWdhdGlvbiBlbGVtZW50XG4gICAgICAgICAgICBtYXJrZXIuYXBwZW5kQ2hpbGQoaW5uZXIpO1xuICAgICAgICAgICAgc3RhZ2VfbWFwLmFwcGVuZENoaWxkKG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBc3NpZ24gbWFya2VycyBhZnRlciBjcmVhdGlvblxuICAgIHZhciBtYXJrZXJzID0gdm9pZCAwO1xuICAgIGlmIChzaG93X21hcmtlcnMoKSkge1xuICAgICAgICBtYXJrZXJzID0gT2JqZWN0LmtleXMoc3RhZ2VfbWFwLmNoaWxkcmVuKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YWdlX21hcC5jaGlsZHJlbltrZXldO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTZXQtdXAgZmlyc3QgcHJvcCBhbmQgbWFya2VyXG4gICAgcHJvcHNbMF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgcHJvcHNbMF0uZGF0YXNldC5zaGlmdHJDYXJvdXNlbEFjdGl2ZSA9ICd0cnVlJztcblxuICAgIGlmIChzaG93X21hcmtlcnMoKSkge1xuICAgICAgICBtYXJrZXJzWzBdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cblxuICAgIC8vIEdldCBhbGwgZWxlbWVudHMgaW4gdGhlIHByb3BcbiAgICB2YXIgaW1hZ2VzID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgaW1hZ2VzLnB1c2goW10pO1xuXG4gICAgICAgIHZhciBwcm9wX2VsZW1lbnRzID0gcHJvcHNbaV0ucXVlcnlTZWxlY3RvckFsbCgnKicpO1xuXG4gICAgICAgIHByb3BfZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcblxuICAgICAgICAgICAgaWYgKGVsLm5vZGVOYW1lID09ICdJTUcnKSB7XG4gICAgICAgICAgICAgICAgaW1hZ2VzW2ldLnB1c2goZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBHZXQgdGhlIGZpcnN0IGFuZCBzZWNvbmQgcHJvcCBpbWFnZXNcbiAgICBpZiAoaW1hZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZ2V0X2ltYWdlcyhpbWFnZXNbMF0pO1xuICAgIH1cblxuICAgIGlmIChpbWFnZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBnZXRfaW1hZ2VzKGltYWdlc1sxXSk7XG4gICAgICAgIH0sIF8uc3BlZWQgLyAyKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgbWFpbiBsb29wXG4gICAgdmFyIHRoZV9sb29wID0gZnVuY3Rpb24gdGhlX2xvb3AoKSB7XG5cbiAgICAgICAgLy8gUGF1c2Ugb24gaG92ZXJcbiAgICAgICAgaWYgKHBhdXNlX2xvb3ApIHJldHVybiBmYWxzZTtcblxuICAgICAgICAvLyBFYXJseSBleGl0IGlmIHRyYW5zaXRpb24gaXMgaW4gcHJvZ3Jlc3NcbiAgICAgICAgaWYgKHRyYW5zaXRpb25faW5fcHJvZ3Jlc3MpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAvLyBEZWZpbmUgdHJhbnNpdGlvbiBzdGFydFxuICAgICAgICB0cmFuc2l0aW9uX2luX3Byb2dyZXNzID0gdHJ1ZTtcblxuICAgICAgICAvLyBHZXQgaW5mbyBvZiBhY3RpdmUgcHJvcFxuICAgICAgICB2YXIgYWN0aXZlX3Byb3AgPSBnZXRfYWN0aXZlX3Byb3AoKSxcbiAgICAgICAgICAgIGFjdGl2ZV9wcm9wX2lkID0gZ2V0X2FjdGl2ZV9wcm9wX2lkKGFjdGl2ZV9wcm9wKTtcblxuICAgICAgICAvLyBSZW1vdmUgYWN0aXZlIG1hcmtlclxuICAgICAgICBpZiAoc2hvd19tYXJrZXJzKCkpIHtcbiAgICAgICAgICAgIG1hcmtlcnNbYWN0aXZlX3Byb3BfaWRdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgb24gdGhlIGxhc3QgcHJvcFxuICAgICAgICBpZiAoYWN0aXZlX3Byb3BfaWQgPT0gcHJvcHMubGVuZ3RoIC0gMSkge1xuXG4gICAgICAgICAgICAvLyBTZXQgbmV3IHByb3BcbiAgICAgICAgICAgIHByb3BzWzBdLnN0eWxlLnpJbmRleCA9IDE1MDtcbiAgICAgICAgICAgIHByb3BzWzBdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgcHJvcHNbMF0uZGF0YXNldC5zaGlmdHJDYXJvdXNlbEFjdGl2ZSA9ICd0cnVlJztcblxuICAgICAgICAgICAgaWYgKHNob3dfbWFya2VycygpKSB7XG4gICAgICAgICAgICAgICAgbWFya2Vyc1swXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcHJvcHNbMF0uc3R5bGUuekluZGV4ID0gJyc7XG4gICAgICAgICAgICB9LCBfLnRyYW5zaXRpb24pO1xuXG4gICAgICAgICAgICAvLyBTdGFuZGFyZCBzd2l0Y2hcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdmFyIG5leHRfcHJvcCA9IGFjdGl2ZV9wcm9wLm5leHRFbGVtZW50U2libGluZyxcbiAgICAgICAgICAgICAgICBuZXh0X3Byb3BfaWQgPSBwYXJzZUludChuZXh0X3Byb3AuZGF0YXNldC5zaGlmdHJDYXJvdXNlbFByb3AsIDEwKTtcblxuICAgICAgICAgICAgbmV4dF9wcm9wLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgbmV4dF9wcm9wLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxBY3RpdmUgPSAndHJ1ZSc7XG5cbiAgICAgICAgICAgIGlmIChzaG93X21hcmtlcnMoKSkge1xuICAgICAgICAgICAgICAgIG1hcmtlcnNbbmV4dF9wcm9wX2lkXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFjdGl2ZV9wcm9wX2lkID09IHByb3BzLmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICAgICAgICAvLyBBbGwgcHJvcCBpbWFnZXMgc2hvdWxkIGhhdmUgbG9hZGVkLi4uXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYgKGltYWdlc1tuZXh0X3Byb3BfaWQgKyAxXSkge1xuICAgICAgICAgICAgICAgICAgICBnZXRfaW1hZ2VzKGltYWdlc1tuZXh0X3Byb3BfaWQgKyAxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFjdGl2ZSBwcm9wXG4gICAgICAgIGFjdGl2ZV9wcm9wLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxBY3RpdmUgPSAnZmFsc2UnO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGFjdGl2ZV9wcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLyBEZWZpbmUgdHJhbnNpdGlvbiBlbmRcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW5fcHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgfSwgXy50cmFuc2l0aW9uKTtcbiAgICB9O1xuXG4gICAgdmFyIGxvb3BpbmcgPSB2b2lkIDAsXG4gICAgICAgIHJlc3RhcnQgPSB2b2lkIDA7XG5cbiAgICBpZiAoXy5hdXRvcGxheSkge1xuICAgICAgICBsb29waW5nID0gc2V0SW50ZXJ2YWwodGhlX2xvb3AsIF8uc3BlZWQpO1xuICAgIH1cblxuICAgIGlmIChzaG93X21hcmtlcnMoKSkge1xuXG4gICAgICAgIG1hcmtlcnMuZm9yRWFjaChmdW5jdGlvbiAobWFya2VyKSB7XG5cbiAgICAgICAgICAgIG1hcmtlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIC8vIEVhcmx5IGV4aXQgaWYgdHJhbnNpdGlvbiBpcyBpbiBwcm9ncmVzc1xuICAgICAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uX2luX3Byb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdXNlX2xvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGFjdGl2ZV9wcm9wIGFuZCBhY3RpdmVfcHJvcF9pZCBhcmUgY29yZWN0XG4gICAgICAgICAgICAgICAgdmFyIGFjdGl2ZV9wcm9wID0gZ2V0X2FjdGl2ZV9wcm9wKCksXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZV9wcm9wX2lkID0gZ2V0X2FjdGl2ZV9wcm9wX2lkKGFjdGl2ZV9wcm9wKTtcblxuICAgICAgICAgICAgICAgIC8vIElzc3VlcyB3aXRoIHNlbGVjdGVkX3Byb3BcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWRfcHJvcCA9IHByb3BzW21hcmtlci5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsTWFya2VyXSxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRfcHJvcF9pZCA9IG1hcmtlci5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsTWFya2VyO1xuXG4gICAgICAgICAgICAgICAgLy8gVHVybiBvZmYgcGF1c2UgdG8gYWxsb3cgY2hhbmdlXG4gICAgICAgICAgICAgICAgcGF1c2VfbG9vcCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgLy8gU3RvcCBjdXJyZW50IGFjdGlvbnNcbiAgICAgICAgICAgICAgICBpZiAoXy5hdXRvcGxheSkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGxvb3BpbmcpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocmVzdGFydCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZV9wcm9wX2lkICE9IHNlbGVjdGVkX3Byb3BfaWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBEZWZpbmUgdHJhbnNpdGlvbiBzdGFydFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX2luX3Byb2dyZXNzID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgYWN0aXZlIHByb3BzXG4gICAgICAgICAgICAgICAgICAgIG1hcmtlcnNbYWN0aXZlX3Byb3BfaWRdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCBwcm9wXG4gICAgICAgICAgICAgICAgICAgIHByb3BzW3NlbGVjdGVkX3Byb3BfaWRdLnN0eWxlLnpJbmRleCA9IDE1MDtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHNbc2VsZWN0ZWRfcHJvcF9pZF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzW3NlbGVjdGVkX3Byb3BfaWRdLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxBY3RpdmUgPSAndHJ1ZSc7XG5cbiAgICAgICAgICAgICAgICAgICAgbWFya2Vyc1tzZWxlY3RlZF9wcm9wX2lkXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDb250aW51ZSByZW1vdmVcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlX3Byb3AuZGF0YXNldC5zaGlmdHJDYXJvdXNlbEFjdGl2ZSA9ICdmYWxzZSc7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlX3Byb3AuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wc1tzZWxlY3RlZF9wcm9wX2lkXS5zdHlsZS56SW5kZXggPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVmaW5lIHRyYW5zaXRpb24gZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX2luX3Byb2dyZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0sIF8udHJhbnNpdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUmVzdGFydCBsb29wLCBpZiBwYXVzZWRcbiAgICAgICAgICAgICAgICBpZiAoXy5hdXRvcGxheSkge1xuICAgICAgICAgICAgICAgICAgICByZXN0YXJ0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb29waW5nID0gc2V0SW50ZXJ2YWwodGhlX2xvb3AsIF8uc3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICB9LCBfLnNwZWVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWFya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIC8vIHdhcyB1c2luZyBhY3RpdmVfcHJvcCBpbnN0ZWFkIG9mIHNlbGVjdGVkX3Byb3BcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWRfcHJvcCA9IHByb3BzW21hcmtlci5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsTWFya2VyXSxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRfcHJvcF9pZCA9IG1hcmtlci5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsTWFya2VyO1xuXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggc2VsZWN0ZWRfcHJvcCApO1xuXG4gICAgICAgICAgICAgICAgaWYgKF8ucGF1c2Vfb25fbWFya2VyX2hvdmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdXNlX2xvb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBhbGwgcHJvcCBpbWFnZXMgaGF2ZSBsb2FkZWRcbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2VzW3NlbGVjdGVkX3Byb3BfaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldF9pbWFnZXMoaW1hZ2VzW3NlbGVjdGVkX3Byb3BfaWRdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWFya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBwYXVzZV9sb29wID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gR2V0IGltYWdlc1xuICAgIGZ1bmN0aW9uIGdldF9pbWFnZXMoc3ViX2ltYWdlcykge1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzdWJfaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoc3ViX2ltYWdlc1tpXS5oYXNBdHRyaWJ1dGUoJ3NyYycpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHN1Yl9pbWFnZXNbaV0uc3JjID0gc3ViX2ltYWdlc1tpXS5kYXRhc2V0LnNyYztcbiAgICAgICAgICAgICAgICBzdWJfaW1hZ2VzW2ldLmRhdGFzZXQuc3JjID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBHZXQgZGF0YSBvbiB0aGUgYWN0aXZlIHByb3BcbiAgICBmdW5jdGlvbiBnZXRfYWN0aXZlX3Byb3AoKSB7XG5cbiAgICAgICAgdmFyIHRoZV9wcm9wID0gdm9pZCAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHByb3BzW2ldLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxBY3RpdmUgPT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgdGhlX3Byb3AgPSBwcm9wc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGVfcHJvcDtcbiAgICB9XG5cbiAgICAvLyBHZXQgYWN0aXZlIHByb3AgaWRcbiAgICBmdW5jdGlvbiBnZXRfYWN0aXZlX3Byb3BfaWQodGhlX3Byb3ApIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoZV9wcm9wLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxQcm9wLCAxMCk7XG4gICAgfVxuXG4gICAgLy8gVG9nZ2xlIGZvciBtYXJrZXJzXG4gICAgZnVuY3Rpb24gc2hvd19tYXJrZXJzKCkge1xuICAgICAgICBpZiAoXy5zaG93X21hcmtlcnMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qICBFbGVtZW50LnByb3RvdHlwZS5mbG9hdGVyXG4gKlxuICogIEBzaW5jZSAxLjBcbiAqXG4gKiAgQHBhcmFtIHNldHRpbmdzIE9iamVjdCBUaGUgc2V0dGluZ3MgZm9yIHRoZSBmbG9hdGVyIHRhcmdldCBlbGVtZW50XG4gKiAgQHBvbHlmaWxsIE9iamVjdC5hc3NpZ25cbiAqXG4gKi9cblxuRWxlbWVudC5wcm90b3R5cGUuZmxvYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2V0dGluZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG5cbiAgICAvLyBUaGUgZGVmYXVsdCBzZXR0aW5nc1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgYm91bmRpbmc6IHRoaXMucGFyZW50RWxlbWVudCwgLy8gRWxlbWVudFxuICAgICAgICBmbG9hdF9idWZmZXI6IDAsIC8vIEludGVnYXJcbiAgICAgICAgaGVhZGVyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyksIC8vIEVsZW1lbnR8bnVsbFxuICAgICAgICBzdGFydGluZzogbnVsbCwgLy8gbnVsbHxFbGVtZW50XG4gICAgICAgIGVuZGluZzogbnVsbCxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICByZXNpemU6IHdpbmRvdyxcbiAgICAgICAgICAgIG9yaWVudGF0aW9uY2hhbmdlOiB3aW5kb3dcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBBc3NpZ24gc2V0dGluZ3MgYXMgZGVmYXVsdHMgaWYgc2V0dGluZ3MgYXJlIG5vdCBzZXRcbiAgICBpZiAoT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aCA9PSAwKSBzZXR0aW5ncyA9IGRlZmF1bHRzO1xuXG4gICAgLy8gT3ZlcnJpZGUgdGhlIGRlZmF1bHRzIHdpdGggYW55IGRlZmluZWQgc2V0dGluZ3NcbiAgICB2YXIgXyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIHNldHRpbmdzKTtcblxuICAgIC8vIEdsb2JhbCB2YXJpYWJsZXNcbiAgICB2YXIgZmxvYXRlciA9IHRoaXMsXG4gICAgICAgIGJvdW5kaW5nID0gXy5ib3VuZGluZyxcbiAgICAgICAgZmxvYXRlcl9wb3NpdGlvbixcbiAgICAgICAgZmxvYXRlcl9sZWZ0LFxuICAgICAgICBib3VuZGluZ19wb3NpdGlvbixcbiAgICAgICAgYm91bmRpbmdfdG9wLFxuICAgICAgICBib3VuZGluZ19ib3R0b20sXG4gICAgICAgIGZsb2F0X3Bvc2l0aW9uID0gXy5mbG9hdF9idWZmZXIsXG4gICAgICAgIHBvc2l0aW9uX3RvcCxcbiAgICAgICAgcG9zaXRpb25fYm90dG9tLFxuICAgICAgICBzdGFydGluZ19wb2ludCxcbiAgICAgICAgZW5kaW5nX3BvaW50O1xuXG4gICAgLy8gQ2hlY2sgaWYgaGVhZGVyIGhlaWdodCBzaG91bGQgYmUgaW5jbHVkZWQgaW4gZmxvYXRfcG9zaXRpb25cbiAgICBpZiAoXy5oZWFkZXIpIGZsb2F0X3Bvc2l0aW9uICs9IF8uaGVhZGVyLm9mZnNldEhlaWdodDtcblxuICAgIC8vIFRoZSBjb3JlIGZ1bmN0aW9uIHRoYXQgZXZlbnQgbGlzdGVuZXJzIGFyZSBhcHBlbmRlZCB0b1xuICAgIHZhciBhY3Rpb24gPSBmdW5jdGlvbiBhY3Rpb24oZSkge1xuXG4gICAgICAgIC8vIEdldCB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb25cbiAgICAgICAgdmFyIHNjcm9sbF9wb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgICAgIC8vIFdlIGRvIG5vdCB3YW50IHRvIHJlZGVmaW5lIHRoZSBmb2xsb3dpbmcgb24gYSBzY3JvbGxcbiAgICAgICAgaWYgKGUudHlwZSAhPSAnc2Nyb2xsJykge1xuXG4gICAgICAgICAgICBmbG9hdGVyX3Bvc2l0aW9uID0gZmxvYXRlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGJvdW5kaW5nX3Bvc2l0aW9uID0gYm91bmRpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgIGZsb2F0ZXJfbGVmdCA9IGZsb2F0ZXJfcG9zaXRpb24ubGVmdDtcblxuICAgICAgICAgICAgaWYgKF8uc3RhcnRpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzdGFydGluZ19wb2ludCA9IF8uc3RhcnRpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgc2Nyb2xsX3Bvc2l0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGFydGluZ19wb2ludCA9IGJvdW5kaW5nX3Bvc2l0aW9uLnRvcCArIHNjcm9sbF9wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8uZW5kaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZW5kaW5nX3BvaW50ID0gXy5lbmRpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tICsgc2Nyb2xsX3Bvc2l0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbmRpbmdfcG9pbnQgPSBib3VuZGluZ19wb3NpdGlvbi5ib3R0b20gKyBzY3JvbGxfcG9zaXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXR1cCB0aGUgc3RhcnRpbmcgYW5kIGVuZGluZyBwb2ludHMgaW5jbHVkaW5nIGJ1ZmZlciBhcmVhc1xuICAgICAgICBwb3NpdGlvbl90b3AgPSBzY3JvbGxfcG9zaXRpb24gKyBmbG9hdF9wb3NpdGlvbjtcbiAgICAgICAgcG9zaXRpb25fYm90dG9tID0gc2Nyb2xsX3Bvc2l0aW9uICsgZmxvYXRfcG9zaXRpb24gKyBmbG9hdGVyLm9mZnNldEhlaWdodDtcblxuICAgICAgICAvLyBEZWNpZGUgd2hhdCBzdGF0ZSB0aGUgZmxvYXRlciBzaG91bGQgYmUgaW4gYmFzZWQgb24gc2Nyb2xsIHBvc2l0aW9uLi4uXG4gICAgICAgIGlmIChwb3NpdGlvbl9ib3R0b20gPj0gZW5kaW5nX3BvaW50KSB7XG4gICAgICAgICAgICBmbG9hdGVyLmNsYXNzTGlzdC5hZGQoJ3BhdXNlJyk7XG4gICAgICAgICAgICBmbG9hdGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3N0aWNreScpO1xuICAgICAgICAgICAgZmxvYXRlci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xuICAgICAgICB9IGVsc2UgaWYgKHBvc2l0aW9uX3RvcCA+PSBzdGFydGluZ19wb2ludCkge1xuICAgICAgICAgICAgZmxvYXRlci5zdHlsZS53aWR0aCA9IGJvdW5kaW5nLm9mZnNldFdpZHRoICsgJ3B4JztcbiAgICAgICAgICAgIGZsb2F0ZXIuc3R5bGUudG9wID0gZmxvYXRfcG9zaXRpb24gKyAncHgnO1xuICAgICAgICAgICAgZmxvYXRlci5zdHlsZS5sZWZ0ID0gYm91bmRpbmdfcG9zaXRpb24ubGVmdCArICdweCc7XG4gICAgICAgICAgICBmbG9hdGVyLmNsYXNzTGlzdC5hZGQoJ3N0aWNreScpO1xuICAgICAgICAgICAgZmxvYXRlci5jbGFzc0xpc3QucmVtb3ZlKCdwYXVzZScpO1xuICAgICAgICB9IGVsc2UgaWYgKHBvc2l0aW9uX3RvcCA8PSBzdGFydGluZ19wb2ludCkge1xuICAgICAgICAgICAgZmxvYXRlci5jbGFzc0xpc3QucmVtb3ZlKCdzdGlja3knKTtcbiAgICAgICAgICAgIGZsb2F0ZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICcnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBUaGUgZXZlbnQgbGlzdGVuZXJzLi4uXG4gICAgT2JqZWN0LmtleXMoXy5ldmVudHMpLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgXy5ldmVudHNbZV0uYWRkRXZlbnRMaXN0ZW5lcihlLCBhY3Rpb24pO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGFjdGlvbik7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGFjdGlvbik7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyogIEVsZW1lbnQucHJvdG90eXBlLmZvbGxvd2VyXG4gKlxuICogIEBzaW5jZSAxLjBcbiAqXG4gKiAgQHBhcmFtIHNldHRpbmdzIE9iamVjdCBUaGUgc2V0dGluZ3MgZm9yIHRoZSBmbG9hdGVyIHRhcmdldCBlbGVtZW50XG4gKiAgQHBvbHlmaWxsIE9iamVjdC5hc3NpZ25cbiAqXG4gKi9cblxuRWxlbWVudC5wcm90b3R5cGUuZm9sbG93ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNldHRpbmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuXG4gICAgLy8gVGhlIGRlZmF1bHQgc2V0dGluZ3NcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIHNlY3Rpb25zOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzZWN0aW9uJylcbiAgICB9O1xuXG4gICAgLy8gQXNzaWduIHNldHRpbmdzIGFzIGRlZmF1bHRzIGlmIHNldHRpbmdzIGFyZSBub3Qgc2V0XG4gICAgaWYgKE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGggPT0gMCkgc2V0dGluZ3MgPSBkZWZhdWx0cztcblxuICAgIC8vIE92ZXJyaWRlIHRoZSBkZWZhdWx0cyB3aXRoIGFueSBkZWZpbmVkIHNldHRpbmdzXG4gICAgdmFyIF8gPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBzZXR0aW5ncyk7XG5cbiAgICAvLyBHbG9iYWwgdmFyaWFibGVzXG4gICAgdmFyIG5hdiA9IHRoaXMsXG4gICAgICAgIGxpbmtzID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKCdzcGFuJyksXG4gICAgICAgIHNlY3Rpb25zID0gXy5zZWN0aW9ucyxcbiAgICAgICAgc2VjdGlvbl9wb3NpdGlvbixcbiAgICAgICAgc2VjdGlvbl9pZCxcbiAgICAgICAgc2VjdGlvbl90b3AsXG4gICAgICAgIHNlY3Rpb25fYm90dG9tO1xuXG4gICAgbGlua3MuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuXG4gICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGxpbmsuZ2V0QXR0cmlidXRlKCdkYXRhLW9uLXBhZ2UtbGluaycpKS5hbmltYXRlU2Nyb2xsKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIGFjdGlvbiA9IGZ1bmN0aW9uIGFjdGlvbihlKSB7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvblxuICAgICAgICB2YXIgc2Nyb2xsX3Bvc2l0aW9uID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AsXG4gICAgICAgICAgICB0YXJnZXRfcG9pbnQgPSBzY3JvbGxfcG9zaXRpb24gKyB2aCgpIC8gMjtcblxuICAgICAgICBzZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChzZWN0aW9uKSB7XG5cbiAgICAgICAgICAgIGlmIChlLnR5cGUgIT0gJ3Njcm9sbCcpIHtcblxuICAgICAgICAgICAgICAgIHNlY3Rpb25fcG9zaXRpb24gPSBzZWN0aW9uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgc2VjdGlvbl90b3AgPSBzZWN0aW9uX3Bvc2l0aW9uLnRvcCArIHNjcm9sbF9wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICBzZWN0aW9uX2JvdHRvbSA9IHNlY3Rpb25fcG9zaXRpb24uYm90dG9tICsgc2Nyb2xsX3Bvc2l0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaWQgPSBzZWN0aW9uLmdldEF0dHJpYnV0ZSgnaWQnKS5zdWJzdHJpbmcoOCksXG4gICAgICAgICAgICAgICAgc2VjdGlvbl90b3AgPSBzZWN0aW9uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHNjcm9sbF9wb3NpdGlvbixcbiAgICAgICAgICAgICAgICBzZWN0aW9uX2JvdHRvbSA9IHNlY3Rpb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tICsgc2Nyb2xsX3Bvc2l0aW9uO1xuXG4gICAgICAgICAgICBpZiAodGFyZ2V0X3BvaW50ID4gc2VjdGlvbl90b3AgJiYgdGFyZ2V0X3BvaW50IDwgc2VjdGlvbl9ib3R0b20pIHtcblxuICAgICAgICAgICAgICAgIGxpbmtzW2lkIC0gMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgbGlua3NbaWQgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBhY3Rpb24pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBhY3Rpb24pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qICBcbiAgICAvLy8vICAtLXwgICAgSU5JVCBKU1xuXG4gICAgKiBTZXQtdXAgSmF2YVNjcmlwdFxuKi9cblxuZnVuY3Rpb24gb25fbG9hZCgpIHtcblx0XHRcdFx0dmFyIGZuID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBmdW5jdGlvbiAoZSkge307XG5cblxuXHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0XHRmbjtcblx0XHRcdFx0fSk7XG59XG5cbi8qICAvLy8vICAtLXwgICAgUmV0dXJuIHdpbmRvdyBzaXplXG5cbiAgICAqIFR3aW4gZnVuY3Rpb25zLCBvbmUgZm9yIHdpZHRoIGFuZCBhbm90aGVyIGZvciBoZWlnaHRcbiovXG5cbmZ1bmN0aW9uIHZ3KCkge1xuXHRcdFx0XHRyZXR1cm4gd2luZG93LmlubmVyV2lkdGg7XG59XG5cbmZ1bmN0aW9uIHZoKCkge1xuXHRcdFx0XHRyZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xufVxuXG4vKiAgLy8vLyAgLS18ICAgIFdpZHRoIEJyZWFrcG9pbnQgLSB0aGUgSlMgZXF1aXZpbGFudCB0byBDU1MgbWVkaWEgcXVlcmllc1xuXG4gICAgKiBFbnN1cmUgYnJlYWtwb2ludCBzZXR0aW5ncyBtYXRjaCB0aG9zZSBzZXQgaW4gdGhlIHN0eWxlc1xuKi9cblxudmFyIHMgPSAncyc7XG52YXIgbSA9ICdtJztcbnZhciBsID0gJ2wnO1xudmFyIHhsID0gJ3hsJztcbnZhciBtYXggPSAnbWF4JztcblxuZnVuY3Rpb24geCh3aWR0aCwgZm4pIHtcblx0XHRcdFx0dmFyIGNhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdFx0dmFyIHJ1bl9vbmNlID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBmYWxzZTtcblxuXG5cdFx0XHRcdHZhciB2YWx1ZTtcblxuXHRcdFx0XHRzd2l0Y2ggKHdpZHRoKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBzOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSA0NTA7YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBtOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSA3Njg7YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBsOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSAxMDI0O2JyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgeGw6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IDE2MDA7YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBtYXg6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IDE5MjA7YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gd2lkdGg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgcnVuID0gZnVuY3Rpb24gcnVuKCkge1xuXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGFsbG93ID0gZmFsc2U7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAodncoKSA+IHZhbHVlKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChydW5fb25jZSA9PT0gdHJ1ZSAmJiBhbGxvdyA9PT0gZmFsc2UpIHJldHVybjtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm4oKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWxsb3cgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAocnVuX29uY2UgPT09IHRydWUgJiYgYWxsb3cgPT09IHRydWUpIHJldHVybjtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWxsb3cgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgcnVuKTtcblx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJ1bik7XG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIHJ1bik7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgLyogIC8vLy8gIC0tfCAgICBBY2NvcmRpb25cbiAgICAgICAgIEBzaW5jZSAxLjBcbiAgICAqL1xuXG4gICAgLy8gQ2hlY2sgR2FsbGVyeSBjb21wb25lbnQgZXhpc3RzIG9uIHBhZ2VcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2hpZnRyLWFjY29yZGlvbl0nKSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgdmFyIGFjY29yZGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb24nKSxcbiAgICAgICAgYWNjb3JkaW9uX3NpbmdsZXMgPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNpbmdsZScpO1xuXG4gICAgYWNjb3JkaW9uX3NpbmdsZXMuZm9yRWFjaChmdW5jdGlvbiAoc2luZ2xlKSB7XG5cbiAgICAgICAgc2luZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgc2luZ2xlLmNsYXNzTGlzdC50b2dnbGUoJ29wZW4nKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qICAvLy8vICAtLXwgICAgQ29va2llXG4gICAgICAgICAqIEhhbmRsZSB0aGUgU2hpZnRyIENvb2tpZSBDb25zZW50XG4gICAgKi9cblxuICAgIC8vICAvLy8vICAtLXwgICAgVGhpcyBpcyB3aGVyZSB3ZSBzZXQgdGhlIGNvb2tpZVxuXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlmdHItY29va2llLW5vdGljZScpID09PSBudWxsKSByZXR1cm47XG5cbiAgICB2YXIgY29va2llX2FjY2VwdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NoaWZ0ci1jb29raWUtYWNjZXB0Jyk7XG4gICAgdmFyIHNoaWZ0cl9jb29raWVfbm90aWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaWZ0ci1jb29raWUtbm90aWNlJyk7XG5cbiAgICBjb29raWVfYWNjZXB0ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc2hpZnRyX2Nvb2tpZV9ub3RpY2UuY2xhc3NMaXN0LmFkZCgnYWNjZXB0ZWQnKTtcblxuICAgICAgICAvLyBQcmVwYXJlIHRoZSBjb29raWVcbiAgICAgICAgdmFyIGNvb2tpZV9uYW1lID0gJ3NoaWZ0cl8nICsgc2hpZnRyLm5hbWUgKyAnX2NvbnNlbnQnO1xuXG4gICAgICAgIGNvb2tpZV9uYW1lID0gY29va2llX25hbWUucmVwbGFjZSgnICcsICdfJyk7XG4gICAgICAgIGNvb2tpZV9uYW1lID0gY29va2llX25hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICB2YXIgY29va2llX2V4cGlyeSA9ICdUaHUsIDE4IERlYyAyMDE5IDEyOjAwOjAwIFVUQyc7XG5cbiAgICAgICAgLy8gU2V0IHRoZSBjb29raWVcbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llX25hbWUgKyAnPScgKyB0cnVlICsgJzsgZXhwaXJlcz0nICsgY29va2llX2V4cGlyeSArICc7IHBhdGg9Lyc7XG5cbiAgICAgICAgLy8gTm93LCByZW1vdmUgdGhlIG5vdGljZVxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNoaWZ0cl9jb29raWVfbm90aWNlLmNsYXNzTGlzdC5yZW1vdmUoJ3Bvc3RlZCcpO1xuICAgICAgICB9LCA3NTApO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzaGlmdHJfY29va2llX25vdGljZSk7XG4gICAgICAgIH0sIDIwMDApO1xuICAgIH0pO1xufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAvKiAgLy8vLyAgLS18ICAgIEZPUk0gSEFORExFUiAwLjUgW0JFVEFdXG4gICAgICAgICAqIFNoaXBzIDEwMCUgZHluYW1pYywgbm90IHRpZWQgdG8gYSBzcGVjaWZpYyBmb3JtLFxuICAgICAgICAgIGFsbG93aW5nIG11bHRpcGxlIGZvcm1zIHRvIHVzZSB0aGUgd2hvbGUgbW9kdWxlXG4gICAgKi9cblxuICAgIC8vICAtLXwgICAgU0VUVElOR1NcbiAgICB2YXIgc2V0dGluZ3MgPSBzaGlmdHIuZm9ybTtcblxuICAgIC8vIFZhbGlkYXRpb24gY2xhc3Nlc1xuICAgIHZhciB2YyA9IHtcbiAgICAgICAgZm9jdXM6ICdmb2N1cycsXG4gICAgICAgIHN1Y2Nlc3M6ICdzdWNjZXNzJyxcbiAgICAgICAgZXJyb3I6ICdlcnJvcidcbiAgICB9O1xuXG4gICAgLy8gIC0tfCAgICBGSUVMRFNcblxuICAgIHZhciBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgdGV4dGFyZWEnKSxcbiAgICAgICAgbGlzdGVkID0gWyduYW1lJywgJ3RleHQnLCAnZW1haWwnXTtcblxuICAgIGlucHV0cy5mb3JFYWNoKGZ1bmN0aW9uIChpbnB1dCkge1xuXG4gICAgICAgIGlmIChsaXN0ZWQuaW5kZXhPZihpbnB1dC50eXBlKSA+PSAwIHx8IGlucHV0Lm5vZGVOYW1lID09ICdURVhUQVJFQScpIHtcblxuICAgICAgICAgICAgLy8gdGFyZ2V0IGlzIGxhYmVsXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gaW5wdXQucHJldmlvdXNFbGVtZW50U2libGluZztcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQodmMuZm9jdXMpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKHZjLmZvY3VzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSAnJztcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NOYW1lID0gJyc7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSAhPSAnJykge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrVmFsaWRpdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQodmMuc3VjY2Vzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhcl92YWxpZGF0aW9uKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQodmMuZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ludmFsaWQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKHZjLmVycm9yKTtcblxuICAgICAgICAgICAgICAgIGRvX3ZhbGlkYXRpb24odGhpcywgdGhpcy52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC50eXBlID09ICdjaGVja2JveCcpIHtcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJfdmFsaWRhdGlvbihpbnB1dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ludmFsaWQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGRvX3ZhbGlkYXRpb24odGhpcywgdGhpcy52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gZG9fdmFsaWRhdGlvbihpbnB1dCwgbWVzc2FnZSkge1xuXG4gICAgICAgIHZhciBtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG4gICAgICAgIG0uY2xhc3NMaXN0LmFkZCgndmFsaWRhdGlvbicpO1xuICAgICAgICBtLmlubmVySFRNTCA9IG1lc3NhZ2U7XG4gICAgICAgIGlucHV0LnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQobSk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtLmNsYXNzTGlzdC5hZGQoJ3BvcCcpO1xuICAgICAgICB9LCA0MDApO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJfdmFsaWRhdGlvbihpbnB1dCk7XG4gICAgICAgIH0sIDYwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyX3ZhbGlkYXRpb24oaW5wdXQpIHtcblxuICAgICAgICB2YXIgbmV4dEVsID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChuZXh0RWwpIHtcblxuICAgICAgICAgICAgaWYgKG5leHRFbC5ub2RlTmFtZSA9PSAnU1BBTicpIHtcblxuICAgICAgICAgICAgICAgIG5leHRFbC5jbGFzc0xpc3QucmVtb3ZlKCdwb3AnKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKG5leHRFbCk7XG4gICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qICAtLXwgICAgSGFuZGxlIHRoZSBzdWJtaXNzaW9uXG4gICAgICAgICAgKiBJRSAxMC0xMTogZG9lcyBub3Qgc3VwcG9ydCBqc29uIGFzIHJlc3BvbnNlVHlwZVxuICAgICAgICAqIEZpcmVmb3ggNi05OiBkb2VzIG5vdCBzdXBwb3J0IGpzb24gYXMgcmVzcG9uc2VUeXBlXG4gICAgICAgICogRmlyZWZveCA2LTExOiBkb2VzIG5vdCBzdXBwb3J0IC50aW1lb3V0IGFuZCAub250aW1lb3V0XG4gICAgICAgICogQ2hyb21lIDctMjg6IGRvZXMgbm90IHN1cHBvcnQgLnRpbWVvdXQgYW5kIC5vbnRpbWVvdXRcbiAgICAgICAgKiBDaHJvbWUgNy0zMDogZG9lcyBub3Qgc3VwcG9ydCBqc29uIGFzIHJlc3BvbnNlVHlwZVxuICAgICAgICAqIFNhZmFyaSA1LTc6IGRvZXMgbm90IHN1cHBvcnQgLnRpbWVvdXQgYW5kIC5vbnRpbWVvdXRcbiAgICAgICAgKiBTYWZhcmkgNi4xLTc6IGRvZXMgbm90IHN1cHBvcnQganNvbiBhcyByZXNwb25zZVR5cGVcbiAgICAgKi9cblxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybScpKSB7XG4gICAgICAgIHZhciBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0nKTtcblxuICAgICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInN1Ym1pdFwiXScpLmNsYXNzTGlzdC5hZGQoJ3N1Ym1pdHRpbmcnKTtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XG5cbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCA0MDApIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIF9kYXRhID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwic3VibWl0XCJdJykuY2xhc3NMaXN0LnJlbW92ZSgnc3VibWl0dGluZycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChfZGF0YS5zZW50KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRvX3N1Ym1pc3Npb24odHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicsIHhocik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoc2V0dGluZ3MueGhyX2Vycm9yKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgc2V0dGluZ3MuYWpheCk7XG4gICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZG9fc3VibWlzc2lvbih0eXBlKSB7XG5cbiAgICAgICAgdmFyIGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG5cbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIGhlYWRpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyksXG4gICAgICAgICAgICBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLFxuICAgICAgICAgICAgZXJyb3JfcmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuICAgICAgICAgICAgY2xvc2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdzdWJtaXNzaW9uJyk7XG5cbiAgICAgICAgLy8gU2VsZWN0IGNvcnJlc3BvbmRpbmcgY29uZmlybWF0aW9uIGNvbnRlbnRcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgJ1BPU1QnIHx8ICdNQUlMJzpcbiAgICAgICAgICAgICAgICB2YXIgYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgaDogc2V0dGluZ3MuZXJyb3JfaGVhZGluZyxcbiAgICAgICAgICAgICAgICAgICAgYzogc2V0dGluZ3MuZXJyb3JfYm9keVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZXJyb3JfcmVmLmlubmVySFRNTCA9ICdFUlJPUiBSRUY6ICcgKyB0eXBlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHZhciBib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBoOiBzZXR0aW5ncy5zdWNjZXNzX2hlYWRpbmcsXG4gICAgICAgICAgICAgICAgICAgIGM6IHNldHRpbmdzLnN1Y2Nlc3NfYm9keVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBoZWFkaW5nLmlubmVySFRNTCA9IGJvZHkuaDtcbiAgICAgICAgY29udGVudC5pbm5lckhUTUwgPSBib2R5LmM7XG5cbiAgICAgICAgY2xvc2VyLmlubmVySFRNTCA9ICdDbG9zZSc7XG4gICAgICAgIGNsb3Nlci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2Nsb3NlLXN1Ym1pc3Npb24nKTtcbiAgICAgICAgY2xvc2VyLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbicpO1xuXG4gICAgICAgIHdyYXAuYXBwZW5kQ2hpbGQoaGVhZGluZyk7XG4gICAgICAgIHdyYXAuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgICAgIHdyYXAuYXBwZW5kQ2hpbGQoZXJyb3JfcmVmKTtcbiAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh3cmFwKTtcbiAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZChjbG9zZXIpO1xuXG4gICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQobWVzc2FnZSk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgfSwgMTAwKTtcblxuICAgICAgICBjbG9zZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGF1dG9fY2xlYXIpO1xuICAgICAgICAgICAgY2xlYXJfc3VibWlzc2lvbihtZXNzYWdlLCB0eXBlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGVycm9yX3R5cGVzID0gWydQT1NUJywgJ01BSUwnXSxcbiAgICAgICAgICAgIGF1dG9fY2xlYXJfZGVsYXkgPSB2b2lkIDA7XG5cbiAgICAgICAgaWYgKGVycm9yX3R5cGVzLmluZGV4T2YodHlwZSkgPT0gLTEpIHtcbiAgICAgICAgICAgIGF1dG9fY2xlYXJfZGVsYXkgPSA4MTAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXV0b19jbGVhcl9kZWxheSA9IDMwMDAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGF1dG9fY2xlYXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgY2xlYXJfc3VibWlzc2lvbihtZXNzYWdlLCB0eXBlKTtcbiAgICAgICAgfSwgYXV0b19jbGVhcl9kZWxheSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJfc3VibWlzc2lvbihlbCwgYWN0aW9uKSB7XG5cbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICB2YXIgaTtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlZC5pbmRleE9mKGlucHV0c1tpXS50eXBlKSA+IDAgfHwgaW5wdXRzW2ldLm5vZGVOYW1lID09ICdURVhUQVJFQScpIHtcblxuICAgICAgICAgICAgICAgICAgICBpbnB1dHNbaV0udmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzW2ldLmNsYXNzTmFtZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dHNbaV0ucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc05hbWUgPSAnJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0c1tpXS50eXBlID09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzW2ldLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICB9XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qICAvLy8vICAtLXwgICAgR2FsbGVyeVxuICAgICAgICAgKiBCcmFuZCBuZXcgY29tcG9uZW50XG4gICAgKi9cblxuICAgIC8vIENoZWNrIEdhbGxlcnkgY29tcG9uZW50IGV4aXN0cyBvbiBwYWdlXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNoaWZ0ci1nYWxsZXJ5XScpID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyBDcmVhdGUgdGhlIHZpZXdlclxuICAgIHZhciB2aWV3ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgdmlld2VyX2ltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgdmlld2VyLmNsYXNzTGlzdC5hZGQoJ2dhbGxlcnktdmlld2VyJyk7XG5cbiAgICB2aWV3ZXIuYXBwZW5kQ2hpbGQodmlld2VyX2ltZyk7XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdlcik7XG5cbiAgICB2YXIgZ2FsbGVyeV9saXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbGxlcnktbGlzdCcpLFxuICAgICAgICBnYWxsZXJ5X2ltYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXNoaWZ0ci1nYWxsZXJ5LWltYWdlXScpO1xuXG4gICAgdmFyIHNvdXJjZXMgPSBbXTtcblxuICAgIC8vIExpc3RlbiBmb3IgaW1hZ2UgY2xpY2tzXG4gICAgZ2FsbGVyeV9pbWFnZXMuZm9yRWFjaChmdW5jdGlvbiAoaW1hZ2UpIHtcblxuICAgICAgICBzb3VyY2VzLnB1c2goaW1hZ2Uuc3JjKTtcblxuICAgICAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmlld2VyX2ltZy5zcmMgPSBpbWFnZS5zcmM7XG5cbiAgICAgICAgICAgIGlmICh2aWV3ZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNwbGF5JykpIHJldHVybjtcblxuICAgICAgICAgICAgdmlld2VyLmNsYXNzTGlzdC5hZGQoJ3ByZScpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2aWV3ZXIuY2xhc3NMaXN0LmFkZCgnZGlzcGxheScpO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB2YXIgY291bnRlciA9IHNvdXJjZXMubGVuZ3RoO1xuXG4gICAgLy8gQ2xvc2UgdGhlIHZpZXdlclxuICAgIHZpZXdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2aWV3ZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGlzcGxheScpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZpZXdlci5jbGFzc0xpc3QucmVtb3ZlKCdwcmUnKTtcbiAgICAgICAgfSwgNjAwKTtcbiAgICB9KTtcblxuICAgIHZpZXdlcl9pbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG5cbiAgICAvLyBTd2l0Y2ggYmV0d2VlbiBpbWFnZXMgaW4gdGhlIHZpZXdlclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgIHZhciBrZXkgPSBlLmtleUNvZGUgfHwgZS53aGljaCxcbiAgICAgICAgICAgIGN1cnJlbnRfcG9zaXRpb24gPSBzb3VyY2VzLmluZGV4T2Yodmlld2VyX2ltZy5zcmMpO1xuXG4gICAgICAgIC8vIExlZnQgYXJyb3dcbiAgICAgICAgaWYgKGtleSA9PSAzNykge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRfcG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICAgIHZpZXdlcl9pbWcuc3JjID0gc291cmNlc1tjb3VudGVyIC0gMV07XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZpZXdlcl9pbWcuc3JjID0gc291cmNlc1tjdXJyZW50X3Bvc2l0aW9uIC0gMV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSaWdodCBhcnJvd1xuICAgICAgICBpZiAoa2V5ID09IDM5KSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudF9wb3NpdGlvbiArIDEgPT0gY291bnRlcikge1xuXG4gICAgICAgICAgICAgICAgdmlld2VyX2ltZy5zcmMgPSBzb3VyY2VzWzBdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2aWV3ZXJfaW1nLnNyYyA9IHNvdXJjZXNbY3VycmVudF9wb3NpdGlvbiArIDFdO1xuICAgICAgICB9XG4gICAgfSk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qICAvLy8vICAtLXwgICAgR0VORVJJQ1xuICAgICAgICAgKiBKdXN0IHNvbWUgbWFnaWNcbiAgICAqL1xuXG4gICAgLy8gIC8vLy8gIC0tfCAgICBUT0dHTEUgSElEREVOIE1FTlVcblxuXG4gICAgdmFyIHRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2dnbGUnKSxcbiAgICAgICAgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4tbmF2JyksXG4gICAgICAgIHN1Yl9uYXZzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGkucGFyZW50JyksXG4gICAgICAgIGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKSxcbiAgICAgICAgYm9keSA9IGRvY3VtZW50LmJvZHk7XG5cbiAgICAvL2xldCBoZWFkZXJfdHJhbnNpdGlvbl9oZWlnaHQgPSAoIG5hdi5vZmZzZXRIZWlnaHQgLyAxMCApICsgNyArICdyZW0nO1xuICAgIHZhciBoZWFkZXJfdHJhbnNpdGlvbl9oZWlnaHQgPSAnMTAwdmgnO1xuXG4gICAgdmFyIHN0b3AgPSBmdW5jdGlvbiBzdG9wKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9O1xuXG4gICAgdmFyIHRvZ2dsZV9tZW51ID0gZnVuY3Rpb24gdG9nZ2xlX21lbnUoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKCd0cmFuc2l0aW9uJyk7XG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnbm8tc2Nyb2xsJyk7XG5cbiAgICAgICAgaWYgKGhlYWRlci5vZmZzZXRIZWlnaHQgPiBuYXYub2Zmc2V0SGVpZ2h0KSB7XG4gICAgICAgICAgICBoZWFkZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWRlci5zdHlsZS5oZWlnaHQgPSBoZWFkZXJfdHJhbnNpdGlvbl9oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBuYXYuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdycpO1xuICAgIH07XG5cbiAgICB2YXIgdG9nZ2xlX3dpbmRvdyA9IGZ1bmN0aW9uIHRvZ2dsZV93aW5kb3coKSB7XG4gICAgICAgIHRvZ2dsZS5jbGFzc0xpc3QucmVtb3ZlKCd0cmFuc2l0aW9uJyk7XG4gICAgICAgIGhlYWRlci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xuICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXNjcm9sbCcpO1xuICAgICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgIH07XG5cbiAgICB4KG0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdG9nZ2xlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlX21lbnUpO1xuICAgICAgICBuYXYucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdG9wKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlX3dpbmRvdyk7XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICB0b2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVfbWVudSk7XG4gICAgICAgIG5hdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN0b3ApO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVfd2luZG93KTtcbiAgICB9LCB0cnVlKTtcblxuICAgIHgobSwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHN1Yl9uYXZzLmZvckVhY2goZnVuY3Rpb24gKHN1Yikge1xuXG4gICAgICAgICAgICB2YXIgbGluayA9IHN1Yi5jaGlsZHJlblswXSxcbiAgICAgICAgICAgICAgICBtZW51ID0gc3ViLmNoaWxkcmVuWzFdLFxuICAgICAgICAgICAgICAgIHJlbW92ZV9vcGVuID0gdm9pZCAwO1xuXG4gICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlbW92ZV9vcGVuKTtcblxuICAgICAgICAgICAgICAgIGlmIChzdWIuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3ViLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAgICAgICAgIHJlbW92ZV9vcGVuID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Yi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChyZW1vdmVfb3Blbik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWVudS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29wZW4gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3ViLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gIC8vLy8gIC0tfCAgICBTSVpFIFVQIFNWRyBMT0dPXG5cblxuICAgIC8vY29uc3QgdGhlX2xvZ28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3RoZV9sb2dvJyApLFxuICAgIC8vICAgICB2aWV3Ym94ID0gdGhlX2xvZ28uZ2V0QXR0cmlidXRlKCAndmlld0JveCcgKSxcbiAgICAvLyAgICAgdmFsdWVzID0gdmlld2JveC5zcGxpdCggJyAnICksXG4gICAgLy8gICAgIHJhdGlvID0gdmFsdWVzWzJdIC8gdmFsdWVzWzNdLFxuICAgIC8vICAgICB3aWR0aCA9ICggdGhlX2xvZ28ucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgLyAxMCApICogcmF0aW87XG5cbiAgICAvLyB0aGVfbG9nby5zdHlsZS53aWR0aCA9IGAkeyB3aWR0aCB9cmVtYDtcblxuXG4gICAgLy8gIC8vLy8gIC0tfCAgICBCTE9HIFNUSUNLWSBTSURFQkFSXG5cblxuICAgIHgobCwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBzaWRlYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJsb2ctc2lkZWJhcicpLFxuICAgICAgICAgICAgYmxvZ19sYXlvdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmxvZy1sYXlvdXQgPiBkaXYnKTtcblxuICAgICAgICBpZiAoc2lkZWJhciA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBzaWRlYmFyX3dpZHRoID0gc2lkZWJhci5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgIHNpZGViYXJfcG9zID0gc2lkZWJhci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgIGJsb2dfbGF5b3V0X3BvcyA9IGJsb2dfbGF5b3V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciBjdXJyX3BvcyA9IHdpbmRvdy5zY3JvbGxZO1xuXG4gICAgICAgICAgICBpZiAoY3Vycl9wb3MgKyBzaWRlYmFyLm9mZnNldEhlaWdodCArIGhlYWRlci5vZmZzZXRIZWlnaHQgKyAyMCA+PSBibG9nX2xheW91dF9wb3MuYm90dG9tKSB7XG5cbiAgICAgICAgICAgICAgICBzaWRlYmFyLmNsYXNzTGlzdC5hZGQoJ3BhdXNlJyk7XG4gICAgICAgICAgICAgICAgc2lkZWJhci5jbGFzc0xpc3QucmVtb3ZlKCdzdGlja3knKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3Vycl9wb3MgKyBoZWFkZXIub2Zmc2V0SGVpZ2h0ICsgMjAgPj0gYmxvZ19sYXlvdXRfcG9zLnRvcCkge1xuXG4gICAgICAgICAgICAgICAgc2lkZWJhci5zdHlsZS53aWR0aCA9IHNpZGViYXIub2Zmc2V0V2lkdGggKyAncHgnO1xuICAgICAgICAgICAgICAgIHNpZGViYXIuc3R5bGUudG9wID0gaGVhZGVyLm9mZnNldEhlaWdodCArIDIwICsgJ3B4JztcbiAgICAgICAgICAgICAgICBzaWRlYmFyLnN0eWxlLmxlZnQgPSBzaWRlYmFyX3Bvcy5sZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICBzaWRlYmFyLmNsYXNzTGlzdC5hZGQoJ3N0aWNreScpO1xuICAgICAgICAgICAgICAgIHNpZGViYXIuY2xhc3NMaXN0LnJlbW92ZSgncGF1c2UnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBzaWRlYmFyLmNsYXNzTGlzdC5yZW1vdmUoJ3N0aWNreScpO1xuICAgICAgICAgICAgICAgIHNpZGViYXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyAgLy8vLyAgLS18ICAgIENBUk9VU0VMXG5cbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2hpZnRyLWNhcm91c2VsXScpKSB7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZXJvLWNhcm91c2VsJykpIHtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVyby1jYXJvdXNlbCAuY29udGVudCcpLmNsYXNzTGlzdC5hZGQoJ2xvYWQnKTtcbiAgICAgICAgICAgICAgICB9LCA4MDApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZXJvLWNhcm91c2VsJykuc2hpZnRyQ2Fyb3VzZWwoe1xuICAgICAgICAgICAgICAgIHBhdXNlX29uX21hcmtlcl9ob3ZlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDYwMDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAvKiAgLy8vLyAgLS18ICAgIExBWlkgTE9BREVSIDIuMFxuICAgICAgICAgKiBUaGUgc2Vjb25kIGl0ZXJhdGlvbiBvZiB0aGUgTGF6eSBMb2FkZXJcbiAgICAgICAgKiBOb3cgY29udGFpbmVkIHdpdGhpbiBmdW5jdGlvblxuICAgICAgICAqIEhhbmRsZXMgaW1nLCBpZnJhbWUgYW5kIGJhY2tncm91bmQtaW1hZ2VzIGFsbCBpbiBvbmVcbiAgICAgICAgKiBVcGRhdGVkIHRvIEVTNiB3aXRoIGFycm93IGZ1bmN0aW9ucyBhbmQgaW50ZXJwb2xhdGlvblxuICAgICovXG5cbiAgICB2YXIgbGF6eUNvbnRlbnQgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5sYXp5JykpLFxuICAgICAgICBsaXN0ZWQgPSBbJ0lNRycsICdJRlJBTUUnXTtcblxuICAgIGlmICgnSW50ZXJzZWN0aW9uT2JzZXJ2ZXInIGluIHdpbmRvdykge1xuXG4gICAgICAgIHZhciBsYXp5T2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKGVudHJpZXMsIG9ic2VydmVyKSB7XG5cbiAgICAgICAgICAgIGVudHJpZXMuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlbnRyeS5pc0ludGVyc2VjdGluZykge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXp5SXRlbSA9IGVudHJ5LnRhcmdldDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVkLmluZGV4T2YobGF6eUl0ZW0ubm9kZU5hbWUpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhenlJdGVtLnNyYyA9IGxhenlJdGVtLmRhdGFzZXQuc3JjO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGF6eUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbGF6eScpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGF6eUl0ZW0uY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO2xhenlJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2xhenknKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxhenlPYnNlcnZlci51bm9ic2VydmUobGF6eUl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCB7IHJvb3RNYXJnaW46ICcwcHggMHB4ICcgKyB3aW5kb3cuaW5uZXJIZWlnaHQgKyAncHggMHB4JyB9KTtcblxuICAgICAgICBsYXp5Q29udGVudC5mb3JFYWNoKGZ1bmN0aW9uIChsYXp5SXRlbSkge1xuICAgICAgICAgICAgbGF6eU9ic2VydmVyLm9ic2VydmUobGF6eUl0ZW0pO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIHZhciBhY3RpdmUgPSBmYWxzZSxcbiAgICAgICAgICAgIGxhenlMb2FkID0gZnVuY3Rpb24gbGF6eUxvYWQoKSB7XG5cbiAgICAgICAgICAgIGlmIChhY3RpdmUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBsYXp5Q29udGVudC5mb3JFYWNoKGZ1bmN0aW9uIChsYXp5SXRlbSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGF6eUl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIDw9IHdpbmRvdy5pbm5lckhlaWdodCAmJiBsYXp5SXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gPj0gd2luZG93LmlubmVySGVpZ2h0ICYmIGdldENvbXB1dGVkU3R5bGUobGF6eUl0ZW0pLmRpc3BsYXkgIT0gJ25vbmUnKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVkLmluZGV4T2YobGF6eUl0ZW0ubm9kZU5hbWUpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF6eUl0ZW0uc3JjID0gbGF6eUl0ZW0uZGF0YXNldC5zcmM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhenlJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2xhenknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXp5SXRlbS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7bGF6eUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbGF6eScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhenlDb250ZW50ID0gbGF6eUNvbnRlbnQuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtICE9PSBsYXp5SXRlbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXp5Q29udGVudC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBsYXp5TG9hZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsYXp5TG9hZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGxhenlMb2FkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgbGF6eUxvYWQpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbGF6eUxvYWQpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBsYXp5TG9hZCk7XG4gICAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgLyogIC8vLy8gIC0tfCAgICBHT09HTEUgTUFQUyBBUEkgTEFaWSBMT0FERVJcbiAgICAgICAgICogVGhlIGZ1bmN0aW9uIGlzIHNwbGl0LCBtZWFuaW5nIGxhenkgbG9hZGluZyBcbiAgICAgICAgICBjYW4gYmUgdG9nZ2xlZCBmb3IgZGlmZXJlbnQgcGFnZXMgaWYgbmVjZXNzYXJ5XG4gICAgKi9cblxuICAgIGZ1bmN0aW9uIG1hcHNfYXBpX2xhenlfbG9hZGVyKGtleSkge1xuXG4gICAgICAgIGlmIChhcGlfa2V5KSB7XG5cbiAgICAgICAgICAgIGlmIChQSFBfUEFHRV9JRCA9PSBTVEFUSUNfUEFHRV9JRCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHdpbmRvd19oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIG1hcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGFsZi1tYXBcIiksXG4gICAgICAgICAgICAgICAgICAgIGFwaV91cmwgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2pzP2NhbGxiYWNrPWluaXRpYWxpemUma2V5PScgKyBrZXk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJ0ludGVyc2VjdGlvbk9ic2VydmVyJyBpbiB3aW5kb3cpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RNYXJnaW46IHdpbmRvd19oZWlnaHQgKyAncHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyZXNob2xkOiAwXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChlbnRyaWVzLCBvYnNlcnZlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzSW50ZXJzZWN0aW5nID0gdHlwZW9mIGVudHJpZXNbMF0uaXNJbnRlcnNlY3RpbmcgPT09ICdib29sZWFuJyA/IGVudHJpZXNbMF0uaXNJbnRlcnNlY3RpbmcgOiBlbnRyaWVzWzBdLmludGVyc2VjdGlvblJhdGlvID4gMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzSW50ZXJzZWN0aW5nKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LnNyYyA9IGFwaV91cmw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKG1hcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUobWFwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbGF6eU1hcCA9IGZ1bmN0aW9uIGxhenlNYXAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPD0gd2luZG93LmlubmVySGVpZ2h0ICogMiAmJiBtYXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tID49IDAgJiYgZ2V0Q29tcHV0ZWRTdHlsZShtYXApLmRpc3BsYXkgIT09ICdub25lJykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVfc2NyaXB0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGxhenlNYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxhenlNYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgbGF6eU1hcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGxhenlNYXApO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbGF6eU1hcCk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGxhenlNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgY3VycmVudCBwYWdlIGRvZXNuJ3QgbWF0Y2gsIGxvYWQgaW1tZWRpYXRlbHlcblxuICAgICAgICAgICAgICAgIGNyZWF0ZV9zY3JpcHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZV9zY3JpcHQoKSB7XG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgICBzY3JpcHQuc3JjID0gYXBpX3VybDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcHNfYXBpX2xhenlfbG9hZGVyKCdBSXphU3lCOW5yX29USDFSdFRnWVdHWHhaajZNU05XLXliNmhFN2MnKTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qICAvLy8vICAtLXwgICAgT1JQSEFOXG4gICAgICAgICAqIFNheSBnb29kYnllIHRvIG9ycGhhbiBjaGlsZHJlbiBpbiB0ZXh0O1xuICAgICAgICAgIGJlIGl0IGhlYWRpbmdzLCBwYXJhZ3JhcGhzLCBsaXN0IGl0ZW1zIG9yIHNwYW5zLlxuICAgICAgICAgKiBFeGNsdWRlIGVsZW1lbnRzIHdpdGggZGF0YS1vcnBoYW4gYXR0cmlidXRlXG4gICAgICovXG5cbiAgICAvLyBDb2xsZWN0IHRleHQgZWxlbWVudHNcbiAgICB2YXIgZ3JvdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1vcnBoYW5dJyk7XG5cbiAgICAvLyBUaGUgTG9vcFxuICAgIGdyb3VwLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG5cbiAgICAgICAgLy8gQXNzaWduIHRleHQgY29udGVudFxuICAgICAgICB2YXIgY29udGVudCA9IGVsLmlubmVySFRNTCxcbiAgICAgICAgICAgIG5ld05vZGUgPSBbXTtcblxuICAgICAgICAvLyBUYXJnZXQgZWxlbWVudHMgd2l0aCBicmVhayB0YWdzXG4gICAgICAgIGlmIChjb250ZW50LmluZGV4T2YoJzxicj4nKSA+PSAwICYmIGNvbnRlbnQuaW5kZXhPZignICcpID49IDApIHtcbiAgICAgICAgICAgIHZhciB0ZXh0Tm9kZXMgPSBjb250ZW50LnNwbGl0KCc8YnI+Jyk7XG5cbiAgICAgICAgICAgIHRleHROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGV4dCB3aXRoIG5vIG1vcmUgb3JwaGFucyFcbiAgICAgICAgICAgICAgICBuZXdOb2RlLnB1c2gobm9fb3JwaGFuKG5vZGUpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBSZWpvaW4gd2hvbGUgZWxlbWVudCBhbmQgdXBkYXRlXG4gICAgICAgICAgICBlbC5pbm5lckhUTUwgPSBuZXdOb2RlLmpvaW4oJzxicj4nKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZW50LmluZGV4T2YoJyAnKSA+PSAwKSB7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0ZXh0IHdpdGggbm8gbW9yZSBvcnBoYW5zIVxuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gbm9fb3JwaGFuKGNvbnRlbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBSZXBsYWNlIHNwYWNlIHdpdGggJm5ic3A7XG4gICAgZnVuY3Rpb24gbm9fb3JwaGFuKGVsKSB7XG5cbiAgICAgICAgLy8gR2V0IGxhc3Qgc3BhY2UgcG9zaXRpb25cbiAgICAgICAgdmFyIHNwYWNlID0gZWwubGFzdEluZGV4T2YoJyAnKTtcblxuICAgICAgICAvLyBEbyB0aGUgbWFnaWNcbiAgICAgICAgcmV0dXJuIGVsLnNsaWNlKDAsIHNwYWNlKSArIGVsLnNsaWNlKHNwYWNlKS5yZXBsYWNlKCcgJywgJyZuYnNwOycpO1xuICAgIH1cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgLyogIC8vLy8gIC0tfCAgICBQT1BVUFNcbiAgICAgICAgICogQmFzaWMgZnVuY3Rpb25hbGl0eSB0byBoYW5kbGUgb3BlbmluZyBhbiBjbG9zaW5nXG4gICAgICAgICAgb2YgcG9wdXAgZWxlbWVudHMuXG4gICAgICAgICogQ2FuIGhhbmRsZSBtdWx0aXBsZSBwb3B1cHMgcGVyIHBhZ2VcbiAgICAqL1xuXG4gICAgdmFyIG9wZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcub3BlbicpLFxuICAgICAgICBjbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy54JyksXG4gICAgICAgIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuXG4gICAgb3Blbi5mb3JFYWNoKGZ1bmN0aW9uIChvcGVuZXIpIHtcbiAgICAgICAgb3BlbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBvcGVuZXIuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4nKSxcbiAgICAgICAgICAgICAgICBwb3B1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXBvcHVwPVwiJyArIGluc3RhbmNlICsgJ1wiXScpO1xuXG4gICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKCdwb3B1cC1hcHBlYXInKTtcbiAgICAgICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnbm8tc2Nyb2xsJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY2xvc2UuZm9yRWFjaChmdW5jdGlvbiAoY2xvc2VyKSB7XG4gICAgICAgIGNsb3Nlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIHBvcHVwID0gY2xvc2VyLnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLWRpc2FwcGVhcicpO1xuICAgICAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCduby1zY3JvbGwnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtYXBwZWFyJyk7XG4gICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtZGlzYXBwZWFyJyk7XG4gICAgICAgICAgICB9LCAxMjAwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsiXX0=
