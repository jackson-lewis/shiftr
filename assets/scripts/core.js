'use strict';

/*  
    ////  --|    INIT JS

    * Set-up JavaScript
*/

/*  ////  --|    Global vars

    * Used throughout the Shiftr JS functions
*/

var header = document.querySelector('.header-primary'),
    head = document.getElementsByTagName('head')[0],
    body = document.body;

function on_load() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (e) {};


    document.addEventListener('DOMContentLoaded', function (e) {
        fn;
    });
}

function createEl(el) {

    return document.createElement(el);
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

//  ////  --|    Admin Shortcut

(function () {

    var alias = { a: 65, e: 69, option: 18 };
    var the_keys = {};

    document.addEventListener('keydown', function (e) {

        the_keys[e.keyCode] = true;

        switch (true) {

            // Admin home
            case the_keys[alias.option] && the_keys[alias.a]:
                open_admin_url(shiftr.shortcuts.admin);
                break;

            // Edit current page
            case the_keys[alias.option] && the_keys[alias.e]:
                if (!shiftr.vars.archive) {
                    open_admin_url(shiftr.shortcuts.edit);
                }
                break;
        }
    });

    document.addEventListener('keyup', function (e) {
        delete the_keys[e.keyCode];
    });

    function open_admin_url(url) {

        // Clear all keys
        the_keys = {};

        // Open the url in a new tab
        window.open(url, '_blank');
    }
})();
'use strict';

/*  ////  --|    Polyfills

    * 
*/

/* 
  Object.assign
  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
*/

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

/* 
  NodeList.prototype.forEach

  https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
*/

if (window.NodeList && !NodeList.prototype.forEach) {

  NodeList.prototype.forEach = Array.prototype.forEach;
}
'use strict';

/*  ////  --|    Element.prototype.accordion( settings = {} )

    * Create an accordion component
*/

Element.prototype.accordion = function () {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    var accordion = this,
        singles = this.querySelectorAll('.single');

    singles.forEach(function (single) {

        single.addEventListener('click', function (e) {
            e.preventDefault();

            single.classList.toggle('open');
        });
    });
};
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

Element.prototype.carousel = function () {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    // The default settings
    var defaults = {
        autoplay: true,
        speed: 4000,
        transition: 800,
        show_markers: true,
        pause_on_marker_hover: true,
        show_arrows: false
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

    if (props.length == 0) return;

    // Create the navigation
    var stage_map = void 0;
    if (show_markers()) {
        stage_map = document.createElement('div');
        stage_map.classList.add('stage-map');

        carousel.appendChild(stage_map);
    }

    // The pause variable
    var pause_loop = false,
        transition_in_progress = false,
        highest_prop_height = 0;

    // Init the Carousel
    for (i = 0; i < props.length; i++) {

        // Main Carousel data
        props[i].dataset.shiftrCarouselProp = i;
        props[i].dataset.shiftrCarouselActive = 'false';

        // Create the markers
        if (show_markers()) {
            var marker = document.createElement('button'),
                inner = document.createElement('span');

            marker.dataset.shiftrCarouselMarker = i;

            // Add marker to navigation element
            marker.appendChild(inner);
            stage_map.appendChild(marker);
        }

        // Find the highest prop
        if (props[i].offsetHeight > highest_prop_height) {
            highest_prop_height = props[i].offsetHeight;
        }
    }

    // Set the stage height, using the height of the highest prop
    stage.style.height = highest_prop_height + 'px';

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
    if (images[0].length > 0) {
        get_images(images[0]);
    }

    if (props.length > 1) {
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
            setTimeout(function () {
                markers[active_prop_id].classList.remove('active');
            }, _.transition);
        }

        // If on the last prop
        if (active_prop_id == props.length - 1) {

            // Set new prop
            props[0].style.zIndex = 150;
            props[0].classList.add('active');
            props[0].dataset.shiftrCarouselActive = 'true';

            setTimeout(function () {
                props[0].style.zIndex = '';

                if (show_markers()) {
                    markers[0].classList.add('active');
                }
            }, _.transition);

            // Standard switch
        } else {

            var next_prop = active_prop.nextElementSibling,
                next_prop_id = parseInt(next_prop.dataset.shiftrCarouselProp, 10);

            next_prop.classList.add('active');
            next_prop.dataset.shiftrCarouselActive = 'true';

            setTimeout(function () {
                if (show_markers()) {
                    markers[next_prop_id].classList.add('active');
                }
            }, _.transition);

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

            marker.addEventListener('click', function (e) {
                e.preventDefault();

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

                    // Set prop
                    props[selected_prop_id].style.zIndex = 150;
                    props[selected_prop_id].classList.add('active');
                    props[selected_prop_id].dataset.shiftrCarouselActive = 'true';

                    // Continue remove
                    active_prop.dataset.shiftrCarouselActive = 'false';
                    setTimeout(function () {
                        active_prop.classList.remove('active');
                        props[selected_prop_id].style.zIndex = '';

                        markers[active_prop_id].classList.remove('active');
                        markers[selected_prop_id].classList.add('active');

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

                var selected_prop = props[marker.dataset.shiftrCarouselMarker],
                    selected_prop_id = marker.dataset.shiftrCarouselMarker;

                if (_.pause_on_marker_hover) {
                    pause_loop = true;
                }

                if (images[selected_prop_id]) {
                    get_images(images[selected_prop_id]);
                }
            });

            marker.addEventListener('mouseleave', function () {

                pause_loop = false;
            });
        });
    }

    if (show_arrows()) {
        var loop_on_arrow = function loop_on_arrow() {
            var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';


            // Early exit if transition is in progress
            if (transition_in_progress) {
                pause_loop = false;
                return false;
            }

            // active_prop and active_prop_id are corect
            var active_prop = get_active_prop(),
                active_prop_id = get_active_prop_id(active_prop),
                selected_prop = void 0,
                selected_prop_id = void 0;

            if (direction == 'previous') {

                if (active_prop_id == 0) {

                    var int = props.length - 1;
                    selected_prop = props[int];
                    selected_prop_id = int;
                } else {

                    selected_prop = props[active_prop_id - 1];
                    selected_prop_id = active_prop_id - 1;
                }
            } else {

                if (active_prop_id == props.length - 1) {

                    selected_prop = props[0];
                    selected_prop_id = 0;
                } else {

                    selected_prop = props[active_prop_id + 1];
                    selected_prop_id = active_prop_id + 1;
                }
            }

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

                // Set prop
                props[selected_prop_id].style.zIndex = 150;
                props[selected_prop_id].classList.add('active');
                props[selected_prop_id].dataset.shiftrCarouselActive = 'true';

                if (show_markers()) {
                    markers[active_prop_id].classList.remove('active');
                    markers[selected_prop_id].classList.add('active');
                }

                // Continue remove
                active_prop.dataset.shiftrCarouselActive = 'false';
                setTimeout(function () {
                    active_prop.classList.remove('active');
                    props[selected_prop_id].style.zIndex = '';

                    // Define transition end
                    transition_in_progress = false;
                }, _.transition);
            }

            if (images[selected_prop_id]) {
                get_images(images[selected_prop_id]);
            }

            // Restart loop, if paused
            if (_.autoplay) {
                restart = setTimeout(function () {
                    looping = setInterval(the_loop, _.speed);
                }, _.speed);
            }
        };

        var arrows = document.querySelectorAll('.carousel-arrow');

        arrows[0].addEventListener('click', function (e) {

            loop_on_arrow('previous');
        });

        arrows[1].addEventListener('click', function (e) {

            loop_on_arrow('next');
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

    // Toggle for arrows
    function show_arrows() {
        if (_.show_arrows) {
            return true;
        } else {
            return false;
        }
    }
};
'use strict';

(function (cookie_name) {

    /*  ////  --|    Cookie
         * Handle the Shiftr Cookie Consent
    */

    if (document.cookie.indexOf(cookie_name) == -1) {

        console.log('cookie doesn\'t exist');

        var stylesheet = createEl('link');
        stylesheet.setAttribute('rel', 'stylesheet');
        stylesheet.setAttribute('href', shiftr.theme + '/assets/styles/cookie-notice.css');
        stylesheet.setAttribute('type', 'text/css');
        head.appendChild(stylesheet);

        // Create notice
        var el = document.createElement('div'),
            inner = document.createElement('div'),
            message = document.createElement('p'),
            dismiss = document.createElement('button');

        el.classList = 'shiftr-cookie-notice';

        message.innerHTML = shiftr.cookie.message;

        dismiss.classList.add('button');
        dismiss.setAttribute('id', 'shiftr-cookie-accept');
        dismiss.innerHTML = 'Close';

        inner.appendChild(message);
        inner.appendChild(dismiss);

        el.appendChild(inner);

        document.body.appendChild(el);

        setTimeout(function () {
            el.classList.add('posted');
        }, 1000);

        // Listen for notice acceptance
        var cookie_accepter = document.getElementById('shiftr-cookie-accept');

        cookie_accepter.addEventListener('click', function (e) {
            e.preventDefault();

            var cookie_expiry = 'Thu, 18 Dec 2019 12:00:00 UTC';

            // Set the cookie
            document.cookie = cookie_name + '=' + true + '; expires=' + cookie_expiry + '; path=/';

            // Now, remove the notice
            el.classList.remove('posted');

            setTimeout(function () {
                document.body.removeChild(el);
            }, 1000);
        });
    }
})('shiftr_cookie_' + shiftr.name.toLowerCase().replace(' ', '') + '_accept');
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

/*  ////  --|    Element.prototype.form( settings = {} )

    * Shiftr Form Handler
*/

Element.prototype.form = function () {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    // The default settings
    var defaults = {
        states: true,
        validate: true,
        submission: true,
        targets: ['name', 'text', 'email', 'tel', 'date', 'password'],
        validation_classes: {
            focus: 'field-event-focus',
            success: 'field-event-success',
            error: 'field-event-error'
        },
        settings: shiftr.form
    };

    // Assign settings as defaults if settings are not set
    if (Object.keys(settings).length == 0) settings = defaults;

    // Override the defaults with any defined settings
    var _ = Object.assign(defaults, settings);

    // The main carousel elements
    var form = this,
        inputs = form.querySelectorAll('input, textarea'),
        selects = form.querySelectorAll('select'),
        submit = form.querySelector('input[type="submit"]') || this,
        vc = _.validation_classes;

    // Checker var for requesting form styleshet
    var css_requested = false;

    // Loop all inputs
    inputs.forEach(function (input) {

        if (_.targets.indexOf(input.type) >= 0 || input.nodeName == 'TEXTAREA') {

            // Apply all classes to field wrapper element
            var target = input.parentElement;

            input.addEventListener('focus', function (e) {

                get_stylesheet();

                target.classList.add(vc.focus);
            });

            input.addEventListener('blur', function (e) {

                target.classList.remove(vc.focus);
                target.classList.remove(vc.success);
                target.classList.remove(vc.error);

                if (_.validate && input.value != '') {

                    if (input.checkValidity()) {
                        target.classList.add(vc.success);
                        clear_validation(input);
                    } else {
                        target.classList.add(vc.error);
                    }
                }
            });

            if (_.validate) {

                input.addEventListener('invalid', function (e) {
                    e.preventDefault();

                    target.classList.add(vc.error);

                    do_validation(input, input.validationMessage);
                });
            }
        } else if (input.type == 'checkbox' || input.type == 'radio') {

            if (_.validate) {

                input.addEventListener('change', function (e) {

                    if (input.checked) {
                        clear_validation(input);
                    }
                });

                input.addEventListener('invalid', function (e) {
                    e.preventDefault();

                    do_validation(input, input.validationMessage);
                });
            }
        }
    });

    selects.forEach(function (select) {

        select.addEventListener('change', function (e) {
            select.parentElement.classList.add(vc.success);
        });
    });

    // Construct validation notification
    function do_validation(input, message) {

        var m = createEl('span');

        m.classList.add('validation');
        m.innerHTML = message;
        input.parentElement.appendChild(m);

        setTimeout(function () {
            m.classList.add('pop');
        }, 200);

        setTimeout(function () {
            clear_validation(input);
        }, 6000);
    }

    // Remove validation notification
    function clear_validation(input) {

        var notification = input.parentElement.querySelector('span.validation');

        if (notification) {

            notification.classList.remove('pop');

            setTimeout(function () {
                input.parentElement.removeChild(notification);
            }, 400);
        }
    }

    var submit_hover = function submit_hover(e) {
        get_stylesheet();
    };

    submit.addEventListener('mouseover', submit_hover);

    if (_.submission) {
        var do_message = function do_message() {
            var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


            var message = createEl('div'),
                wrap = createEl('div'),
                heading = createEl('span'),
                content = createEl('p'),
                error_ref = createEl('span'),
                closer = createEl('button');

            message.classList.add('form-submission');

            // Select corresponding confirmation content
            switch (response) {

                // '1' equals true. 
                case '1':
                    var body = {
                        h: _.settings.success_heading,
                        c: _.settings.success_body
                    };
                    break;

                default:
                    var body = {
                        h: _.settings.error_heading,
                        c: _.settings.error_body
                    };
                    error_ref.innerHTML = 'ERROR REF: ' + response;
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
                clear_message(message, response);
            });

            var auto_clear_delay = void 0;

            if (response == '1') {
                auto_clear_delay = 8100;
            } else {
                auto_clear_delay = 30000;
            }

            var auto_clear = setTimeout(function () {

                clear_message(message, response);
            }, auto_clear_delay);
        };

        var clear_message = function clear_message(el, action) {

            if (action == '1') {

                // Empty all fields of values
                for (var i = 0; i < inputs.length; i++) {

                    if (_.targets.indexOf(inputs[i].type) > 0 || inputs[i].nodeName == 'TEXTAREA') {

                        inputs[i].value = '';
                        inputs[i].parentElement.classList.remove(vc.success);
                        inputs[i].parentElement.classList.remove(vc.error);
                    } else if (inputs[i].type == 'checkbox' || inputs[i].type == 'radio') {
                        inputs[i].checked = false;
                    }
                }
            }

            setTimeout(function () {
                el.classList.remove('show');
            }, 100);
        };

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            form.classList.add('send-in-progress');

            var data = new FormData(form),
                xhr = new XMLHttpRequest();

            xhr.onload = function () {

                if (xhr.status >= 200 && xhr.status < 400) {

                    form.classList.remove('send-in-progress');

                    do_message(xhr.responseText);
                } else {

                    do_message('XHR_ERROR', xhr.status);
                }
            };

            xhr.onerror = function () {
                do_message('XHR_ERROR', xhr);
            };

            xhr.open('POST', shiftr.ajax);
            xhr.send(data);
        });
    }

    function get_stylesheet() {

        if (!css_requested) {

            var stylesheet = createEl('link');
            stylesheet.setAttribute('rel', 'stylesheet');
            stylesheet.setAttribute('href', shiftr.theme + '/assets/styles/form.css');
            stylesheet.setAttribute('type', 'text/css');
            head.appendChild(stylesheet);

            css_requested = true;
        }

        submit.removeEventListener('mouseover', submit_hover);
    }
};
'use strict';

/*  ////  --|    Element.prototype.gallery( settings )

    * Scroll document to element
*/

Element.prototype.gallery = function () {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    // The default settings
    var defaults = {
        arrows: true,
        close: true
    };

    // Assign settings as defaults if settings are not set
    if (Object.keys(settings).length == 0) settings = defaults;

    // Override the defaults with any defined settings
    var _ = Object.assign(defaults, settings);

    // Create the viewer
    var viewer = document.createElement('div'),
        viewer_img = document.createElement('img');

    var arrow_previous = void 0,
        arrow_next = void 0;
    if (_.arrows) {

        arrow_previous = document.createElement('button');

        var left_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            left_svg_path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        left_svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        left_svg.setAttribute('viewbox', '0 0 11.29 20');
        left_svg_path.setAttribute('d', 'M1.5,20a1.51,1.51,0,0,1-1.3-.75,1.57,1.57,0,0,1,.3-1.88l6.67-6.66a1,1,0,0,0,0-1.42L.44,2.56A1.5,1.5,0,0,1,2.56.44L10.7,8.58a2,2,0,0,1,0,2.84L2.56,19.56A1.51,1.51,0,0,1,1.5,20Z');
        left_svg.appendChild(left_svg_path);
        arrow_previous.appendChild(left_svg);

        arrow_next = arrow_previous.cloneNode(true);

        arrow_previous.classList.add('previous');
        arrow_previous.setAttribute('data-gallery-control', 'previous');
        arrow_previous.setAttribute('aria-label', 'View the previous image');

        arrow_next.classList.add('next');
        arrow_next.setAttribute('data-gallery-control', 'next');
        arrow_next.setAttribute('aria-label', 'View the next image');

        viewer.appendChild(arrow_previous);
        viewer.appendChild(arrow_next);
    }

    var close = void 0;
    if (_.close) {
        close = document.createElement('button');

        var close_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            close_svg_path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        close_svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        close_svg.setAttribute('viewbox', '0 0 20 20');
        close_svg_path.setAttribute('d', 'M12.83,10.71a1,1,0,0,1,0-1.42l6.73-6.73A1.5,1.5,0,0,0,17.44.44L10.71,7.17a1,1,0,0,1-1.42,0L2.56.44A1.5,1.5,0,0,0,.44,2.56L7.17,9.29a1,1,0,0,1,0,1.42L.53,17.34a1.6,1.6,0,0,0-.16,2.15,1.5,1.5,0,0,0,2.19.07l6.73-6.73a1,1,0,0,1,1.42,0l6.73,6.73a1.5,1.5,0,0,0,2.19-.07,1.6,1.6,0,0,0-.16-2.15Z');
        close_svg.appendChild(close_svg_path);
        close.appendChild(close_svg);

        close.classList.add('close');
        close.setAttribute('data-gallery-control', 'close');
        close.setAttribute('aria-label', 'Close the image');

        viewer.appendChild(close);
    }

    viewer.classList.add('gallery-viewer');

    viewer.appendChild(viewer_img);

    document.body.appendChild(viewer);

    var gallery = this,
        images = gallery.getElementsByTagName('img');

    var sources = [];

    var i = 0;

    // Listen for image clicks

    var _loop = function _loop() {

        var img_in_loop = images[i];
        sources.push(img_in_loop.getAttribute('data-src'));

        img_in_loop.addEventListener('click', function () {

            viewer_img.src = img_in_loop.getAttribute('data-src');

            if (viewer.classList.contains('display')) return;

            viewer.classList.add('pre');

            setTimeout(function () {
                viewer.classList.add('display');
                body.classList.add('no-scroll');
            }, 100);
        });
    };

    for (var i = 0; i < images.length; i++) {
        _loop();
    }

    var counter = sources.length;

    // Close the viewer
    viewer.addEventListener('click', function () {

        viewer.classList.remove('display');
        setTimeout(function () {
            viewer.classList.remove('pre');
            body.classList.remove('no-scroll');
        }, 600);
    });

    viewer_img.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    arrow_previous.addEventListener('click', function (e) {
        e.stopPropagation();

        doPrev();
    });

    arrow_next.addEventListener('click', function (e) {
        e.stopPropagation();

        doNext();
    });

    // Switch between images in the viewer
    document.addEventListener('keydown', function (e) {

        var key = e.keyCode || e.which;

        // Left arrow
        if (key == 37) doPrev();

        // Right arrow
        if (key == 39) doNext();
    });

    // Switch to previous image
    function doPrev() {
        var current_position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getCurrPosition();

        if (current_position == 0) {
            viewer_img.src = sources[counter - 1];
            return;
        }

        viewer_img.src = sources[current_position - 1];
    }

    // Switch to next image
    function doNext() {
        var current_position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getCurrPosition();

        if (current_position + 1 == counter) {
            viewer_img.src = sources[0];
            return;
        }

        viewer_img.src = sources[current_position + 1];
    }

    // Get current viewer position
    function getCurrPosition() {
        return sources.indexOf(viewer_img.getAttribute('src'));
    }
};
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
})();
'use strict';

(function () {

    /*  ////  --|    Orphan
         * Say goodbye to orphan children in text;
          be it headings, paragraphs, list items or spans.
         * Exclude elements with data-orphan attribute
     */

    // Collect text elements
    var group = document.querySelectorAll('p') || [];

    // The Loop
    group.forEach(function (el) {

        // Assign text content
        var content = el.innerHTML,
            newNode = [];

        if (content.length == 0) return;

        // Target elements with break tags
        if (content.indexOf('<br>') >= 0) {
            var textNodes = content.split('<br>');

            textNodes.forEach(function (node) {

                if (node.match(/ /g).length >= 5) {
                    newNode.push(no_orphan(node));
                } else {
                    newNode.push(node);
                }
            });

            // Rejoin whole element and update
            el.innerHTML = newNode.join('<br>');
        } else if (content.match(/ /g).length >= 5) {

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
});
'use strict';

(function () {

    /*  ////  --|    General
         * Just some magic
    */

    //  ////  --|    Forms

    if (document.querySelector('[data-shiftr-form]')) {

        // Define all forms
        var general_form = document.querySelector('.shiftr-form-general');

        if (general_form) general_form.form();
    }

    //  ////  --|    Carousels

    if (document.querySelector('[data-shiftr-carousel]')) {

        // Define all carousels
        var home_carousel = document.querySelector('.hero-carousel');

        if (home_carousel) {

            document.addEventListener('DOMContentLoaded', function () {

                setTimeout(function () {
                    home_carousel.querySelector('.content').classList.add('load');
                }, 800);
            });

            home_carousel.carousel({
                pause_on_marker_hover: false,
                speed: 6000
            });
        }
    }

    //  ////  --|    Galleries

    if (document.querySelector('[data-shiftr-gallery]')) {

        // Define all galleries
        var gallery = document.querySelector('.gallery');

        if (gallery) gallery.gallery();
    }

    //  ////  --|    Accordions

    if (document.querySelector('[data-shiftr-accordion]')) {

        // Define all accordions
        var accordion = document.querySelector('.accordion');

        if (accordion) accordion.accordion();
    }

    //  ////  --|    Primary Logo Sizing

    (function (logo) {

        var viewbox = logo.getAttribute('viewBox'),
            values = viewbox.split(' '),
            ratio = values[2] / values[3],
            width = logo.parentElement.offsetHeight / 10 * ratio;

        logo.style.width = width + 'rem';
    })(document.getElementById('the_logo'));

    //  ////  --|    Posts Sidebar

    x(l, function () {

        var sidebar = document.querySelector('.blog-sidebar');

        if (sidebar) sidebar.floater();
    });
})();
'use strict';

(function () {

    /*  ////  --|    Navigation Primary
         * Just some magic
    */

    //  ////  --|    Top-level variables

    var toggle = document.querySelector('.toggle'),
        nav = document.querySelector('.main-nav'),
        sub_navs = document.querySelectorAll('li.parent');

    //  ////  --|    Toggle hidden navigation

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

    x(l, function () {
        toggle.removeEventListener('click', toggle_menu);
        nav.removeEventListener('click', stop);
        window.removeEventListener('click', toggle_window);
    }, function () {
        toggle.addEventListener('click', toggle_menu);
        nav.addEventListener('click', stop);
        window.addEventListener('click', toggle_window);
    }, true);

    //  ////  --|    Sub-menu

    x(l, function () {

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
    }, function () {

        sub_navs.forEach(function (sub) {

            var link = sub.children[0],
                menu = sub.children[1],
                remove_open = void 0;

            link.addEventListener('click', function (e) {
                e.preventDefault();

                sub.classList.toggle('show');
            });
        });
    });
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwiX3BvbHlmaWxsLmpzIiwiYWNjb3JkaW9uLmpzIiwiYW5pbWF0ZS5qcyIsImNhcm91c2VsLmpzIiwiY29va2llLmpzIiwiZmxvYXRlci5qcyIsImZvbGxvd2VyLmpzIiwiZm9ybS5qcyIsImdhbGxlcnkuanMiLCJsYXp5X2xvYWRlci5qcyIsIm9ycGhhbi5qcyIsIl9nZW5lcmFsLmpzIiwibmF2aWdhdGlvbi1wcmltYXJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLyogIFxuICAgIC8vLy8gIC0tfCAgICBJTklUIEpTXG5cbiAgICAqIFNldC11cCBKYXZhU2NyaXB0XG4qL1xuXG4vKiAgLy8vLyAgLS18ICAgIEdsb2JhbCB2YXJzXG5cbiAgICAqIFVzZWQgdGhyb3VnaG91dCB0aGUgU2hpZnRyIEpTIGZ1bmN0aW9uc1xuKi9cblxudmFyIGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXItcHJpbWFyeScpLFxuICAgIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLFxuICAgIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuXG5mdW5jdGlvbiBvbl9sb2FkKCkge1xuICAgIHZhciBmbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZnVuY3Rpb24gKGUpIHt9O1xuXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZm47XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsKGVsKSB7XG5cbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbCk7XG59XG5cbi8qICAvLy8vICAtLXwgICAgUmV0dXJuIHdpbmRvdyBzaXplXG5cbiAgICAqIFR3aW4gZnVuY3Rpb25zLCBvbmUgZm9yIHdpZHRoIGFuZCBhbm90aGVyIGZvciBoZWlnaHRcbiovXG5cbmZ1bmN0aW9uIHZ3KCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aDtcbn1cblxuZnVuY3Rpb24gdmgoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodDtcbn1cblxuLyogIC8vLy8gIC0tfCAgICBXaWR0aCBCcmVha3BvaW50IC0gdGhlIEpTIGVxdWl2aWxhbnQgdG8gQ1NTIG1lZGlhIHF1ZXJpZXNcblxuICAgICogRW5zdXJlIGJyZWFrcG9pbnQgc2V0dGluZ3MgbWF0Y2ggdGhvc2Ugc2V0IGluIHRoZSBzdHlsZXNcbiovXG5cbnZhciBzID0gJ3MnO1xudmFyIG0gPSAnbSc7XG52YXIgbCA9ICdsJztcbnZhciB4bCA9ICd4bCc7XG52YXIgbWF4ID0gJ21heCc7XG5cbmZ1bmN0aW9uIHgod2lkdGgsIGZuKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmdW5jdGlvbiAoKSB7fTtcbiAgICB2YXIgcnVuX29uY2UgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IGZhbHNlO1xuXG5cbiAgICB2YXIgdmFsdWU7XG5cbiAgICBzd2l0Y2ggKHdpZHRoKSB7XG4gICAgICAgIGNhc2UgczpcbiAgICAgICAgICAgIHZhbHVlID0gNDUwO2JyZWFrO1xuICAgICAgICBjYXNlIG06XG4gICAgICAgICAgICB2YWx1ZSA9IDc2ODticmVhaztcbiAgICAgICAgY2FzZSBsOlxuICAgICAgICAgICAgdmFsdWUgPSAxMDI0O2JyZWFrO1xuICAgICAgICBjYXNlIHhsOlxuICAgICAgICAgICAgdmFsdWUgPSAxNjAwO2JyZWFrO1xuICAgICAgICBjYXNlIG1heDpcbiAgICAgICAgICAgIHZhbHVlID0gMTkyMDticmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhbHVlID0gd2lkdGg7XG4gICAgfVxuXG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIHJ1bigpIHtcblxuICAgICAgICB2YXIgYWxsb3cgPSBmYWxzZTtcblxuICAgICAgICBpZiAodncoKSA+IHZhbHVlKSB7XG5cbiAgICAgICAgICAgIGlmIChydW5fb25jZSA9PT0gdHJ1ZSAmJiBhbGxvdyA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgICAgICAgZm4oKTtcblxuICAgICAgICAgICAgYWxsb3cgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYgKHJ1bl9vbmNlID09PSB0cnVlICYmIGFsbG93ID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG5cbiAgICAgICAgICAgIGFsbG93ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgcnVuKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcnVuKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBydW4pO1xufVxuXG4vLyAgLy8vLyAgLS18ICAgIEFkbWluIFNob3J0Y3V0XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgYWxpYXMgPSB7IGE6IDY1LCBlOiA2OSwgb3B0aW9uOiAxOCB9O1xuICAgIHZhciB0aGVfa2V5cyA9IHt9O1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChlKSB7XG5cbiAgICAgICAgdGhlX2tleXNbZS5rZXlDb2RlXSA9IHRydWU7XG5cbiAgICAgICAgc3dpdGNoICh0cnVlKSB7XG5cbiAgICAgICAgICAgIC8vIEFkbWluIGhvbWVcbiAgICAgICAgICAgIGNhc2UgdGhlX2tleXNbYWxpYXMub3B0aW9uXSAmJiB0aGVfa2V5c1thbGlhcy5hXTpcbiAgICAgICAgICAgICAgICBvcGVuX2FkbWluX3VybChzaGlmdHIuc2hvcnRjdXRzLmFkbWluKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy8gRWRpdCBjdXJyZW50IHBhZ2VcbiAgICAgICAgICAgIGNhc2UgdGhlX2tleXNbYWxpYXMub3B0aW9uXSAmJiB0aGVfa2V5c1thbGlhcy5lXTpcbiAgICAgICAgICAgICAgICBpZiAoIXNoaWZ0ci52YXJzLmFyY2hpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgb3Blbl9hZG1pbl91cmwoc2hpZnRyLnNob3J0Y3V0cy5lZGl0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZGVsZXRlIHRoZV9rZXlzW2Uua2V5Q29kZV07XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBvcGVuX2FkbWluX3VybCh1cmwpIHtcblxuICAgICAgICAvLyBDbGVhciBhbGwga2V5c1xuICAgICAgICB0aGVfa2V5cyA9IHt9O1xuXG4gICAgICAgIC8vIE9wZW4gdGhlIHVybCBpbiBhIG5ldyB0YWJcbiAgICAgICAgd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XG4gICAgfVxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbi8qICAvLy8vICAtLXwgICAgUG9seWZpbGxzXG5cbiAgICAqIFxuKi9cblxuLyogXG4gIE9iamVjdC5hc3NpZ25cbiAgXG4gIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ25cbiovXG5cbmlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiAhPSAnZnVuY3Rpb24nKSB7XG5cbiAgLy8gTXVzdCBiZSB3cml0YWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogZmFsc2UsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LCBcImFzc2lnblwiLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHZhckFyZ3MpIHtcbiAgICAgIC8vIC5sZW5ndGggb2YgZnVuY3Rpb24gaXMgMlxuICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICBpZiAodGFyZ2V0ID09IG51bGwpIHtcbiAgICAgICAgLy8gVHlwZUVycm9yIGlmIHVuZGVmaW5lZCBvciBudWxsXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcblxuICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdO1xuXG4gICAgICAgIGlmIChuZXh0U291cmNlICE9IG51bGwpIHtcbiAgICAgICAgICAvLyBTa2lwIG92ZXIgaWYgdW5kZWZpbmVkIG9yIG51bGxcbiAgICAgICAgICBmb3IgKHZhciBuZXh0S2V5IGluIG5leHRTb3VyY2UpIHtcbiAgICAgICAgICAgIC8vIEF2b2lkIGJ1Z3Mgd2hlbiBoYXNPd25Qcm9wZXJ0eSBpcyBzaGFkb3dlZFxuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChuZXh0U291cmNlLCBuZXh0S2V5KSkge1xuICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdG87XG4gICAgfSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8qIFxuICBOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaFxuXG4gIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlTGlzdC9mb3JFYWNoXG4qL1xuXG5pZiAod2luZG93Lk5vZGVMaXN0ICYmICFOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCkge1xuXG4gIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiAgLy8vLyAgLS18ICAgIEVsZW1lbnQucHJvdG90eXBlLmFjY29yZGlvbiggc2V0dGluZ3MgPSB7fSApXG5cbiAgICAqIENyZWF0ZSBhbiBhY2NvcmRpb24gY29tcG9uZW50XG4qL1xuXG5FbGVtZW50LnByb3RvdHlwZS5hY2NvcmRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNldHRpbmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuXG4gICAgdmFyIGFjY29yZGlvbiA9IHRoaXMsXG4gICAgICAgIHNpbmdsZXMgPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaW5nbGUnKTtcblxuICAgIHNpbmdsZXMuZm9yRWFjaChmdW5jdGlvbiAoc2luZ2xlKSB7XG5cbiAgICAgICAgc2luZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgc2luZ2xlLmNsYXNzTGlzdC50b2dnbGUoJ29wZW4nKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyogIC8vLy8gIC0tfCAgICBFbGVtZW50LnByb3RvdHlwZS5hbmltYXRlU2Nyb2xsKCBkdXJhdGlvbiwgYnVmZmVyIClcblxuICAgICogU2Nyb2xsIGRvY3VtZW50IHRvIGVsZW1lbnRcbiovXG5cbkVsZW1lbnQucHJvdG90eXBlLmFuaW1hdGVTY3JvbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGR1cmF0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAxMDAwO1xuICAgIHZhciBidWZmZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG5cblxuICAgIC8vIFVwZGF0ZSBidWZmZXIgdG8gaW5jbHVkZSBoZWlnaHQgb2YgaGVhZGVyXG4gICAgYnVmZmVyICs9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKS5vZmZzZXRIZWlnaHQ7XG5cbiAgICB2YXIgcnVuID0gdHJ1ZTtcblxuICAgIC8vIFNldHRpbmdzXG4gICAgdmFyIHN0YXJ0X3BvcyA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgICB0YXJnZXRfcG9zID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBzdGFydF9wb3MsXG4gICAgICAgIGRpc3RhbmNlID0gdGFyZ2V0X3BvcyAtIHN0YXJ0X3BvcyxcbiAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZSAtIGJ1ZmZlcixcbiAgICAgICAgY3VycmVudFRpbWUgPSAwLFxuICAgICAgICBpbmNyZW1lbnQgPSAxNi42NjtcblxuICAgIC8vIERvIHRoZSBhbmltYXRpb25cbiAgICB2YXIgYW5pbWF0ZV9zY3JvbGwgPSBmdW5jdGlvbiBhbmltYXRlX3Njcm9sbCgpIHtcblxuICAgICAgICBpZiAocnVuID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICAgIGN1cnJlbnRUaW1lICs9IGluY3JlbWVudDtcblxuICAgICAgICB2YXIgdmFsID0gTWF0aC5lYXNlSW5PdXRRdWFkKGN1cnJlbnRUaW1lLCBzdGFydF9wb3MsIGRpc3RhbmNlLCBkdXJhdGlvbik7XG5cbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gdmFsO1xuXG4gICAgICAgIGlmIChjdXJyZW50VGltZSA8IGR1cmF0aW9uKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGFuaW1hdGVfc2Nyb2xsLCBpbmNyZW1lbnQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEVhc2luZy4uLlxuICAgIE1hdGguZWFzZUluT3V0UXVhZCA9IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XG5cbiAgICAgICAgdCAvPSBkIC8gMjtcblxuICAgICAgICBpZiAodCA8IDEpIHJldHVybiBjIC8gMiAqIHQgKiB0ICsgYjtcblxuICAgICAgICB0LS07XG5cbiAgICAgICAgcmV0dXJuIC1jIC8gMiAqICh0ICogKHQgLSAyKSAtIDEpICsgYjtcbiAgICB9O1xuXG4gICAgLy8gRG8gaW5pdGlhbCBpdGVyYXRpb25cbiAgICBhbmltYXRlX3Njcm9sbCgpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qICAvLy8vICAtLXwgICAgRWxlbWVudC5wcm90b3R5cGUuY2Fyb3VzZWwoIHNldHRpbmdzID0gT2JqZWN0IClcblxuICAgIEBzaW5jZSAxLjBcblxuICAgIEBwb2x5ZmlsbHM6IE9iamVjdC5hc3NpZ25cbiovXG5cbkVsZW1lbnQucHJvdG90eXBlLmNhcm91c2VsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXR0aW5ncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cblxuICAgIC8vIFRoZSBkZWZhdWx0IHNldHRpbmdzXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICAgICAgc3BlZWQ6IDQwMDAsXG4gICAgICAgIHRyYW5zaXRpb246IDgwMCxcbiAgICAgICAgc2hvd19tYXJrZXJzOiB0cnVlLFxuICAgICAgICBwYXVzZV9vbl9tYXJrZXJfaG92ZXI6IHRydWUsXG4gICAgICAgIHNob3dfYXJyb3dzOiBmYWxzZVxuICAgIH07XG5cbiAgICB2YXIgaSA9IDA7XG5cbiAgICAvLyBBc3NpZ24gc2V0dGluZ3MgYXMgZGVmYXVsdHMgaWYgc2V0dGluZ3MgYXJlIG5vdCBzZXRcbiAgICBpZiAoT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aCA9PSAwKSBzZXR0aW5ncyA9IGRlZmF1bHRzO1xuXG4gICAgLy8gT3ZlcnJpZGUgdGhlIGRlZmF1bHRzIHdpdGggYW55IGRlZmluZWQgc2V0dGluZ3NcbiAgICB2YXIgXyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIHNldHRpbmdzKTtcblxuICAgIC8vIFRoZSBtYWluIGNhcm91c2VsIGVsZW1lbnRzXG4gICAgdmFyIGNhcm91c2VsID0gdGhpcyxcbiAgICAgICAgc3RhZ2UgPSB0aGlzLmNoaWxkcmVuWzBdLFxuICAgICAgICBwcm9wcyA9IHRoaXMuY2hpbGRyZW5bMF0uY2hpbGRyZW47XG5cbiAgICBpZiAocHJvcHMubGVuZ3RoID09IDApIHJldHVybjtcblxuICAgIC8vIENyZWF0ZSB0aGUgbmF2aWdhdGlvblxuICAgIHZhciBzdGFnZV9tYXAgPSB2b2lkIDA7XG4gICAgaWYgKHNob3dfbWFya2VycygpKSB7XG4gICAgICAgIHN0YWdlX21hcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBzdGFnZV9tYXAuY2xhc3NMaXN0LmFkZCgnc3RhZ2UtbWFwJyk7XG5cbiAgICAgICAgY2Fyb3VzZWwuYXBwZW5kQ2hpbGQoc3RhZ2VfbWFwKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgcGF1c2UgdmFyaWFibGVcbiAgICB2YXIgcGF1c2VfbG9vcCA9IGZhbHNlLFxuICAgICAgICB0cmFuc2l0aW9uX2luX3Byb2dyZXNzID0gZmFsc2UsXG4gICAgICAgIGhpZ2hlc3RfcHJvcF9oZWlnaHQgPSAwO1xuXG4gICAgLy8gSW5pdCB0aGUgQ2Fyb3VzZWxcbiAgICBmb3IgKGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAvLyBNYWluIENhcm91c2VsIGRhdGFcbiAgICAgICAgcHJvcHNbaV0uZGF0YXNldC5zaGlmdHJDYXJvdXNlbFByb3AgPSBpO1xuICAgICAgICBwcm9wc1tpXS5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsQWN0aXZlID0gJ2ZhbHNlJztcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIG1hcmtlcnNcbiAgICAgICAgaWYgKHNob3dfbWFya2VycygpKSB7XG4gICAgICAgICAgICB2YXIgbWFya2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyksXG4gICAgICAgICAgICAgICAgaW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbiAgICAgICAgICAgIG1hcmtlci5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsTWFya2VyID0gaTtcblxuICAgICAgICAgICAgLy8gQWRkIG1hcmtlciB0byBuYXZpZ2F0aW9uIGVsZW1lbnRcbiAgICAgICAgICAgIG1hcmtlci5hcHBlbmRDaGlsZChpbm5lcik7XG4gICAgICAgICAgICBzdGFnZV9tYXAuYXBwZW5kQ2hpbGQobWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmQgdGhlIGhpZ2hlc3QgcHJvcFxuICAgICAgICBpZiAocHJvcHNbaV0ub2Zmc2V0SGVpZ2h0ID4gaGlnaGVzdF9wcm9wX2hlaWdodCkge1xuICAgICAgICAgICAgaGlnaGVzdF9wcm9wX2hlaWdodCA9IHByb3BzW2ldLm9mZnNldEhlaWdodDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNldCB0aGUgc3RhZ2UgaGVpZ2h0LCB1c2luZyB0aGUgaGVpZ2h0IG9mIHRoZSBoaWdoZXN0IHByb3BcbiAgICBzdGFnZS5zdHlsZS5oZWlnaHQgPSBoaWdoZXN0X3Byb3BfaGVpZ2h0ICsgJ3B4JztcblxuICAgIC8vIEFzc2lnbiBtYXJrZXJzIGFmdGVyIGNyZWF0aW9uXG4gICAgdmFyIG1hcmtlcnMgPSB2b2lkIDA7XG4gICAgaWYgKHNob3dfbWFya2VycygpKSB7XG4gICAgICAgIG1hcmtlcnMgPSBPYmplY3Qua2V5cyhzdGFnZV9tYXAuY2hpbGRyZW4pLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhZ2VfbWFwLmNoaWxkcmVuW2tleV07XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFNldC11cCBmaXJzdCBwcm9wIGFuZCBtYXJrZXJcbiAgICBwcm9wc1swXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICBwcm9wc1swXS5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsQWN0aXZlID0gJ3RydWUnO1xuXG4gICAgaWYgKHNob3dfbWFya2VycygpKSB7XG4gICAgICAgIG1hcmtlcnNbMF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgLy8gR2V0IGFsbCBlbGVtZW50cyBpbiB0aGUgcHJvcFxuICAgIHZhciBpbWFnZXMgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICBpbWFnZXMucHVzaChbXSk7XG5cbiAgICAgICAgdmFyIHByb3BfZWxlbWVudHMgPSBwcm9wc1tpXS5xdWVyeVNlbGVjdG9yQWxsKCcqJyk7XG5cbiAgICAgICAgcHJvcF9lbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuXG4gICAgICAgICAgICBpZiAoZWwubm9kZU5hbWUgPT0gJ0lNRycpIHtcbiAgICAgICAgICAgICAgICBpbWFnZXNbaV0ucHVzaChlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEdldCB0aGUgZmlyc3QgYW5kIHNlY29uZCBwcm9wIGltYWdlc1xuICAgIGlmIChpbWFnZXNbMF0ubGVuZ3RoID4gMCkge1xuICAgICAgICBnZXRfaW1hZ2VzKGltYWdlc1swXSk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZ2V0X2ltYWdlcyhpbWFnZXNbMV0pO1xuICAgICAgICB9LCBfLnNwZWVkIC8gMik7XG4gICAgfVxuXG4gICAgLy8gVGhlIG1haW4gbG9vcFxuICAgIHZhciB0aGVfbG9vcCA9IGZ1bmN0aW9uIHRoZV9sb29wKCkge1xuXG4gICAgICAgIC8vIFBhdXNlIG9uIGhvdmVyXG4gICAgICAgIGlmIChwYXVzZV9sb29wKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgLy8gRWFybHkgZXhpdCBpZiB0cmFuc2l0aW9uIGlzIGluIHByb2dyZXNzXG4gICAgICAgIGlmICh0cmFuc2l0aW9uX2luX3Byb2dyZXNzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgLy8gRGVmaW5lIHRyYW5zaXRpb24gc3RhcnRcbiAgICAgICAgdHJhbnNpdGlvbl9pbl9wcm9ncmVzcyA9IHRydWU7XG5cbiAgICAgICAgLy8gR2V0IGluZm8gb2YgYWN0aXZlIHByb3BcbiAgICAgICAgdmFyIGFjdGl2ZV9wcm9wID0gZ2V0X2FjdGl2ZV9wcm9wKCksXG4gICAgICAgICAgICBhY3RpdmVfcHJvcF9pZCA9IGdldF9hY3RpdmVfcHJvcF9pZChhY3RpdmVfcHJvcCk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFjdGl2ZSBtYXJrZXJcbiAgICAgICAgaWYgKHNob3dfbWFya2VycygpKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBtYXJrZXJzW2FjdGl2ZV9wcm9wX2lkXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0sIF8udHJhbnNpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBvbiB0aGUgbGFzdCBwcm9wXG4gICAgICAgIGlmIChhY3RpdmVfcHJvcF9pZCA9PSBwcm9wcy5sZW5ndGggLSAxKSB7XG5cbiAgICAgICAgICAgIC8vIFNldCBuZXcgcHJvcFxuICAgICAgICAgICAgcHJvcHNbMF0uc3R5bGUuekluZGV4ID0gMTUwO1xuICAgICAgICAgICAgcHJvcHNbMF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICBwcm9wc1swXS5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsQWN0aXZlID0gJ3RydWUnO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBwcm9wc1swXS5zdHlsZS56SW5kZXggPSAnJztcblxuICAgICAgICAgICAgICAgIGlmIChzaG93X21hcmtlcnMoKSkge1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXJzWzBdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIF8udHJhbnNpdGlvbik7XG5cbiAgICAgICAgICAgIC8vIFN0YW5kYXJkIHN3aXRjaFxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB2YXIgbmV4dF9wcm9wID0gYWN0aXZlX3Byb3AubmV4dEVsZW1lbnRTaWJsaW5nLFxuICAgICAgICAgICAgICAgIG5leHRfcHJvcF9pZCA9IHBhcnNlSW50KG5leHRfcHJvcC5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsUHJvcCwgMTApO1xuXG4gICAgICAgICAgICBuZXh0X3Byb3AuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICBuZXh0X3Byb3AuZGF0YXNldC5zaGlmdHJDYXJvdXNlbEFjdGl2ZSA9ICd0cnVlJztcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNob3dfbWFya2VycygpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtlcnNbbmV4dF9wcm9wX2lkXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBfLnRyYW5zaXRpb24pO1xuXG4gICAgICAgICAgICBpZiAoYWN0aXZlX3Byb3BfaWQgPT0gcHJvcHMubGVuZ3RoIC0gMikge1xuICAgICAgICAgICAgICAgIC8vIEFsbCBwcm9wIGltYWdlcyBzaG91bGQgaGF2ZSBsb2FkZWQuLi5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2VzW25leHRfcHJvcF9pZCArIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldF9pbWFnZXMoaW1hZ2VzW25leHRfcHJvcF9pZCArIDFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgYWN0aXZlIHByb3BcbiAgICAgICAgYWN0aXZlX3Byb3AuZGF0YXNldC5zaGlmdHJDYXJvdXNlbEFjdGl2ZSA9ICdmYWxzZSc7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYWN0aXZlX3Byb3AuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIC8vIERlZmluZSB0cmFuc2l0aW9uIGVuZFxuICAgICAgICAgICAgdHJhbnNpdGlvbl9pbl9wcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB9LCBfLnRyYW5zaXRpb24pO1xuICAgIH07XG5cbiAgICB2YXIgbG9vcGluZyA9IHZvaWQgMCxcbiAgICAgICAgcmVzdGFydCA9IHZvaWQgMDtcblxuICAgIGlmIChfLmF1dG9wbGF5KSB7XG4gICAgICAgIGxvb3BpbmcgPSBzZXRJbnRlcnZhbCh0aGVfbG9vcCwgXy5zcGVlZCk7XG4gICAgfVxuXG4gICAgaWYgKHNob3dfbWFya2VycygpKSB7XG5cbiAgICAgICAgbWFya2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChtYXJrZXIpIHtcblxuICAgICAgICAgICAgbWFya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBFYXJseSBleGl0IGlmIHRyYW5zaXRpb24gaXMgaW4gcHJvZ3Jlc3NcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNpdGlvbl9pbl9wcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICBwYXVzZV9sb29wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBhY3RpdmVfcHJvcCBhbmQgYWN0aXZlX3Byb3BfaWQgYXJlIGNvcmVjdFxuICAgICAgICAgICAgICAgIHZhciBhY3RpdmVfcHJvcCA9IGdldF9hY3RpdmVfcHJvcCgpLFxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVfcHJvcF9pZCA9IGdldF9hY3RpdmVfcHJvcF9pZChhY3RpdmVfcHJvcCk7XG5cbiAgICAgICAgICAgICAgICAvLyBJc3N1ZXMgd2l0aCBzZWxlY3RlZF9wcm9wXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkX3Byb3AgPSBwcm9wc1ttYXJrZXIuZGF0YXNldC5zaGlmdHJDYXJvdXNlbE1hcmtlcl0sXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX3Byb3BfaWQgPSBtYXJrZXIuZGF0YXNldC5zaGlmdHJDYXJvdXNlbE1hcmtlcjtcblxuICAgICAgICAgICAgICAgIC8vIFR1cm4gb2ZmIHBhdXNlIHRvIGFsbG93IGNoYW5nZVxuICAgICAgICAgICAgICAgIHBhdXNlX2xvb3AgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIC8vIFN0b3AgY3VycmVudCBhY3Rpb25zXG4gICAgICAgICAgICAgICAgaWYgKF8uYXV0b3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChsb29waW5nKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc3RhcnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVfcHJvcF9pZCAhPSBzZWxlY3RlZF9wcm9wX2lkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRGVmaW5lIHRyYW5zaXRpb24gc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9pbl9wcm9ncmVzcyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHByb3BcbiAgICAgICAgICAgICAgICAgICAgcHJvcHNbc2VsZWN0ZWRfcHJvcF9pZF0uc3R5bGUuekluZGV4ID0gMTUwO1xuICAgICAgICAgICAgICAgICAgICBwcm9wc1tzZWxlY3RlZF9wcm9wX2lkXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHNbc2VsZWN0ZWRfcHJvcF9pZF0uZGF0YXNldC5zaGlmdHJDYXJvdXNlbEFjdGl2ZSA9ICd0cnVlJztcblxuICAgICAgICAgICAgICAgICAgICAvLyBDb250aW51ZSByZW1vdmVcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlX3Byb3AuZGF0YXNldC5zaGlmdHJDYXJvdXNlbEFjdGl2ZSA9ICdmYWxzZSc7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlX3Byb3AuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wc1tzZWxlY3RlZF9wcm9wX2lkXS5zdHlsZS56SW5kZXggPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2Vyc1thY3RpdmVfcHJvcF9pZF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXJzW3NlbGVjdGVkX3Byb3BfaWRdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWZpbmUgdHJhbnNpdGlvbiBlbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25faW5fcHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSwgXy50cmFuc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBSZXN0YXJ0IGxvb3AsIGlmIHBhdXNlZFxuICAgICAgICAgICAgICAgIGlmIChfLmF1dG9wbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3RhcnQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvb3BpbmcgPSBzZXRJbnRlcnZhbCh0aGVfbG9vcCwgXy5zcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIF8uc3BlZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtYXJrZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkX3Byb3AgPSBwcm9wc1ttYXJrZXIuZGF0YXNldC5zaGlmdHJDYXJvdXNlbE1hcmtlcl0sXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX3Byb3BfaWQgPSBtYXJrZXIuZGF0YXNldC5zaGlmdHJDYXJvdXNlbE1hcmtlcjtcblxuICAgICAgICAgICAgICAgIGlmIChfLnBhdXNlX29uX21hcmtlcl9ob3Zlcikge1xuICAgICAgICAgICAgICAgICAgICBwYXVzZV9sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2VzW3NlbGVjdGVkX3Byb3BfaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldF9pbWFnZXMoaW1hZ2VzW3NlbGVjdGVkX3Byb3BfaWRdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWFya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBwYXVzZV9sb29wID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHNob3dfYXJyb3dzKCkpIHtcbiAgICAgICAgdmFyIGxvb3Bfb25fYXJyb3cgPSBmdW5jdGlvbiBsb29wX29uX2Fycm93KCkge1xuICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG5cblxuICAgICAgICAgICAgLy8gRWFybHkgZXhpdCBpZiB0cmFuc2l0aW9uIGlzIGluIHByb2dyZXNzXG4gICAgICAgICAgICBpZiAodHJhbnNpdGlvbl9pbl9wcm9ncmVzcykge1xuICAgICAgICAgICAgICAgIHBhdXNlX2xvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGFjdGl2ZV9wcm9wIGFuZCBhY3RpdmVfcHJvcF9pZCBhcmUgY29yZWN0XG4gICAgICAgICAgICB2YXIgYWN0aXZlX3Byb3AgPSBnZXRfYWN0aXZlX3Byb3AoKSxcbiAgICAgICAgICAgICAgICBhY3RpdmVfcHJvcF9pZCA9IGdldF9hY3RpdmVfcHJvcF9pZChhY3RpdmVfcHJvcCksXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRfcHJvcCA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZF9wcm9wX2lkID0gdm9pZCAwO1xuXG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09ICdwcmV2aW91cycpIHtcblxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVfcHJvcF9pZCA9PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGludCA9IHByb3BzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX3Byb3AgPSBwcm9wc1tpbnRdO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZF9wcm9wX2lkID0gaW50O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRfcHJvcCA9IHByb3BzW2FjdGl2ZV9wcm9wX2lkIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX3Byb3BfaWQgPSBhY3RpdmVfcHJvcF9pZCAtIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVfcHJvcF9pZCA9PSBwcm9wcy5sZW5ndGggLSAxKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRfcHJvcCA9IHByb3BzWzBdO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZF9wcm9wX2lkID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX3Byb3AgPSBwcm9wc1thY3RpdmVfcHJvcF9pZCArIDFdO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZF9wcm9wX2lkID0gYWN0aXZlX3Byb3BfaWQgKyAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVHVybiBvZmYgcGF1c2UgdG8gYWxsb3cgY2hhbmdlXG4gICAgICAgICAgICBwYXVzZV9sb29wID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIFN0b3AgY3VycmVudCBhY3Rpb25zXG4gICAgICAgICAgICBpZiAoXy5hdXRvcGxheSkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwobG9vcGluZyk7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc3RhcnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWN0aXZlX3Byb3BfaWQgIT0gc2VsZWN0ZWRfcHJvcF9pZCkge1xuXG4gICAgICAgICAgICAgICAgLy8gRGVmaW5lIHRyYW5zaXRpb24gc3RhcnRcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX2luX3Byb2dyZXNzID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIC8vIFNldCBwcm9wXG4gICAgICAgICAgICAgICAgcHJvcHNbc2VsZWN0ZWRfcHJvcF9pZF0uc3R5bGUuekluZGV4ID0gMTUwO1xuICAgICAgICAgICAgICAgIHByb3BzW3NlbGVjdGVkX3Byb3BfaWRdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHByb3BzW3NlbGVjdGVkX3Byb3BfaWRdLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxBY3RpdmUgPSAndHJ1ZSc7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2hvd19tYXJrZXJzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFya2Vyc1thY3RpdmVfcHJvcF9pZF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtlcnNbc2VsZWN0ZWRfcHJvcF9pZF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ29udGludWUgcmVtb3ZlXG4gICAgICAgICAgICAgICAgYWN0aXZlX3Byb3AuZGF0YXNldC5zaGlmdHJDYXJvdXNlbEFjdGl2ZSA9ICdmYWxzZSc7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZV9wcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBwcm9wc1tzZWxlY3RlZF9wcm9wX2lkXS5zdHlsZS56SW5kZXggPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAvLyBEZWZpbmUgdHJhbnNpdGlvbiBlbmRcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9pbl9wcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sIF8udHJhbnNpdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbWFnZXNbc2VsZWN0ZWRfcHJvcF9pZF0pIHtcbiAgICAgICAgICAgICAgICBnZXRfaW1hZ2VzKGltYWdlc1tzZWxlY3RlZF9wcm9wX2lkXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlc3RhcnQgbG9vcCwgaWYgcGF1c2VkXG4gICAgICAgICAgICBpZiAoXy5hdXRvcGxheSkge1xuICAgICAgICAgICAgICAgIHJlc3RhcnQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9vcGluZyA9IHNldEludGVydmFsKHRoZV9sb29wLCBfLnNwZWVkKTtcbiAgICAgICAgICAgICAgICB9LCBfLnNwZWVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgYXJyb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcm91c2VsLWFycm93Jyk7XG5cbiAgICAgICAgYXJyb3dzWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAgICAgbG9vcF9vbl9hcnJvdygncHJldmlvdXMnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXJyb3dzWzFdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAgICAgbG9vcF9vbl9hcnJvdygnbmV4dCcpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBHZXQgaW1hZ2VzXG4gICAgZnVuY3Rpb24gZ2V0X2ltYWdlcyhzdWJfaW1hZ2VzKSB7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHN1Yl9pbWFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChzdWJfaW1hZ2VzW2ldLmhhc0F0dHJpYnV0ZSgnc3JjJykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgc3ViX2ltYWdlc1tpXS5zcmMgPSBzdWJfaW1hZ2VzW2ldLmRhdGFzZXQuc3JjO1xuICAgICAgICAgICAgICAgIHN1Yl9pbWFnZXNbaV0uZGF0YXNldC5zcmMgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEdldCBkYXRhIG9uIHRoZSBhY3RpdmUgcHJvcFxuICAgIGZ1bmN0aW9uIGdldF9hY3RpdmVfcHJvcCgpIHtcblxuICAgICAgICB2YXIgdGhlX3Byb3AgPSB2b2lkIDA7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocHJvcHNbaV0uZGF0YXNldC5zaGlmdHJDYXJvdXNlbEFjdGl2ZSA9PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICB0aGVfcHJvcCA9IHByb3BzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoZV9wcm9wO1xuICAgIH1cblxuICAgIC8vIEdldCBhY3RpdmUgcHJvcCBpZFxuICAgIGZ1bmN0aW9uIGdldF9hY3RpdmVfcHJvcF9pZCh0aGVfcHJvcCkge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhlX3Byb3AuZGF0YXNldC5zaGlmdHJDYXJvdXNlbFByb3AsIDEwKTtcbiAgICB9XG5cbiAgICAvLyBUb2dnbGUgZm9yIG1hcmtlcnNcbiAgICBmdW5jdGlvbiBzaG93X21hcmtlcnMoKSB7XG4gICAgICAgIGlmIChfLnNob3dfbWFya2Vycykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUb2dnbGUgZm9yIGFycm93c1xuICAgIGZ1bmN0aW9uIHNob3dfYXJyb3dzKCkge1xuICAgICAgICBpZiAoXy5zaG93X2Fycm93cykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uIChjb29raWVfbmFtZSkge1xuXG4gICAgLyogIC8vLy8gIC0tfCAgICBDb29raWVcbiAgICAgICAgICogSGFuZGxlIHRoZSBTaGlmdHIgQ29va2llIENvbnNlbnRcbiAgICAqL1xuXG4gICAgaWYgKGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKGNvb2tpZV9uYW1lKSA9PSAtMSkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdjb29raWUgZG9lc25cXCd0IGV4aXN0Jyk7XG5cbiAgICAgICAgdmFyIHN0eWxlc2hlZXQgPSBjcmVhdGVFbCgnbGluaycpO1xuICAgICAgICBzdHlsZXNoZWV0LnNldEF0dHJpYnV0ZSgncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICAgICAgc3R5bGVzaGVldC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBzaGlmdHIudGhlbWUgKyAnL2Fzc2V0cy9zdHlsZXMvY29va2llLW5vdGljZS5jc3MnKTtcbiAgICAgICAgc3R5bGVzaGVldC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZXNoZWV0KTtcblxuICAgICAgICAvLyBDcmVhdGUgbm90aWNlXG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgaW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyksXG4gICAgICAgICAgICBkaXNtaXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICAgICAgZWwuY2xhc3NMaXN0ID0gJ3NoaWZ0ci1jb29raWUtbm90aWNlJztcblxuICAgICAgICBtZXNzYWdlLmlubmVySFRNTCA9IHNoaWZ0ci5jb29raWUubWVzc2FnZTtcblxuICAgICAgICBkaXNtaXNzLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbicpO1xuICAgICAgICBkaXNtaXNzLnNldEF0dHJpYnV0ZSgnaWQnLCAnc2hpZnRyLWNvb2tpZS1hY2NlcHQnKTtcbiAgICAgICAgZGlzbWlzcy5pbm5lckhUTUwgPSAnQ2xvc2UnO1xuXG4gICAgICAgIGlubmVyLmFwcGVuZENoaWxkKG1lc3NhZ2UpO1xuICAgICAgICBpbm5lci5hcHBlbmRDaGlsZChkaXNtaXNzKTtcblxuICAgICAgICBlbC5hcHBlbmRDaGlsZChpbm5lcik7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbCk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdwb3N0ZWQnKTtcbiAgICAgICAgfSwgMTAwMCk7XG5cbiAgICAgICAgLy8gTGlzdGVuIGZvciBub3RpY2UgYWNjZXB0YW5jZVxuICAgICAgICB2YXIgY29va2llX2FjY2VwdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NoaWZ0ci1jb29raWUtYWNjZXB0Jyk7XG5cbiAgICAgICAgY29va2llX2FjY2VwdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIGNvb2tpZV9leHBpcnkgPSAnVGh1LCAxOCBEZWMgMjAxOSAxMjowMDowMCBVVEMnO1xuXG4gICAgICAgICAgICAvLyBTZXQgdGhlIGNvb2tpZVxuICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llX25hbWUgKyAnPScgKyB0cnVlICsgJzsgZXhwaXJlcz0nICsgY29va2llX2V4cGlyeSArICc7IHBhdGg9Lyc7XG5cbiAgICAgICAgICAgIC8vIE5vdywgcmVtb3ZlIHRoZSBub3RpY2VcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3Bvc3RlZCcpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9XG59KSgnc2hpZnRyX2Nvb2tpZV8nICsgc2hpZnRyLm5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcgJywgJycpICsgJ19hY2NlcHQnKTsiLCIndXNlIHN0cmljdCc7XG5cbi8qICBFbGVtZW50LnByb3RvdHlwZS5mbG9hdGVyXG4gKlxuICogIEBzaW5jZSAxLjBcbiAqXG4gKiAgQHBhcmFtIHNldHRpbmdzIE9iamVjdCBUaGUgc2V0dGluZ3MgZm9yIHRoZSBmbG9hdGVyIHRhcmdldCBlbGVtZW50XG4gKiAgQHBvbHlmaWxsIE9iamVjdC5hc3NpZ25cbiAqXG4gKi9cblxuRWxlbWVudC5wcm90b3R5cGUuZmxvYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2V0dGluZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG5cbiAgICAvLyBUaGUgZGVmYXVsdCBzZXR0aW5nc1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgYm91bmRpbmc6IHRoaXMucGFyZW50RWxlbWVudCwgLy8gRWxlbWVudFxuICAgICAgICBmbG9hdF9idWZmZXI6IDAsIC8vIEludGVnYXJcbiAgICAgICAgaGVhZGVyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyksIC8vIEVsZW1lbnR8bnVsbFxuICAgICAgICBzdGFydGluZzogbnVsbCwgLy8gbnVsbHxFbGVtZW50XG4gICAgICAgIGVuZGluZzogbnVsbCxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICByZXNpemU6IHdpbmRvdyxcbiAgICAgICAgICAgIG9yaWVudGF0aW9uY2hhbmdlOiB3aW5kb3dcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBBc3NpZ24gc2V0dGluZ3MgYXMgZGVmYXVsdHMgaWYgc2V0dGluZ3MgYXJlIG5vdCBzZXRcbiAgICBpZiAoT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aCA9PSAwKSBzZXR0aW5ncyA9IGRlZmF1bHRzO1xuXG4gICAgLy8gT3ZlcnJpZGUgdGhlIGRlZmF1bHRzIHdpdGggYW55IGRlZmluZWQgc2V0dGluZ3NcbiAgICB2YXIgXyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIHNldHRpbmdzKTtcblxuICAgIC8vIEdsb2JhbCB2YXJpYWJsZXNcbiAgICB2YXIgZmxvYXRlciA9IHRoaXMsXG4gICAgICAgIGJvdW5kaW5nID0gXy5ib3VuZGluZyxcbiAgICAgICAgZmxvYXRlcl9wb3NpdGlvbixcbiAgICAgICAgZmxvYXRlcl9sZWZ0LFxuICAgICAgICBib3VuZGluZ19wb3NpdGlvbixcbiAgICAgICAgYm91bmRpbmdfdG9wLFxuICAgICAgICBib3VuZGluZ19ib3R0b20sXG4gICAgICAgIGZsb2F0X3Bvc2l0aW9uID0gXy5mbG9hdF9idWZmZXIsXG4gICAgICAgIHBvc2l0aW9uX3RvcCxcbiAgICAgICAgcG9zaXRpb25fYm90dG9tLFxuICAgICAgICBzdGFydGluZ19wb2ludCxcbiAgICAgICAgZW5kaW5nX3BvaW50O1xuXG4gICAgLy8gQ2hlY2sgaWYgaGVhZGVyIGhlaWdodCBzaG91bGQgYmUgaW5jbHVkZWQgaW4gZmxvYXRfcG9zaXRpb25cbiAgICBpZiAoXy5oZWFkZXIpIGZsb2F0X3Bvc2l0aW9uICs9IF8uaGVhZGVyLm9mZnNldEhlaWdodDtcblxuICAgIC8vIFRoZSBjb3JlIGZ1bmN0aW9uIHRoYXQgZXZlbnQgbGlzdGVuZXJzIGFyZSBhcHBlbmRlZCB0b1xuICAgIHZhciBhY3Rpb24gPSBmdW5jdGlvbiBhY3Rpb24oZSkge1xuXG4gICAgICAgIC8vIEdldCB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb25cbiAgICAgICAgdmFyIHNjcm9sbF9wb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgICAgIC8vIFdlIGRvIG5vdCB3YW50IHRvIHJlZGVmaW5lIHRoZSBmb2xsb3dpbmcgb24gYSBzY3JvbGxcbiAgICAgICAgaWYgKGUudHlwZSAhPSAnc2Nyb2xsJykge1xuXG4gICAgICAgICAgICBmbG9hdGVyX3Bvc2l0aW9uID0gZmxvYXRlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGJvdW5kaW5nX3Bvc2l0aW9uID0gYm91bmRpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgIGZsb2F0ZXJfbGVmdCA9IGZsb2F0ZXJfcG9zaXRpb24ubGVmdDtcblxuICAgICAgICAgICAgaWYgKF8uc3RhcnRpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzdGFydGluZ19wb2ludCA9IF8uc3RhcnRpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgc2Nyb2xsX3Bvc2l0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGFydGluZ19wb2ludCA9IGJvdW5kaW5nX3Bvc2l0aW9uLnRvcCArIHNjcm9sbF9wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8uZW5kaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZW5kaW5nX3BvaW50ID0gXy5lbmRpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tICsgc2Nyb2xsX3Bvc2l0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbmRpbmdfcG9pbnQgPSBib3VuZGluZ19wb3NpdGlvbi5ib3R0b20gKyBzY3JvbGxfcG9zaXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXR1cCB0aGUgc3RhcnRpbmcgYW5kIGVuZGluZyBwb2ludHMgaW5jbHVkaW5nIGJ1ZmZlciBhcmVhc1xuICAgICAgICBwb3NpdGlvbl90b3AgPSBzY3JvbGxfcG9zaXRpb24gKyBmbG9hdF9wb3NpdGlvbjtcbiAgICAgICAgcG9zaXRpb25fYm90dG9tID0gc2Nyb2xsX3Bvc2l0aW9uICsgZmxvYXRfcG9zaXRpb24gKyBmbG9hdGVyLm9mZnNldEhlaWdodDtcblxuICAgICAgICAvLyBEZWNpZGUgd2hhdCBzdGF0ZSB0aGUgZmxvYXRlciBzaG91bGQgYmUgaW4gYmFzZWQgb24gc2Nyb2xsIHBvc2l0aW9uLi4uXG4gICAgICAgIGlmIChwb3NpdGlvbl9ib3R0b20gPj0gZW5kaW5nX3BvaW50KSB7XG4gICAgICAgICAgICBmbG9hdGVyLmNsYXNzTGlzdC5hZGQoJ3BhdXNlJyk7XG4gICAgICAgICAgICBmbG9hdGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3N0aWNreScpO1xuICAgICAgICAgICAgZmxvYXRlci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xuICAgICAgICB9IGVsc2UgaWYgKHBvc2l0aW9uX3RvcCA+PSBzdGFydGluZ19wb2ludCkge1xuICAgICAgICAgICAgZmxvYXRlci5zdHlsZS53aWR0aCA9IGJvdW5kaW5nLm9mZnNldFdpZHRoICsgJ3B4JztcbiAgICAgICAgICAgIGZsb2F0ZXIuc3R5bGUudG9wID0gZmxvYXRfcG9zaXRpb24gKyAncHgnO1xuICAgICAgICAgICAgZmxvYXRlci5zdHlsZS5sZWZ0ID0gYm91bmRpbmdfcG9zaXRpb24ubGVmdCArICdweCc7XG4gICAgICAgICAgICBmbG9hdGVyLmNsYXNzTGlzdC5hZGQoJ3N0aWNreScpO1xuICAgICAgICAgICAgZmxvYXRlci5jbGFzc0xpc3QucmVtb3ZlKCdwYXVzZScpO1xuICAgICAgICB9IGVsc2UgaWYgKHBvc2l0aW9uX3RvcCA8PSBzdGFydGluZ19wb2ludCkge1xuICAgICAgICAgICAgZmxvYXRlci5jbGFzc0xpc3QucmVtb3ZlKCdzdGlja3knKTtcbiAgICAgICAgICAgIGZsb2F0ZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICcnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBUaGUgZXZlbnQgbGlzdGVuZXJzLi4uXG4gICAgT2JqZWN0LmtleXMoXy5ldmVudHMpLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgXy5ldmVudHNbZV0uYWRkRXZlbnRMaXN0ZW5lcihlLCBhY3Rpb24pO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGFjdGlvbik7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGFjdGlvbik7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyogIEVsZW1lbnQucHJvdG90eXBlLmZvbGxvd2VyXG4gKlxuICogIEBzaW5jZSAxLjBcbiAqXG4gKiAgQHBhcmFtIHNldHRpbmdzIE9iamVjdCBUaGUgc2V0dGluZ3MgZm9yIHRoZSBmbG9hdGVyIHRhcmdldCBlbGVtZW50XG4gKiAgQHBvbHlmaWxsIE9iamVjdC5hc3NpZ25cbiAqXG4gKi9cblxuRWxlbWVudC5wcm90b3R5cGUuZm9sbG93ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNldHRpbmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuXG4gICAgLy8gVGhlIGRlZmF1bHQgc2V0dGluZ3NcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIHNlY3Rpb25zOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzZWN0aW9uJylcbiAgICB9O1xuXG4gICAgLy8gQXNzaWduIHNldHRpbmdzIGFzIGRlZmF1bHRzIGlmIHNldHRpbmdzIGFyZSBub3Qgc2V0XG4gICAgaWYgKE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGggPT0gMCkgc2V0dGluZ3MgPSBkZWZhdWx0cztcblxuICAgIC8vIE92ZXJyaWRlIHRoZSBkZWZhdWx0cyB3aXRoIGFueSBkZWZpbmVkIHNldHRpbmdzXG4gICAgdmFyIF8gPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBzZXR0aW5ncyk7XG5cbiAgICAvLyBHbG9iYWwgdmFyaWFibGVzXG4gICAgdmFyIG5hdiA9IHRoaXMsXG4gICAgICAgIGxpbmtzID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKCdzcGFuJyksXG4gICAgICAgIHNlY3Rpb25zID0gXy5zZWN0aW9ucyxcbiAgICAgICAgc2VjdGlvbl9wb3NpdGlvbixcbiAgICAgICAgc2VjdGlvbl9pZCxcbiAgICAgICAgc2VjdGlvbl90b3AsXG4gICAgICAgIHNlY3Rpb25fYm90dG9tO1xuXG4gICAgbGlua3MuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuXG4gICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGxpbmsuZ2V0QXR0cmlidXRlKCdkYXRhLW9uLXBhZ2UtbGluaycpKS5hbmltYXRlU2Nyb2xsKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIGFjdGlvbiA9IGZ1bmN0aW9uIGFjdGlvbihlKSB7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvblxuICAgICAgICB2YXIgc2Nyb2xsX3Bvc2l0aW9uID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AsXG4gICAgICAgICAgICB0YXJnZXRfcG9pbnQgPSBzY3JvbGxfcG9zaXRpb24gKyB2aCgpIC8gMjtcblxuICAgICAgICBzZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChzZWN0aW9uKSB7XG5cbiAgICAgICAgICAgIGlmIChlLnR5cGUgIT0gJ3Njcm9sbCcpIHtcblxuICAgICAgICAgICAgICAgIHNlY3Rpb25fcG9zaXRpb24gPSBzZWN0aW9uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgc2VjdGlvbl90b3AgPSBzZWN0aW9uX3Bvc2l0aW9uLnRvcCArIHNjcm9sbF9wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICBzZWN0aW9uX2JvdHRvbSA9IHNlY3Rpb25fcG9zaXRpb24uYm90dG9tICsgc2Nyb2xsX3Bvc2l0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaWQgPSBzZWN0aW9uLmdldEF0dHJpYnV0ZSgnaWQnKS5zdWJzdHJpbmcoOCksXG4gICAgICAgICAgICAgICAgc2VjdGlvbl90b3AgPSBzZWN0aW9uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHNjcm9sbF9wb3NpdGlvbixcbiAgICAgICAgICAgICAgICBzZWN0aW9uX2JvdHRvbSA9IHNlY3Rpb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tICsgc2Nyb2xsX3Bvc2l0aW9uO1xuXG4gICAgICAgICAgICBpZiAodGFyZ2V0X3BvaW50ID4gc2VjdGlvbl90b3AgJiYgdGFyZ2V0X3BvaW50IDwgc2VjdGlvbl9ib3R0b20pIHtcblxuICAgICAgICAgICAgICAgIGxpbmtzW2lkIC0gMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgbGlua3NbaWQgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBhY3Rpb24pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBhY3Rpb24pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qICAvLy8vICAtLXwgICAgRWxlbWVudC5wcm90b3R5cGUuZm9ybSggc2V0dGluZ3MgPSB7fSApXG5cbiAgICAqIFNoaWZ0ciBGb3JtIEhhbmRsZXJcbiovXG5cbkVsZW1lbnQucHJvdG90eXBlLmZvcm0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNldHRpbmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuXG4gICAgLy8gVGhlIGRlZmF1bHQgc2V0dGluZ3NcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIHN0YXRlczogdHJ1ZSxcbiAgICAgICAgdmFsaWRhdGU6IHRydWUsXG4gICAgICAgIHN1Ym1pc3Npb246IHRydWUsXG4gICAgICAgIHRhcmdldHM6IFsnbmFtZScsICd0ZXh0JywgJ2VtYWlsJywgJ3RlbCcsICdkYXRlJywgJ3Bhc3N3b3JkJ10sXG4gICAgICAgIHZhbGlkYXRpb25fY2xhc3Nlczoge1xuICAgICAgICAgICAgZm9jdXM6ICdmaWVsZC1ldmVudC1mb2N1cycsXG4gICAgICAgICAgICBzdWNjZXNzOiAnZmllbGQtZXZlbnQtc3VjY2VzcycsXG4gICAgICAgICAgICBlcnJvcjogJ2ZpZWxkLWV2ZW50LWVycm9yJ1xuICAgICAgICB9LFxuICAgICAgICBzZXR0aW5nczogc2hpZnRyLmZvcm1cbiAgICB9O1xuXG4gICAgLy8gQXNzaWduIHNldHRpbmdzIGFzIGRlZmF1bHRzIGlmIHNldHRpbmdzIGFyZSBub3Qgc2V0XG4gICAgaWYgKE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGggPT0gMCkgc2V0dGluZ3MgPSBkZWZhdWx0cztcblxuICAgIC8vIE92ZXJyaWRlIHRoZSBkZWZhdWx0cyB3aXRoIGFueSBkZWZpbmVkIHNldHRpbmdzXG4gICAgdmFyIF8gPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBzZXR0aW5ncyk7XG5cbiAgICAvLyBUaGUgbWFpbiBjYXJvdXNlbCBlbGVtZW50c1xuICAgIHZhciBmb3JtID0gdGhpcyxcbiAgICAgICAgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgdGV4dGFyZWEnKSxcbiAgICAgICAgc2VsZWN0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnc2VsZWN0JyksXG4gICAgICAgIHN1Ym1pdCA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInN1Ym1pdFwiXScpIHx8IHRoaXMsXG4gICAgICAgIHZjID0gXy52YWxpZGF0aW9uX2NsYXNzZXM7XG5cbiAgICAvLyBDaGVja2VyIHZhciBmb3IgcmVxdWVzdGluZyBmb3JtIHN0eWxlc2hldFxuICAgIHZhciBjc3NfcmVxdWVzdGVkID0gZmFsc2U7XG5cbiAgICAvLyBMb29wIGFsbCBpbnB1dHNcbiAgICBpbnB1dHMuZm9yRWFjaChmdW5jdGlvbiAoaW5wdXQpIHtcblxuICAgICAgICBpZiAoXy50YXJnZXRzLmluZGV4T2YoaW5wdXQudHlwZSkgPj0gMCB8fCBpbnB1dC5ub2RlTmFtZSA9PSAnVEVYVEFSRUEnKSB7XG5cbiAgICAgICAgICAgIC8vIEFwcGx5IGFsbCBjbGFzc2VzIHRvIGZpZWxkIHdyYXBwZXIgZWxlbWVudFxuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGlucHV0LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAgICAgICAgIGdldF9zdHlsZXNoZWV0KCk7XG5cbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCh2Yy5mb2N1cyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uIChlKSB7XG5cbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSh2Yy5mb2N1cyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUodmMuc3VjY2Vzcyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUodmMuZXJyb3IpO1xuXG4gICAgICAgICAgICAgICAgaWYgKF8udmFsaWRhdGUgJiYgaW5wdXQudmFsdWUgIT0gJycpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hlY2tWYWxpZGl0eSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCh2Yy5zdWNjZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX3ZhbGlkYXRpb24oaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQodmMuZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChfLnZhbGlkYXRlKSB7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnZhbGlkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKHZjLmVycm9yKTtcblxuICAgICAgICAgICAgICAgICAgICBkb192YWxpZGF0aW9uKGlucHV0LCBpbnB1dC52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PSAnY2hlY2tib3gnIHx8IGlucHV0LnR5cGUgPT0gJ3JhZGlvJykge1xuXG4gICAgICAgICAgICBpZiAoXy52YWxpZGF0ZSkge1xuXG4gICAgICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfdmFsaWRhdGlvbihpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ludmFsaWQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9fdmFsaWRhdGlvbihpbnB1dCwgaW5wdXQudmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWxlY3RzLmZvckVhY2goZnVuY3Rpb24gKHNlbGVjdCkge1xuXG4gICAgICAgIHNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgc2VsZWN0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCh2Yy5zdWNjZXNzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBDb25zdHJ1Y3QgdmFsaWRhdGlvbiBub3RpZmljYXRpb25cbiAgICBmdW5jdGlvbiBkb192YWxpZGF0aW9uKGlucHV0LCBtZXNzYWdlKSB7XG5cbiAgICAgICAgdmFyIG0gPSBjcmVhdGVFbCgnc3BhbicpO1xuXG4gICAgICAgIG0uY2xhc3NMaXN0LmFkZCgndmFsaWRhdGlvbicpO1xuICAgICAgICBtLmlubmVySFRNTCA9IG1lc3NhZ2U7XG4gICAgICAgIGlucHV0LnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQobSk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtLmNsYXNzTGlzdC5hZGQoJ3BvcCcpO1xuICAgICAgICB9LCAyMDApO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJfdmFsaWRhdGlvbihpbnB1dCk7XG4gICAgICAgIH0sIDYwMDApO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSB2YWxpZGF0aW9uIG5vdGlmaWNhdGlvblxuICAgIGZ1bmN0aW9uIGNsZWFyX3ZhbGlkYXRpb24oaW5wdXQpIHtcblxuICAgICAgICB2YXIgbm90aWZpY2F0aW9uID0gaW5wdXQucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzcGFuLnZhbGlkYXRpb24nKTtcblxuICAgICAgICBpZiAobm90aWZpY2F0aW9uKSB7XG5cbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdwb3AnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChub3RpZmljYXRpb24pO1xuICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzdWJtaXRfaG92ZXIgPSBmdW5jdGlvbiBzdWJtaXRfaG92ZXIoZSkge1xuICAgICAgICBnZXRfc3R5bGVzaGVldCgpO1xuICAgIH07XG5cbiAgICBzdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgc3VibWl0X2hvdmVyKTtcblxuICAgIGlmIChfLnN1Ym1pc3Npb24pIHtcbiAgICAgICAgdmFyIGRvX21lc3NhZ2UgPSBmdW5jdGlvbiBkb19tZXNzYWdlKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnJztcbiAgICAgICAgICAgIHZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuXG5cbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gY3JlYXRlRWwoJ2RpdicpLFxuICAgICAgICAgICAgICAgIHdyYXAgPSBjcmVhdGVFbCgnZGl2JyksXG4gICAgICAgICAgICAgICAgaGVhZGluZyA9IGNyZWF0ZUVsKCdzcGFuJyksXG4gICAgICAgICAgICAgICAgY29udGVudCA9IGNyZWF0ZUVsKCdwJyksXG4gICAgICAgICAgICAgICAgZXJyb3JfcmVmID0gY3JlYXRlRWwoJ3NwYW4nKSxcbiAgICAgICAgICAgICAgICBjbG9zZXIgPSBjcmVhdGVFbCgnYnV0dG9uJyk7XG5cbiAgICAgICAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZm9ybS1zdWJtaXNzaW9uJyk7XG5cbiAgICAgICAgICAgIC8vIFNlbGVjdCBjb3JyZXNwb25kaW5nIGNvbmZpcm1hdGlvbiBjb250ZW50XG4gICAgICAgICAgICBzd2l0Y2ggKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICAgICAvLyAnMScgZXF1YWxzIHRydWUuIFxuICAgICAgICAgICAgICAgIGNhc2UgJzEnOlxuICAgICAgICAgICAgICAgICAgICB2YXIgYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6IF8uc2V0dGluZ3Muc3VjY2Vzc19oZWFkaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYzogXy5zZXR0aW5ncy5zdWNjZXNzX2JvZHlcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB2YXIgYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6IF8uc2V0dGluZ3MuZXJyb3JfaGVhZGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGM6IF8uc2V0dGluZ3MuZXJyb3JfYm9keVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBlcnJvcl9yZWYuaW5uZXJIVE1MID0gJ0VSUk9SIFJFRjogJyArIHJlc3BvbnNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoZWFkaW5nLmlubmVySFRNTCA9IGJvZHkuaDtcbiAgICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gYm9keS5jO1xuXG4gICAgICAgICAgICBjbG9zZXIuaW5uZXJIVE1MID0gJ0Nsb3NlJztcbiAgICAgICAgICAgIGNsb3Nlci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2Nsb3NlLXN1Ym1pc3Npb24nKTtcbiAgICAgICAgICAgIGNsb3Nlci5jbGFzc0xpc3QuYWRkKCdidXR0b24nKTtcblxuICAgICAgICAgICAgd3JhcC5hcHBlbmRDaGlsZChoZWFkaW5nKTtcbiAgICAgICAgICAgIHdyYXAuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgICAgICAgICB3cmFwLmFwcGVuZENoaWxkKGVycm9yX3JlZik7XG4gICAgICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKHdyYXApO1xuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZChjbG9zZXIpO1xuXG4gICAgICAgICAgICBmb3JtLmFwcGVuZENoaWxkKG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG5cbiAgICAgICAgICAgIGNsb3Nlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChhdXRvX2NsZWFyKTtcbiAgICAgICAgICAgICAgICBjbGVhcl9tZXNzYWdlKG1lc3NhZ2UsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYXV0b19jbGVhcl9kZWxheSA9IHZvaWQgMDtcblxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09ICcxJykge1xuICAgICAgICAgICAgICAgIGF1dG9fY2xlYXJfZGVsYXkgPSA4MTAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhdXRvX2NsZWFyX2RlbGF5ID0gMzAwMDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdXRvX2NsZWFyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBjbGVhcl9tZXNzYWdlKG1lc3NhZ2UsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0sIGF1dG9fY2xlYXJfZGVsYXkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjbGVhcl9tZXNzYWdlID0gZnVuY3Rpb24gY2xlYXJfbWVzc2FnZShlbCwgYWN0aW9uKSB7XG5cbiAgICAgICAgICAgIGlmIChhY3Rpb24gPT0gJzEnKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBFbXB0eSBhbGwgZmllbGRzIG9mIHZhbHVlc1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF8udGFyZ2V0cy5pbmRleE9mKGlucHV0c1tpXS50eXBlKSA+IDAgfHwgaW5wdXRzW2ldLm5vZGVOYW1lID09ICdURVhUQVJFQScpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzW2ldLnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHNbaV0ucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHZjLnN1Y2Nlc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzW2ldLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh2Yy5lcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXRzW2ldLnR5cGUgPT0gJ2NoZWNrYm94JyB8fCBpbnB1dHNbaV0udHlwZSA9PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHNbaV0uY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgZm9ybS5jbGFzc0xpc3QuYWRkKCdzZW5kLWluLXByb2dyZXNzJyk7XG5cbiAgICAgICAgICAgIHZhciBkYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pLFxuICAgICAgICAgICAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApIHtcblxuICAgICAgICAgICAgICAgICAgICBmb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbmQtaW4tcHJvZ3Jlc3MnKTtcblxuICAgICAgICAgICAgICAgICAgICBkb19tZXNzYWdlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9fbWVzc2FnZSgnWEhSX0VSUk9SJywgeGhyLnN0YXR1cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZG9fbWVzc2FnZSgnWEhSX0VSUk9SJywgeGhyKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgc2hpZnRyLmFqYXgpO1xuICAgICAgICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldF9zdHlsZXNoZWV0KCkge1xuXG4gICAgICAgIGlmICghY3NzX3JlcXVlc3RlZCkge1xuXG4gICAgICAgICAgICB2YXIgc3R5bGVzaGVldCA9IGNyZWF0ZUVsKCdsaW5rJyk7XG4gICAgICAgICAgICBzdHlsZXNoZWV0LnNldEF0dHJpYnV0ZSgncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICAgICAgICAgIHN0eWxlc2hlZXQuc2V0QXR0cmlidXRlKCdocmVmJywgc2hpZnRyLnRoZW1lICsgJy9hc3NldHMvc3R5bGVzL2Zvcm0uY3NzJyk7XG4gICAgICAgICAgICBzdHlsZXNoZWV0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZXNoZWV0KTtcblxuICAgICAgICAgICAgY3NzX3JlcXVlc3RlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBzdWJtaXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgc3VibWl0X2hvdmVyKTtcbiAgICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyogIC8vLy8gIC0tfCAgICBFbGVtZW50LnByb3RvdHlwZS5nYWxsZXJ5KCBzZXR0aW5ncyApXG5cbiAgICAqIFNjcm9sbCBkb2N1bWVudCB0byBlbGVtZW50XG4qL1xuXG5FbGVtZW50LnByb3RvdHlwZS5nYWxsZXJ5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXR0aW5ncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cblxuICAgIC8vIFRoZSBkZWZhdWx0IHNldHRpbmdzXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICBhcnJvd3M6IHRydWUsXG4gICAgICAgIGNsb3NlOiB0cnVlXG4gICAgfTtcblxuICAgIC8vIEFzc2lnbiBzZXR0aW5ncyBhcyBkZWZhdWx0cyBpZiBzZXR0aW5ncyBhcmUgbm90IHNldFxuICAgIGlmIChPYmplY3Qua2V5cyhzZXR0aW5ncykubGVuZ3RoID09IDApIHNldHRpbmdzID0gZGVmYXVsdHM7XG5cbiAgICAvLyBPdmVycmlkZSB0aGUgZGVmYXVsdHMgd2l0aCBhbnkgZGVmaW5lZCBzZXR0aW5nc1xuICAgIHZhciBfID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgc2V0dGluZ3MpO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSB2aWV3ZXJcbiAgICB2YXIgdmlld2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgIHZpZXdlcl9pbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIHZhciBhcnJvd19wcmV2aW91cyA9IHZvaWQgMCxcbiAgICAgICAgYXJyb3dfbmV4dCA9IHZvaWQgMDtcbiAgICBpZiAoXy5hcnJvd3MpIHtcblxuICAgICAgICBhcnJvd19wcmV2aW91cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4gICAgICAgIHZhciBsZWZ0X3N2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyksXG4gICAgICAgICAgICBsZWZ0X3N2Z19wYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG5cbiAgICAgICAgbGVmdF9zdmcuc2V0QXR0cmlidXRlKCd4bWxucycsICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycpO1xuICAgICAgICBsZWZ0X3N2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdib3gnLCAnMCAwIDExLjI5IDIwJyk7XG4gICAgICAgIGxlZnRfc3ZnX3BhdGguc2V0QXR0cmlidXRlKCdkJywgJ00xLjUsMjBhMS41MSwxLjUxLDAsMCwxLTEuMy0uNzUsMS41NywxLjU3LDAsMCwxLC4zLTEuODhsNi42Ny02LjY2YTEsMSwwLDAsMCwwLTEuNDJMLjQ0LDIuNTZBMS41LDEuNSwwLDAsMSwyLjU2LjQ0TDEwLjcsOC41OGEyLDIsMCwwLDEsMCwyLjg0TDIuNTYsMTkuNTZBMS41MSwxLjUxLDAsMCwxLDEuNSwyMFonKTtcbiAgICAgICAgbGVmdF9zdmcuYXBwZW5kQ2hpbGQobGVmdF9zdmdfcGF0aCk7XG4gICAgICAgIGFycm93X3ByZXZpb3VzLmFwcGVuZENoaWxkKGxlZnRfc3ZnKTtcblxuICAgICAgICBhcnJvd19uZXh0ID0gYXJyb3dfcHJldmlvdXMuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICAgIGFycm93X3ByZXZpb3VzLmNsYXNzTGlzdC5hZGQoJ3ByZXZpb3VzJyk7XG4gICAgICAgIGFycm93X3ByZXZpb3VzLnNldEF0dHJpYnV0ZSgnZGF0YS1nYWxsZXJ5LWNvbnRyb2wnLCAncHJldmlvdXMnKTtcbiAgICAgICAgYXJyb3dfcHJldmlvdXMuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ1ZpZXcgdGhlIHByZXZpb3VzIGltYWdlJyk7XG5cbiAgICAgICAgYXJyb3dfbmV4dC5jbGFzc0xpc3QuYWRkKCduZXh0Jyk7XG4gICAgICAgIGFycm93X25leHQuc2V0QXR0cmlidXRlKCdkYXRhLWdhbGxlcnktY29udHJvbCcsICduZXh0Jyk7XG4gICAgICAgIGFycm93X25leHQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ1ZpZXcgdGhlIG5leHQgaW1hZ2UnKTtcblxuICAgICAgICB2aWV3ZXIuYXBwZW5kQ2hpbGQoYXJyb3dfcHJldmlvdXMpO1xuICAgICAgICB2aWV3ZXIuYXBwZW5kQ2hpbGQoYXJyb3dfbmV4dCk7XG4gICAgfVxuXG4gICAgdmFyIGNsb3NlID0gdm9pZCAwO1xuICAgIGlmIChfLmNsb3NlKSB7XG4gICAgICAgIGNsb3NlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICAgICAgdmFyIGNsb3NlX3N2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyksXG4gICAgICAgICAgICBjbG9zZV9zdmdfcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuXG4gICAgICAgIGNsb3NlX3N2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zJywgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyk7XG4gICAgICAgIGNsb3NlX3N2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdib3gnLCAnMCAwIDIwIDIwJyk7XG4gICAgICAgIGNsb3NlX3N2Z19wYXRoLnNldEF0dHJpYnV0ZSgnZCcsICdNMTIuODMsMTAuNzFhMSwxLDAsMCwxLDAtMS40Mmw2LjczLTYuNzNBMS41LDEuNSwwLDAsMCwxNy40NC40NEwxMC43MSw3LjE3YTEsMSwwLDAsMS0xLjQyLDBMMi41Ni40NEExLjUsMS41LDAsMCwwLC40NCwyLjU2TDcuMTcsOS4yOWExLDEsMCwwLDEsMCwxLjQyTC41MywxNy4zNGExLjYsMS42LDAsMCwwLS4xNiwyLjE1LDEuNSwxLjUsMCwwLDAsMi4xOS4wN2w2LjczLTYuNzNhMSwxLDAsMCwxLDEuNDIsMGw2LjczLDYuNzNhMS41LDEuNSwwLDAsMCwyLjE5LS4wNywxLjYsMS42LDAsMCwwLS4xNi0yLjE1WicpO1xuICAgICAgICBjbG9zZV9zdmcuYXBwZW5kQ2hpbGQoY2xvc2Vfc3ZnX3BhdGgpO1xuICAgICAgICBjbG9zZS5hcHBlbmRDaGlsZChjbG9zZV9zdmcpO1xuXG4gICAgICAgIGNsb3NlLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlJyk7XG4gICAgICAgIGNsb3NlLnNldEF0dHJpYnV0ZSgnZGF0YS1nYWxsZXJ5LWNvbnRyb2wnLCAnY2xvc2UnKTtcbiAgICAgICAgY2xvc2Uuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0Nsb3NlIHRoZSBpbWFnZScpO1xuXG4gICAgICAgIHZpZXdlci5hcHBlbmRDaGlsZChjbG9zZSk7XG4gICAgfVxuXG4gICAgdmlld2VyLmNsYXNzTGlzdC5hZGQoJ2dhbGxlcnktdmlld2VyJyk7XG5cbiAgICB2aWV3ZXIuYXBwZW5kQ2hpbGQodmlld2VyX2ltZyk7XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdlcik7XG5cbiAgICB2YXIgZ2FsbGVyeSA9IHRoaXMsXG4gICAgICAgIGltYWdlcyA9IGdhbGxlcnkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpO1xuXG4gICAgdmFyIHNvdXJjZXMgPSBbXTtcblxuICAgIHZhciBpID0gMDtcblxuICAgIC8vIExpc3RlbiBmb3IgaW1hZ2UgY2xpY2tzXG5cbiAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcCgpIHtcblxuICAgICAgICB2YXIgaW1nX2luX2xvb3AgPSBpbWFnZXNbaV07XG4gICAgICAgIHNvdXJjZXMucHVzaChpbWdfaW5fbG9vcC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpO1xuXG4gICAgICAgIGltZ19pbl9sb29wLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2aWV3ZXJfaW1nLnNyYyA9IGltZ19pbl9sb29wLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKTtcblxuICAgICAgICAgICAgaWYgKHZpZXdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc3BsYXknKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB2aWV3ZXIuY2xhc3NMaXN0LmFkZCgncHJlJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZpZXdlci5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5Jyk7XG4gICAgICAgICAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCduby1zY3JvbGwnKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBfbG9vcCgpO1xuICAgIH1cblxuICAgIHZhciBjb3VudGVyID0gc291cmNlcy5sZW5ndGg7XG5cbiAgICAvLyBDbG9zZSB0aGUgdmlld2VyXG4gICAgdmlld2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZpZXdlci5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5Jyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmlld2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZScpO1xuICAgICAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCduby1zY3JvbGwnKTtcbiAgICAgICAgfSwgNjAwKTtcbiAgICB9KTtcblxuICAgIHZpZXdlcl9pbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuXG4gICAgYXJyb3dfcHJldmlvdXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIGRvUHJldigpO1xuICAgIH0pO1xuXG4gICAgYXJyb3dfbmV4dC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgZG9OZXh0KCk7XG4gICAgfSk7XG5cbiAgICAvLyBTd2l0Y2ggYmV0d2VlbiBpbWFnZXMgaW4gdGhlIHZpZXdlclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgIHZhciBrZXkgPSBlLmtleUNvZGUgfHwgZS53aGljaDtcblxuICAgICAgICAvLyBMZWZ0IGFycm93XG4gICAgICAgIGlmIChrZXkgPT0gMzcpIGRvUHJldigpO1xuXG4gICAgICAgIC8vIFJpZ2h0IGFycm93XG4gICAgICAgIGlmIChrZXkgPT0gMzkpIGRvTmV4dCgpO1xuICAgIH0pO1xuXG4gICAgLy8gU3dpdGNoIHRvIHByZXZpb3VzIGltYWdlXG4gICAgZnVuY3Rpb24gZG9QcmV2KCkge1xuICAgICAgICB2YXIgY3VycmVudF9wb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZ2V0Q3VyclBvc2l0aW9uKCk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRfcG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgdmlld2VyX2ltZy5zcmMgPSBzb3VyY2VzW2NvdW50ZXIgLSAxXTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZpZXdlcl9pbWcuc3JjID0gc291cmNlc1tjdXJyZW50X3Bvc2l0aW9uIC0gMV07XG4gICAgfVxuXG4gICAgLy8gU3dpdGNoIHRvIG5leHQgaW1hZ2VcbiAgICBmdW5jdGlvbiBkb05leHQoKSB7XG4gICAgICAgIHZhciBjdXJyZW50X3Bvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBnZXRDdXJyUG9zaXRpb24oKTtcblxuICAgICAgICBpZiAoY3VycmVudF9wb3NpdGlvbiArIDEgPT0gY291bnRlcikge1xuICAgICAgICAgICAgdmlld2VyX2ltZy5zcmMgPSBzb3VyY2VzWzBdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmlld2VyX2ltZy5zcmMgPSBzb3VyY2VzW2N1cnJlbnRfcG9zaXRpb24gKyAxXTtcbiAgICB9XG5cbiAgICAvLyBHZXQgY3VycmVudCB2aWV3ZXIgcG9zaXRpb25cbiAgICBmdW5jdGlvbiBnZXRDdXJyUG9zaXRpb24oKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2VzLmluZGV4T2Yodmlld2VyX2ltZy5nZXRBdHRyaWJ1dGUoJ3NyYycpKTtcbiAgICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qICAvLy8vICAtLXwgICAgTEFaWSBMT0FERVIgMi4wXG4gICAgICAgICAqIFRoZSBzZWNvbmQgaXRlcmF0aW9uIG9mIHRoZSBMYXp5IExvYWRlclxuICAgICAgICAqIE5vdyBjb250YWluZWQgd2l0aGluIGZ1bmN0aW9uXG4gICAgICAgICogSGFuZGxlcyBpbWcsIGlmcmFtZSBhbmQgYmFja2dyb3VuZC1pbWFnZXMgYWxsIGluIG9uZVxuICAgICAgICAqIFVwZGF0ZWQgdG8gRVM2IHdpdGggYXJyb3cgZnVuY3Rpb25zIGFuZCBpbnRlcnBvbGF0aW9uXG4gICAgKi9cblxuICAgIHZhciBsYXp5Q29udGVudCA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmxhenknKSksXG4gICAgICAgIGxpc3RlZCA9IFsnSU1HJywgJ0lGUkFNRSddO1xuXG4gICAgaWYgKCdJbnRlcnNlY3Rpb25PYnNlcnZlcicgaW4gd2luZG93KSB7XG5cbiAgICAgICAgdmFyIGxhenlPYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbiAoZW50cmllcywgb2JzZXJ2ZXIpIHtcblxuICAgICAgICAgICAgZW50cmllcy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhenlJdGVtID0gZW50cnkudGFyZ2V0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZWQuaW5kZXhPZihsYXp5SXRlbS5ub2RlTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGF6eUl0ZW0uc3JjID0gbGF6eUl0ZW0uZGF0YXNldC5zcmM7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXp5SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdsYXp5Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXp5SXRlbS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7bGF6eUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbGF6eScpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGF6eU9ic2VydmVyLnVub2JzZXJ2ZShsYXp5SXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIHsgcm9vdE1hcmdpbjogJzBweCAwcHggJyArIHdpbmRvdy5pbm5lckhlaWdodCArICdweCAwcHgnIH0pO1xuXG4gICAgICAgIGxhenlDb250ZW50LmZvckVhY2goZnVuY3Rpb24gKGxhenlJdGVtKSB7XG4gICAgICAgICAgICBsYXp5T2JzZXJ2ZXIub2JzZXJ2ZShsYXp5SXRlbSk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdmFyIGFjdGl2ZSA9IGZhbHNlLFxuICAgICAgICAgICAgbGF6eUxvYWQgPSBmdW5jdGlvbiBsYXp5TG9hZCgpIHtcblxuICAgICAgICAgICAgaWYgKGFjdGl2ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhenlDb250ZW50LmZvckVhY2goZnVuY3Rpb24gKGxhenlJdGVtKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXp5SXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPD0gd2luZG93LmlubmVySGVpZ2h0ICYmIGxhenlJdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSA+PSB3aW5kb3cuaW5uZXJIZWlnaHQgJiYgZ2V0Q29tcHV0ZWRTdHlsZShsYXp5SXRlbSkuZGlzcGxheSAhPSAnbm9uZScpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZWQuaW5kZXhPZihsYXp5SXRlbS5ub2RlTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXp5SXRlbS5zcmMgPSBsYXp5SXRlbS5kYXRhc2V0LnNyYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF6eUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbGF6eScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhenlJdGVtLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtsYXp5SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdsYXp5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF6eUNvbnRlbnQgPSBsYXp5Q29udGVudC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT09IGxhenlJdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhenlDb250ZW50Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGxhenlMb2FkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxhenlMb2FkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgbGF6eUxvYWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7YWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBsYXp5TG9hZCk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsYXp5TG9hZCk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGxhenlMb2FkKTtcbiAgICB9XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qICAvLy8vICAtLXwgICAgT3JwaGFuXG4gICAgICAgICAqIFNheSBnb29kYnllIHRvIG9ycGhhbiBjaGlsZHJlbiBpbiB0ZXh0O1xuICAgICAgICAgIGJlIGl0IGhlYWRpbmdzLCBwYXJhZ3JhcGhzLCBsaXN0IGl0ZW1zIG9yIHNwYW5zLlxuICAgICAgICAgKiBFeGNsdWRlIGVsZW1lbnRzIHdpdGggZGF0YS1vcnBoYW4gYXR0cmlidXRlXG4gICAgICovXG5cbiAgICAvLyBDb2xsZWN0IHRleHQgZWxlbWVudHNcbiAgICB2YXIgZ3JvdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwJykgfHwgW107XG5cbiAgICAvLyBUaGUgTG9vcFxuICAgIGdyb3VwLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG5cbiAgICAgICAgLy8gQXNzaWduIHRleHQgY29udGVudFxuICAgICAgICB2YXIgY29udGVudCA9IGVsLmlubmVySFRNTCxcbiAgICAgICAgICAgIG5ld05vZGUgPSBbXTtcblxuICAgICAgICBpZiAoY29udGVudC5sZW5ndGggPT0gMCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIFRhcmdldCBlbGVtZW50cyB3aXRoIGJyZWFrIHRhZ3NcbiAgICAgICAgaWYgKGNvbnRlbnQuaW5kZXhPZignPGJyPicpID49IDApIHtcbiAgICAgICAgICAgIHZhciB0ZXh0Tm9kZXMgPSBjb250ZW50LnNwbGl0KCc8YnI+Jyk7XG5cbiAgICAgICAgICAgIHRleHROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5tYXRjaCgvIC9nKS5sZW5ndGggPj0gNSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdOb2RlLnB1c2gobm9fb3JwaGFuKG5vZGUpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdOb2RlLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFJlam9pbiB3aG9sZSBlbGVtZW50IGFuZCB1cGRhdGVcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IG5ld05vZGUuam9pbignPGJyPicpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnRlbnQubWF0Y2goLyAvZykubGVuZ3RoID49IDUpIHtcblxuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gbm9fb3JwaGFuKGNvbnRlbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBSZXBsYWNlIHNwYWNlIHdpdGggJm5ic3A7XG4gICAgZnVuY3Rpb24gbm9fb3JwaGFuKGVsKSB7XG5cbiAgICAgICAgLy8gR2V0IGxhc3Qgc3BhY2UgcG9zaXRpb25cbiAgICAgICAgdmFyIHNwYWNlID0gZWwubGFzdEluZGV4T2YoJyAnKTtcblxuICAgICAgICAvLyBEbyB0aGUgbWFnaWNcbiAgICAgICAgcmV0dXJuIGVsLnNsaWNlKDAsIHNwYWNlKSArIGVsLnNsaWNlKHNwYWNlKS5yZXBsYWNlKCcgJywgJyZuYnNwOycpO1xuICAgIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qICAvLy8vICAtLXwgICAgR2VuZXJhbFxuICAgICAgICAgKiBKdXN0IHNvbWUgbWFnaWNcbiAgICAqL1xuXG4gICAgLy8gIC8vLy8gIC0tfCAgICBGb3Jtc1xuXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNoaWZ0ci1mb3JtXScpKSB7XG5cbiAgICAgICAgLy8gRGVmaW5lIGFsbCBmb3Jtc1xuICAgICAgICB2YXIgZ2VuZXJhbF9mb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaWZ0ci1mb3JtLWdlbmVyYWwnKTtcblxuICAgICAgICBpZiAoZ2VuZXJhbF9mb3JtKSBnZW5lcmFsX2Zvcm0uZm9ybSgpO1xuICAgIH1cblxuICAgIC8vICAvLy8vICAtLXwgICAgQ2Fyb3VzZWxzXG5cbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2hpZnRyLWNhcm91c2VsXScpKSB7XG5cbiAgICAgICAgLy8gRGVmaW5lIGFsbCBjYXJvdXNlbHNcbiAgICAgICAgdmFyIGhvbWVfY2Fyb3VzZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVyby1jYXJvdXNlbCcpO1xuXG4gICAgICAgIGlmIChob21lX2Nhcm91c2VsKSB7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaG9tZV9jYXJvdXNlbC5xdWVyeVNlbGVjdG9yKCcuY29udGVudCcpLmNsYXNzTGlzdC5hZGQoJ2xvYWQnKTtcbiAgICAgICAgICAgICAgICB9LCA4MDApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGhvbWVfY2Fyb3VzZWwuY2Fyb3VzZWwoe1xuICAgICAgICAgICAgICAgIHBhdXNlX29uX21hcmtlcl9ob3ZlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDYwMDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gIC8vLy8gIC0tfCAgICBHYWxsZXJpZXNcblxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zaGlmdHItZ2FsbGVyeV0nKSkge1xuXG4gICAgICAgIC8vIERlZmluZSBhbGwgZ2FsbGVyaWVzXG4gICAgICAgIHZhciBnYWxsZXJ5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbGxlcnknKTtcblxuICAgICAgICBpZiAoZ2FsbGVyeSkgZ2FsbGVyeS5nYWxsZXJ5KCk7XG4gICAgfVxuXG4gICAgLy8gIC8vLy8gIC0tfCAgICBBY2NvcmRpb25zXG5cbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2hpZnRyLWFjY29yZGlvbl0nKSkge1xuXG4gICAgICAgIC8vIERlZmluZSBhbGwgYWNjb3JkaW9uc1xuICAgICAgICB2YXIgYWNjb3JkaW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbicpO1xuXG4gICAgICAgIGlmIChhY2NvcmRpb24pIGFjY29yZGlvbi5hY2NvcmRpb24oKTtcbiAgICB9XG5cbiAgICAvLyAgLy8vLyAgLS18ICAgIFByaW1hcnkgTG9nbyBTaXppbmdcblxuICAgIChmdW5jdGlvbiAobG9nbykge1xuXG4gICAgICAgIHZhciB2aWV3Ym94ID0gbG9nby5nZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnKSxcbiAgICAgICAgICAgIHZhbHVlcyA9IHZpZXdib3guc3BsaXQoJyAnKSxcbiAgICAgICAgICAgIHJhdGlvID0gdmFsdWVzWzJdIC8gdmFsdWVzWzNdLFxuICAgICAgICAgICAgd2lkdGggPSBsb2dvLnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0IC8gMTAgKiByYXRpbztcblxuICAgICAgICBsb2dvLnN0eWxlLndpZHRoID0gd2lkdGggKyAncmVtJztcbiAgICB9KShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGhlX2xvZ28nKSk7XG5cbiAgICAvLyAgLy8vLyAgLS18ICAgIFBvc3RzIFNpZGViYXJcblxuICAgIHgobCwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBzaWRlYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJsb2ctc2lkZWJhcicpO1xuXG4gICAgICAgIGlmIChzaWRlYmFyKSBzaWRlYmFyLmZsb2F0ZXIoKTtcbiAgICB9KTtcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgLyogIC8vLy8gIC0tfCAgICBOYXZpZ2F0aW9uIFByaW1hcnlcbiAgICAgICAgICogSnVzdCBzb21lIG1hZ2ljXG4gICAgKi9cblxuICAgIC8vICAvLy8vICAtLXwgICAgVG9wLWxldmVsIHZhcmlhYmxlc1xuXG4gICAgdmFyIHRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2dnbGUnKSxcbiAgICAgICAgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4tbmF2JyksXG4gICAgICAgIHN1Yl9uYXZzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGkucGFyZW50Jyk7XG5cbiAgICAvLyAgLy8vLyAgLS18ICAgIFRvZ2dsZSBoaWRkZW4gbmF2aWdhdGlvblxuXG4gICAgdmFyIGhlYWRlcl90cmFuc2l0aW9uX2hlaWdodCA9ICcxMDB2aCc7XG5cbiAgICB2YXIgc3RvcCA9IGZ1bmN0aW9uIHN0b3AoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH07XG5cbiAgICB2YXIgdG9nZ2xlX21lbnUgPSBmdW5jdGlvbiB0b2dnbGVfbWVudShlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdG9nZ2xlLmNsYXNzTGlzdC50b2dnbGUoJ3RyYW5zaXRpb24nKTtcbiAgICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCduby1zY3JvbGwnKTtcblxuICAgICAgICBpZiAoaGVhZGVyLm9mZnNldEhlaWdodCA+IG5hdi5vZmZzZXRIZWlnaHQpIHtcbiAgICAgICAgICAgIGhlYWRlci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLmhlaWdodCA9IGhlYWRlcl90cmFuc2l0aW9uX2hlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hdi5jbGFzc0xpc3QudG9nZ2xlKCdzaG93Jyk7XG4gICAgfTtcblxuICAgIHZhciB0b2dnbGVfd2luZG93ID0gZnVuY3Rpb24gdG9nZ2xlX3dpbmRvdygpIHtcbiAgICAgICAgdG9nZ2xlLmNsYXNzTGlzdC5yZW1vdmUoJ3RyYW5zaXRpb24nKTtcbiAgICAgICAgaGVhZGVyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnJyk7XG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm8tc2Nyb2xsJyk7XG4gICAgICAgIG5hdi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgfTtcblxuICAgIHgobCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB0b2dnbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVfbWVudSk7XG4gICAgICAgIG5hdi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHN0b3ApO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVfd2luZG93KTtcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZV9tZW51KTtcbiAgICAgICAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3RvcCk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZV93aW5kb3cpO1xuICAgIH0sIHRydWUpO1xuXG4gICAgLy8gIC8vLy8gIC0tfCAgICBTdWItbWVudVxuXG4gICAgeChsLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgc3ViX25hdnMuZm9yRWFjaChmdW5jdGlvbiAoc3ViKSB7XG5cbiAgICAgICAgICAgIHZhciBsaW5rID0gc3ViLmNoaWxkcmVuWzBdLFxuICAgICAgICAgICAgICAgIG1lbnUgPSBzdWIuY2hpbGRyZW5bMV0sXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29wZW4gPSB2b2lkIDA7XG5cbiAgICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocmVtb3ZlX29wZW4pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHN1Yi5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzdWIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29wZW4gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3ViLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlbW92ZV9vcGVuKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICByZW1vdmVfb3BlbiA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzdWIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHN1Yl9uYXZzLmZvckVhY2goZnVuY3Rpb24gKHN1Yikge1xuXG4gICAgICAgICAgICB2YXIgbGluayA9IHN1Yi5jaGlsZHJlblswXSxcbiAgICAgICAgICAgICAgICBtZW51ID0gc3ViLmNoaWxkcmVuWzFdLFxuICAgICAgICAgICAgICAgIHJlbW92ZV9vcGVuID0gdm9pZCAwO1xuXG4gICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBzdWIuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSkoKTsiXX0=
