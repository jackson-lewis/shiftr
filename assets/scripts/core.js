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
            var marker = document.createElement('div'),
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
        left_svg.setAttribute('viewbox', '0 0 100 100');
        left_svg_path.setAttribute('d', '');
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
        close_svg.setAttribute('viewbox', '0 0 100 100');
        close_svg_path.setAttribute('d', '');
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

    var i = 0,
        img_in_loop;

    // Listen for image clicks
    for (var i = 0; i < images.length; i++) {

        img_in_loop = images[i];
        sources.push(img_in_loop.getAttribute('data-src'));

        img_in_loop.addEventListener('click', function () {

            viewer_img.src = img_in_loop.getAttribute('src');

            if (viewer.classList.contains('display')) return;

            viewer.classList.add('pre');

            setTimeout(function () {
                viewer.classList.add('display');
            }, 100);
        });
    }

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

    arrow_previous.addEventListener('click', function (e) {
        e.stopPropagation();

        var current_position = sources.indexOf(viewer_img.getAttribute('src'));

        if (current_position == 0) {
            viewer_img.src = sources[counter - 1];

            return;
        }

        viewer_img.src = sources[current_position - 1];
    });

    arrow_next.addEventListener('click', function (e) {
        e.stopPropagation();

        var current_position = sources.indexOf(viewer_img.getAttribute('src'));

        if (current_position + 1 == counter) {

            viewer_img.src = sources[0];

            return;
        }

        viewer_img.src = sources[current_position + 1];
    });

    // Switch between images in the viewer
    document.addEventListener('keydown', function (e) {

        var key = e.keyCode || e.which,
            current_position = sources.indexOf(viewer_img.getAttribute('src'));

        console.log(viewer_img.getAttribute('src'));

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

    document.querySelector('.gallery').gallery();
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
        header = document.querySelector('.header-primary'),
        body = document.body;

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

                console.log('click');

                sub.classList.toggle('show');
            });
        });
    });

    //  ////  --|    SIZE UP SVG LOGO


    var the_logo = document.getElementById('the_logo'),
        viewbox = the_logo.getAttribute('viewBox'),
        values = viewbox.split(' '),
        ratio = values[2] / values[3],
        width = the_logo.parentElement.offsetHeight / 10 * ratio;

    the_logo.style.width = width + 'rem';

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
})();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9wb2x5ZmlsbC5qcyIsImFuaW1hdGUuanMiLCJjYXJvdXNlbC5qcyIsImZsb2F0ZXIuanMiLCJmb2xsb3dlci5qcyIsImdhbGxlcnkuanMiLCJpbml0LmpzIiwiYWNjb3JkaW9uLmpzIiwiY29va2llLmpzIiwiZm9ybV9oYW5kbGVyLmpzIiwiZ2VuZXJpYy5qcyIsImxhenlfbG9hZGVyLmpzIiwibWFwc19hcGlfbGF6eV9sb2FkZXIuanMiLCJvcnBoYW4uanMiLCJwb3B1cHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDblVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FKaFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FLVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4vKiAgLy8vLyAgLS18ICAgIFBvbHlmaWxsc1xuXG4gICAgKiBcbiovXG5cbi8vIE9iamVjdC5hc3NpZ25cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnblxuXG5pZiAodHlwZW9mIE9iamVjdC5hc3NpZ24gIT0gJ2Z1bmN0aW9uJykge1xuXG4gIC8vIE11c3QgYmUgd3JpdGFibGU6IHRydWUsIGVudW1lcmFibGU6IGZhbHNlLCBjb25maWd1cmFibGU6IHRydWVcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdCwgXCJhc3NpZ25cIiwge1xuICAgIHZhbHVlOiBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCB2YXJBcmdzKSB7XG4gICAgICAvLyAubGVuZ3RoIG9mIGZ1bmN0aW9uIGlzIDJcbiAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgaWYgKHRhcmdldCA9PSBudWxsKSB7XG4gICAgICAgIC8vIFR5cGVFcnJvciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRvID0gT2JqZWN0KHRhcmdldCk7XG5cbiAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2luZGV4XTtcblxuICAgICAgICBpZiAobmV4dFNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgICAgLy8gU2tpcCBvdmVyIGlmIHVuZGVmaW5lZCBvciBudWxsXG4gICAgICAgICAgZm9yICh2YXIgbmV4dEtleSBpbiBuZXh0U291cmNlKSB7XG4gICAgICAgICAgICAvLyBBdm9pZCBidWdzIHdoZW4gaGFzT3duUHJvcGVydHkgaXMgc2hhZG93ZWRcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobmV4dFNvdXJjZSwgbmV4dEtleSkpIHtcbiAgICAgICAgICAgICAgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRvO1xuICAgIH0sXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufSIsIid1c2Ugc3RyaWN0JztcblxuLyogIC8vLy8gIC0tfCAgICBFbGVtZW50LnByb3RvdHlwZS5hbmltYXRlU2Nyb2xsKCBkdXJhdGlvbiwgYnVmZmVyIClcblxuICAgICogU2Nyb2xsIGRvY3VtZW50IHRvIGVsZW1lbnRcbiovXG5cbkVsZW1lbnQucHJvdG90eXBlLmFuaW1hdGVTY3JvbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGR1cmF0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAxMDAwO1xuICAgIHZhciBidWZmZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG5cblxuICAgIC8vIFVwZGF0ZSBidWZmZXIgdG8gaW5jbHVkZSBoZWlnaHQgb2YgaGVhZGVyXG4gICAgYnVmZmVyICs9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKS5vZmZzZXRIZWlnaHQ7XG5cbiAgICB2YXIgcnVuID0gdHJ1ZTtcblxuICAgIC8vIFNldHRpbmdzXG4gICAgdmFyIHN0YXJ0X3BvcyA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgICB0YXJnZXRfcG9zID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBzdGFydF9wb3MsXG4gICAgICAgIGRpc3RhbmNlID0gdGFyZ2V0X3BvcyAtIHN0YXJ0X3BvcyxcbiAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZSAtIGJ1ZmZlcixcbiAgICAgICAgY3VycmVudFRpbWUgPSAwLFxuICAgICAgICBpbmNyZW1lbnQgPSAxNi42NjtcblxuICAgIC8vIERvIHRoZSBhbmltYXRpb25cbiAgICB2YXIgYW5pbWF0ZV9zY3JvbGwgPSBmdW5jdGlvbiBhbmltYXRlX3Njcm9sbCgpIHtcblxuICAgICAgICBpZiAocnVuID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICAgIGN1cnJlbnRUaW1lICs9IGluY3JlbWVudDtcblxuICAgICAgICB2YXIgdmFsID0gTWF0aC5lYXNlSW5PdXRRdWFkKGN1cnJlbnRUaW1lLCBzdGFydF9wb3MsIGRpc3RhbmNlLCBkdXJhdGlvbik7XG5cbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gdmFsO1xuXG4gICAgICAgIGlmIChjdXJyZW50VGltZSA8IGR1cmF0aW9uKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGFuaW1hdGVfc2Nyb2xsLCBpbmNyZW1lbnQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEVhc2luZy4uLlxuICAgIE1hdGguZWFzZUluT3V0UXVhZCA9IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XG5cbiAgICAgICAgdCAvPSBkIC8gMjtcblxuICAgICAgICBpZiAodCA8IDEpIHJldHVybiBjIC8gMiAqIHQgKiB0ICsgYjtcblxuICAgICAgICB0LS07XG5cbiAgICAgICAgcmV0dXJuIC1jIC8gMiAqICh0ICogKHQgLSAyKSAtIDEpICsgYjtcbiAgICB9O1xuXG4gICAgLy8gRG8gaW5pdGlhbCBpdGVyYXRpb25cbiAgICBhbmltYXRlX3Njcm9sbCgpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qICAvLy8vICAtLXwgICAgRWxlbWVudC5wcm90b3R5cGUuY2Fyb3VzZWwoIHNldHRpbmdzID0gT2JqZWN0IClcblxuICAgIEBzaW5jZSAxLjBcblxuICAgIEBwb2x5ZmlsbHM6IE9iamVjdC5hc3NpZ25cbiovXG5cbkVsZW1lbnQucHJvdG90eXBlLnNoaWZ0ckNhcm91c2VsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXR0aW5ncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cblxuICAgIC8vIFRoZSBkZWZhdWx0IHNldHRpbmdzXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICAgICAgc3BlZWQ6IDQwMDAsXG4gICAgICAgIHRyYW5zaXRpb246IDgwMCxcbiAgICAgICAgc2hvd19tYXJrZXJzOiB0cnVlLFxuICAgICAgICBwYXVzZV9vbl9tYXJrZXJfaG92ZXI6IHRydWVcbiAgICB9O1xuXG4gICAgdmFyIGkgPSAwO1xuXG4gICAgLy8gQXNzaWduIHNldHRpbmdzIGFzIGRlZmF1bHRzIGlmIHNldHRpbmdzIGFyZSBub3Qgc2V0XG4gICAgaWYgKE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGggPT0gMCkgc2V0dGluZ3MgPSBkZWZhdWx0cztcblxuICAgIC8vIE92ZXJyaWRlIHRoZSBkZWZhdWx0cyB3aXRoIGFueSBkZWZpbmVkIHNldHRpbmdzXG4gICAgdmFyIF8gPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBzZXR0aW5ncyk7XG5cbiAgICAvLyBUaGUgbWFpbiBjYXJvdXNlbCBlbGVtZW50c1xuICAgIHZhciBjYXJvdXNlbCA9IHRoaXMsXG4gICAgICAgIHN0YWdlID0gdGhpcy5jaGlsZHJlblswXSxcbiAgICAgICAgcHJvcHMgPSB0aGlzLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBuYXZpZ2F0aW9uXG4gICAgdmFyIHN0YWdlX21hcCA9IHZvaWQgMDtcbiAgICBpZiAoc2hvd19tYXJrZXJzKCkpIHtcbiAgICAgICAgc3RhZ2VfbWFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHN0YWdlX21hcC5jbGFzc0xpc3QuYWRkKCdzdGFnZS1tYXAnKTtcblxuICAgICAgICBjYXJvdXNlbC5hcHBlbmRDaGlsZChzdGFnZV9tYXApO1xuICAgIH1cblxuICAgIC8vIFRoZSBwYXVzZSB2YXJpYWJsZVxuICAgIHZhciBwYXVzZV9sb29wID0gZmFsc2UsXG4gICAgICAgIHRyYW5zaXRpb25faW5fcHJvZ3Jlc3MgPSBmYWxzZSxcbiAgICAgICAgaGlnaGVzdF9wcm9wX2hlaWdodCA9IDA7XG5cbiAgICAvLyBJbml0IHRoZSBDYXJvdXNlbFxuICAgIGZvciAoaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIC8vIE1haW4gQ2Fyb3VzZWwgZGF0YVxuICAgICAgICBwcm9wc1tpXS5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsUHJvcCA9IGk7XG4gICAgICAgIHByb3BzW2ldLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxBY3RpdmUgPSAnZmFsc2UnO1xuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWFya2Vyc1xuICAgICAgICBpZiAoc2hvd19tYXJrZXJzKCkpIHtcbiAgICAgICAgICAgIHZhciBtYXJrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgICAgICBpbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuICAgICAgICAgICAgbWFya2VyLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxNYXJrZXIgPSBpO1xuXG4gICAgICAgICAgICAvLyBBZGQgbWFya2VyIHRvIG5hdmlnYXRpb24gZWxlbWVudFxuICAgICAgICAgICAgbWFya2VyLmFwcGVuZENoaWxkKGlubmVyKTtcbiAgICAgICAgICAgIHN0YWdlX21hcC5hcHBlbmRDaGlsZChtYXJrZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmluZCB0aGUgaGlnaGVzdCBwcm9wXG4gICAgICAgIGlmIChwcm9wc1tpXS5vZmZzZXRIZWlnaHQgPiBoaWdoZXN0X3Byb3BfaGVpZ2h0KSB7XG4gICAgICAgICAgICBoaWdoZXN0X3Byb3BfaGVpZ2h0ID0gcHJvcHNbaV0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBzdGFnZSBoZWlnaHQsIHVzaW5nIHRoZSBoZWlnaHQgb2YgdGhlIGhpZ2hlc3QgcHJvcFxuICAgIHN0YWdlLnN0eWxlLmhlaWdodCA9IGhpZ2hlc3RfcHJvcF9oZWlnaHQgKyAncHgnO1xuXG4gICAgLy8gQXNzaWduIG1hcmtlcnMgYWZ0ZXIgY3JlYXRpb25cbiAgICB2YXIgbWFya2VycyA9IHZvaWQgMDtcbiAgICBpZiAoc2hvd19tYXJrZXJzKCkpIHtcbiAgICAgICAgbWFya2VycyA9IE9iamVjdC5rZXlzKHN0YWdlX21hcC5jaGlsZHJlbikubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGFnZV9tYXAuY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2V0LXVwIGZpcnN0IHByb3AgYW5kIG1hcmtlclxuICAgIHByb3BzWzBdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIHByb3BzWzBdLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxBY3RpdmUgPSAndHJ1ZSc7XG5cbiAgICBpZiAoc2hvd19tYXJrZXJzKCkpIHtcbiAgICAgICAgbWFya2Vyc1swXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG5cbiAgICAvLyBHZXQgYWxsIGVsZW1lbnRzIGluIHRoZSBwcm9wXG4gICAgdmFyIGltYWdlcyA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIGltYWdlcy5wdXNoKFtdKTtcblxuICAgICAgICB2YXIgcHJvcF9lbGVtZW50cyA9IHByb3BzW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJyonKTtcblxuICAgICAgICBwcm9wX2VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG5cbiAgICAgICAgICAgIGlmIChlbC5ub2RlTmFtZSA9PSAnSU1HJykge1xuICAgICAgICAgICAgICAgIGltYWdlc1tpXS5wdXNoKGVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gR2V0IHRoZSBmaXJzdCBhbmQgc2Vjb25kIHByb3AgaW1hZ2VzXG4gICAgaWYgKGltYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGdldF9pbWFnZXMoaW1hZ2VzWzBdKTtcbiAgICB9XG5cbiAgICBpZiAoaW1hZ2VzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZ2V0X2ltYWdlcyhpbWFnZXNbMV0pO1xuICAgICAgICB9LCBfLnNwZWVkIC8gMik7XG4gICAgfVxuXG4gICAgLy8gVGhlIG1haW4gbG9vcFxuICAgIHZhciB0aGVfbG9vcCA9IGZ1bmN0aW9uIHRoZV9sb29wKCkge1xuXG4gICAgICAgIC8vIFBhdXNlIG9uIGhvdmVyXG4gICAgICAgIGlmIChwYXVzZV9sb29wKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgLy8gRWFybHkgZXhpdCBpZiB0cmFuc2l0aW9uIGlzIGluIHByb2dyZXNzXG4gICAgICAgIGlmICh0cmFuc2l0aW9uX2luX3Byb2dyZXNzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgLy8gRGVmaW5lIHRyYW5zaXRpb24gc3RhcnRcbiAgICAgICAgdHJhbnNpdGlvbl9pbl9wcm9ncmVzcyA9IHRydWU7XG5cbiAgICAgICAgLy8gR2V0IGluZm8gb2YgYWN0aXZlIHByb3BcbiAgICAgICAgdmFyIGFjdGl2ZV9wcm9wID0gZ2V0X2FjdGl2ZV9wcm9wKCksXG4gICAgICAgICAgICBhY3RpdmVfcHJvcF9pZCA9IGdldF9hY3RpdmVfcHJvcF9pZChhY3RpdmVfcHJvcCk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFjdGl2ZSBtYXJrZXJcbiAgICAgICAgaWYgKHNob3dfbWFya2VycygpKSB7XG4gICAgICAgICAgICBtYXJrZXJzW2FjdGl2ZV9wcm9wX2lkXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG9uIHRoZSBsYXN0IHByb3BcbiAgICAgICAgaWYgKGFjdGl2ZV9wcm9wX2lkID09IHByb3BzLmxlbmd0aCAtIDEpIHtcblxuICAgICAgICAgICAgLy8gU2V0IG5ldyBwcm9wXG4gICAgICAgICAgICBwcm9wc1swXS5zdHlsZS56SW5kZXggPSAxNTA7XG4gICAgICAgICAgICBwcm9wc1swXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHByb3BzWzBdLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxBY3RpdmUgPSAndHJ1ZSc7XG5cbiAgICAgICAgICAgIGlmIChzaG93X21hcmtlcnMoKSkge1xuICAgICAgICAgICAgICAgIG1hcmtlcnNbMF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHByb3BzWzBdLnN0eWxlLnpJbmRleCA9ICcnO1xuICAgICAgICAgICAgfSwgXy50cmFuc2l0aW9uKTtcblxuICAgICAgICAgICAgLy8gU3RhbmRhcmQgc3dpdGNoXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciBuZXh0X3Byb3AgPSBhY3RpdmVfcHJvcC5uZXh0RWxlbWVudFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgbmV4dF9wcm9wX2lkID0gcGFyc2VJbnQobmV4dF9wcm9wLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxQcm9wLCAxMCk7XG5cbiAgICAgICAgICAgIG5leHRfcHJvcC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIG5leHRfcHJvcC5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsQWN0aXZlID0gJ3RydWUnO1xuXG4gICAgICAgICAgICBpZiAoc2hvd19tYXJrZXJzKCkpIHtcbiAgICAgICAgICAgICAgICBtYXJrZXJzW25leHRfcHJvcF9pZF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhY3RpdmVfcHJvcF9pZCA9PSBwcm9wcy5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgICAgICAgLy8gQWxsIHByb3AgaW1hZ2VzIHNob3VsZCBoYXZlIGxvYWRlZC4uLlxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmIChpbWFnZXNbbmV4dF9wcm9wX2lkICsgMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0X2ltYWdlcyhpbWFnZXNbbmV4dF9wcm9wX2lkICsgMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBhY3RpdmUgcHJvcFxuICAgICAgICBhY3RpdmVfcHJvcC5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsQWN0aXZlID0gJ2ZhbHNlJztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBhY3RpdmVfcHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8gRGVmaW5lIHRyYW5zaXRpb24gZW5kXG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luX3Byb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIH0sIF8udHJhbnNpdGlvbik7XG4gICAgfTtcblxuICAgIHZhciBsb29waW5nID0gdm9pZCAwLFxuICAgICAgICByZXN0YXJ0ID0gdm9pZCAwO1xuXG4gICAgaWYgKF8uYXV0b3BsYXkpIHtcbiAgICAgICAgbG9vcGluZyA9IHNldEludGVydmFsKHRoZV9sb29wLCBfLnNwZWVkKTtcbiAgICB9XG5cbiAgICBpZiAoc2hvd19tYXJrZXJzKCkpIHtcblxuICAgICAgICBtYXJrZXJzLmZvckVhY2goZnVuY3Rpb24gKG1hcmtlcikge1xuXG4gICAgICAgICAgICBtYXJrZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBFYXJseSBleGl0IGlmIHRyYW5zaXRpb24gaXMgaW4gcHJvZ3Jlc3NcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNpdGlvbl9pbl9wcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICBwYXVzZV9sb29wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBhY3RpdmVfcHJvcCBhbmQgYWN0aXZlX3Byb3BfaWQgYXJlIGNvcmVjdFxuICAgICAgICAgICAgICAgIHZhciBhY3RpdmVfcHJvcCA9IGdldF9hY3RpdmVfcHJvcCgpLFxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVfcHJvcF9pZCA9IGdldF9hY3RpdmVfcHJvcF9pZChhY3RpdmVfcHJvcCk7XG5cbiAgICAgICAgICAgICAgICAvLyBJc3N1ZXMgd2l0aCBzZWxlY3RlZF9wcm9wXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkX3Byb3AgPSBwcm9wc1ttYXJrZXIuZGF0YXNldC5zaGlmdHJDYXJvdXNlbE1hcmtlcl0sXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX3Byb3BfaWQgPSBtYXJrZXIuZGF0YXNldC5zaGlmdHJDYXJvdXNlbE1hcmtlcjtcblxuICAgICAgICAgICAgICAgIC8vIFR1cm4gb2ZmIHBhdXNlIHRvIGFsbG93IGNoYW5nZVxuICAgICAgICAgICAgICAgIHBhdXNlX2xvb3AgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIC8vIFN0b3AgY3VycmVudCBhY3Rpb25zXG4gICAgICAgICAgICAgICAgaWYgKF8uYXV0b3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChsb29waW5nKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc3RhcnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVfcHJvcF9pZCAhPSBzZWxlY3RlZF9wcm9wX2lkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRGVmaW5lIHRyYW5zaXRpb24gc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9pbl9wcm9ncmVzcyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGFjdGl2ZSBwcm9wc1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXJzW2FjdGl2ZV9wcm9wX2lkXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgcHJvcFxuICAgICAgICAgICAgICAgICAgICBwcm9wc1tzZWxlY3RlZF9wcm9wX2lkXS5zdHlsZS56SW5kZXggPSAxNTA7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzW3NlbGVjdGVkX3Byb3BfaWRdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBwcm9wc1tzZWxlY3RlZF9wcm9wX2lkXS5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsQWN0aXZlID0gJ3RydWUnO1xuXG4gICAgICAgICAgICAgICAgICAgIG1hcmtlcnNbc2VsZWN0ZWRfcHJvcF9pZF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udGludWUgcmVtb3ZlXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZV9wcm9wLmRhdGFzZXQuc2hpZnRyQ2Fyb3VzZWxBY3RpdmUgPSAnZmFsc2UnO1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZV9wcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHNbc2VsZWN0ZWRfcHJvcF9pZF0uc3R5bGUuekluZGV4ID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlZmluZSB0cmFuc2l0aW9uIGVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9pbl9wcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9LCBfLnRyYW5zaXRpb24pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJlc3RhcnQgbG9vcCwgaWYgcGF1c2VkXG4gICAgICAgICAgICAgICAgaWYgKF8uYXV0b3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdGFydCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9vcGluZyA9IHNldEludGVydmFsKHRoZV9sb29wLCBfLnNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgXy5zcGVlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1hcmtlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAvLyB3YXMgdXNpbmcgYWN0aXZlX3Byb3AgaW5zdGVhZCBvZiBzZWxlY3RlZF9wcm9wXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkX3Byb3AgPSBwcm9wc1ttYXJrZXIuZGF0YXNldC5zaGlmdHJDYXJvdXNlbE1hcmtlcl0sXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX3Byb3BfaWQgPSBtYXJrZXIuZGF0YXNldC5zaGlmdHJDYXJvdXNlbE1hcmtlcjtcblxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHNlbGVjdGVkX3Byb3AgKTtcblxuICAgICAgICAgICAgICAgIGlmIChfLnBhdXNlX29uX21hcmtlcl9ob3Zlcikge1xuICAgICAgICAgICAgICAgICAgICBwYXVzZV9sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgYWxsIHByb3AgaW1hZ2VzIGhhdmUgbG9hZGVkXG4gICAgICAgICAgICAgICAgaWYgKGltYWdlc1tzZWxlY3RlZF9wcm9wX2lkXSkge1xuICAgICAgICAgICAgICAgICAgICBnZXRfaW1hZ2VzKGltYWdlc1tzZWxlY3RlZF9wcm9wX2lkXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1hcmtlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgcGF1c2VfbG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEdldCBpbWFnZXNcbiAgICBmdW5jdGlvbiBnZXRfaW1hZ2VzKHN1Yl9pbWFnZXMpIHtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc3ViX2ltYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHN1Yl9pbWFnZXNbaV0uaGFzQXR0cmlidXRlKCdzcmMnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBzdWJfaW1hZ2VzW2ldLnNyYyA9IHN1Yl9pbWFnZXNbaV0uZGF0YXNldC5zcmM7XG4gICAgICAgICAgICAgICAgc3ViX2ltYWdlc1tpXS5kYXRhc2V0LnNyYyA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gR2V0IGRhdGEgb24gdGhlIGFjdGl2ZSBwcm9wXG4gICAgZnVuY3Rpb24gZ2V0X2FjdGl2ZV9wcm9wKCkge1xuXG4gICAgICAgIHZhciB0aGVfcHJvcCA9IHZvaWQgMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1tpXS5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsQWN0aXZlID09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgIHRoZV9wcm9wID0gcHJvcHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhlX3Byb3A7XG4gICAgfVxuXG4gICAgLy8gR2V0IGFjdGl2ZSBwcm9wIGlkXG4gICAgZnVuY3Rpb24gZ2V0X2FjdGl2ZV9wcm9wX2lkKHRoZV9wcm9wKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGVfcHJvcC5kYXRhc2V0LnNoaWZ0ckNhcm91c2VsUHJvcCwgMTApO1xuICAgIH1cblxuICAgIC8vIFRvZ2dsZSBmb3IgbWFya2Vyc1xuICAgIGZ1bmN0aW9uIHNob3dfbWFya2VycygpIHtcbiAgICAgICAgaWYgKF8uc2hvd19tYXJrZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiAgRWxlbWVudC5wcm90b3R5cGUuZmxvYXRlclxuICpcbiAqICBAc2luY2UgMS4wXG4gKlxuICogIEBwYXJhbSBzZXR0aW5ncyBPYmplY3QgVGhlIHNldHRpbmdzIGZvciB0aGUgZmxvYXRlciB0YXJnZXQgZWxlbWVudFxuICogIEBwb2x5ZmlsbCBPYmplY3QuYXNzaWduXG4gKlxuICovXG5cbkVsZW1lbnQucHJvdG90eXBlLmZsb2F0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNldHRpbmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuXG4gICAgLy8gVGhlIGRlZmF1bHQgc2V0dGluZ3NcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIGJvdW5kaW5nOiB0aGlzLnBhcmVudEVsZW1lbnQsIC8vIEVsZW1lbnRcbiAgICAgICAgZmxvYXRfYnVmZmVyOiAwLCAvLyBJbnRlZ2FyXG4gICAgICAgIGhlYWRlcjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpLCAvLyBFbGVtZW50fG51bGxcbiAgICAgICAgc3RhcnRpbmc6IG51bGwsIC8vIG51bGx8RWxlbWVudFxuICAgICAgICBlbmRpbmc6IG51bGwsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgcmVzaXplOiB3aW5kb3csXG4gICAgICAgICAgICBvcmllbnRhdGlvbmNoYW5nZTogd2luZG93XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQXNzaWduIHNldHRpbmdzIGFzIGRlZmF1bHRzIGlmIHNldHRpbmdzIGFyZSBub3Qgc2V0XG4gICAgaWYgKE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGggPT0gMCkgc2V0dGluZ3MgPSBkZWZhdWx0cztcblxuICAgIC8vIE92ZXJyaWRlIHRoZSBkZWZhdWx0cyB3aXRoIGFueSBkZWZpbmVkIHNldHRpbmdzXG4gICAgdmFyIF8gPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBzZXR0aW5ncyk7XG5cbiAgICAvLyBHbG9iYWwgdmFyaWFibGVzXG4gICAgdmFyIGZsb2F0ZXIgPSB0aGlzLFxuICAgICAgICBib3VuZGluZyA9IF8uYm91bmRpbmcsXG4gICAgICAgIGZsb2F0ZXJfcG9zaXRpb24sXG4gICAgICAgIGZsb2F0ZXJfbGVmdCxcbiAgICAgICAgYm91bmRpbmdfcG9zaXRpb24sXG4gICAgICAgIGJvdW5kaW5nX3RvcCxcbiAgICAgICAgYm91bmRpbmdfYm90dG9tLFxuICAgICAgICBmbG9hdF9wb3NpdGlvbiA9IF8uZmxvYXRfYnVmZmVyLFxuICAgICAgICBwb3NpdGlvbl90b3AsXG4gICAgICAgIHBvc2l0aW9uX2JvdHRvbSxcbiAgICAgICAgc3RhcnRpbmdfcG9pbnQsXG4gICAgICAgIGVuZGluZ19wb2ludDtcblxuICAgIC8vIENoZWNrIGlmIGhlYWRlciBoZWlnaHQgc2hvdWxkIGJlIGluY2x1ZGVkIGluIGZsb2F0X3Bvc2l0aW9uXG4gICAgaWYgKF8uaGVhZGVyKSBmbG9hdF9wb3NpdGlvbiArPSBfLmhlYWRlci5vZmZzZXRIZWlnaHQ7XG5cbiAgICAvLyBUaGUgY29yZSBmdW5jdGlvbiB0aGF0IGV2ZW50IGxpc3RlbmVycyBhcmUgYXBwZW5kZWQgdG9cbiAgICB2YXIgYWN0aW9uID0gZnVuY3Rpb24gYWN0aW9uKGUpIHtcblxuICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICAgIHZhciBzY3JvbGxfcG9zaXRpb24gPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblxuICAgICAgICAvLyBXZSBkbyBub3Qgd2FudCB0byByZWRlZmluZSB0aGUgZm9sbG93aW5nIG9uIGEgc2Nyb2xsXG4gICAgICAgIGlmIChlLnR5cGUgIT0gJ3Njcm9sbCcpIHtcblxuICAgICAgICAgICAgZmxvYXRlcl9wb3NpdGlvbiA9IGZsb2F0ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBib3VuZGluZ19wb3NpdGlvbiA9IGJvdW5kaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBmbG9hdGVyX2xlZnQgPSBmbG9hdGVyX3Bvc2l0aW9uLmxlZnQ7XG5cbiAgICAgICAgICAgIGlmIChfLnN0YXJ0aW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgc3RhcnRpbmdfcG9pbnQgPSBfLnN0YXJ0aW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHNjcm9sbF9wb3NpdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhcnRpbmdfcG9pbnQgPSBib3VuZGluZ19wb3NpdGlvbi50b3AgKyBzY3JvbGxfcG9zaXRpb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLmVuZGluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGVuZGluZ19wb2ludCA9IF8uZW5kaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSArIHNjcm9sbF9wb3NpdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZW5kaW5nX3BvaW50ID0gYm91bmRpbmdfcG9zaXRpb24uYm90dG9tICsgc2Nyb2xsX3Bvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0dXAgdGhlIHN0YXJ0aW5nIGFuZCBlbmRpbmcgcG9pbnRzIGluY2x1ZGluZyBidWZmZXIgYXJlYXNcbiAgICAgICAgcG9zaXRpb25fdG9wID0gc2Nyb2xsX3Bvc2l0aW9uICsgZmxvYXRfcG9zaXRpb247XG4gICAgICAgIHBvc2l0aW9uX2JvdHRvbSA9IHNjcm9sbF9wb3NpdGlvbiArIGZsb2F0X3Bvc2l0aW9uICsgZmxvYXRlci5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgLy8gRGVjaWRlIHdoYXQgc3RhdGUgdGhlIGZsb2F0ZXIgc2hvdWxkIGJlIGluIGJhc2VkIG9uIHNjcm9sbCBwb3NpdGlvbi4uLlxuICAgICAgICBpZiAocG9zaXRpb25fYm90dG9tID49IGVuZGluZ19wb2ludCkge1xuICAgICAgICAgICAgZmxvYXRlci5jbGFzc0xpc3QuYWRkKCdwYXVzZScpO1xuICAgICAgICAgICAgZmxvYXRlci5jbGFzc0xpc3QucmVtb3ZlKCdzdGlja3knKTtcbiAgICAgICAgICAgIGZsb2F0ZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICcnKTtcbiAgICAgICAgfSBlbHNlIGlmIChwb3NpdGlvbl90b3AgPj0gc3RhcnRpbmdfcG9pbnQpIHtcbiAgICAgICAgICAgIGZsb2F0ZXIuc3R5bGUud2lkdGggPSBib3VuZGluZy5vZmZzZXRXaWR0aCArICdweCc7XG4gICAgICAgICAgICBmbG9hdGVyLnN0eWxlLnRvcCA9IGZsb2F0X3Bvc2l0aW9uICsgJ3B4JztcbiAgICAgICAgICAgIGZsb2F0ZXIuc3R5bGUubGVmdCA9IGJvdW5kaW5nX3Bvc2l0aW9uLmxlZnQgKyAncHgnO1xuICAgICAgICAgICAgZmxvYXRlci5jbGFzc0xpc3QuYWRkKCdzdGlja3knKTtcbiAgICAgICAgICAgIGZsb2F0ZXIuY2xhc3NMaXN0LnJlbW92ZSgncGF1c2UnKTtcbiAgICAgICAgfSBlbHNlIGlmIChwb3NpdGlvbl90b3AgPD0gc3RhcnRpbmdfcG9pbnQpIHtcbiAgICAgICAgICAgIGZsb2F0ZXIuY2xhc3NMaXN0LnJlbW92ZSgnc3RpY2t5Jyk7XG4gICAgICAgICAgICBmbG9hdGVyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVGhlIGV2ZW50IGxpc3RlbmVycy4uLlxuICAgIE9iamVjdC5rZXlzKF8uZXZlbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIF8uZXZlbnRzW2VdLmFkZEV2ZW50TGlzdGVuZXIoZSwgYWN0aW9uKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBhY3Rpb24pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBhY3Rpb24pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qICBFbGVtZW50LnByb3RvdHlwZS5mb2xsb3dlclxuICpcbiAqICBAc2luY2UgMS4wXG4gKlxuICogIEBwYXJhbSBzZXR0aW5ncyBPYmplY3QgVGhlIHNldHRpbmdzIGZvciB0aGUgZmxvYXRlciB0YXJnZXQgZWxlbWVudFxuICogIEBwb2x5ZmlsbCBPYmplY3QuYXNzaWduXG4gKlxuICovXG5cbkVsZW1lbnQucHJvdG90eXBlLmZvbGxvd2VyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXR0aW5ncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cblxuICAgIC8vIFRoZSBkZWZhdWx0IHNldHRpbmdzXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICBzZWN0aW9uczogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2VjdGlvbicpXG4gICAgfTtcblxuICAgIC8vIEFzc2lnbiBzZXR0aW5ncyBhcyBkZWZhdWx0cyBpZiBzZXR0aW5ncyBhcmUgbm90IHNldFxuICAgIGlmIChPYmplY3Qua2V5cyhzZXR0aW5ncykubGVuZ3RoID09IDApIHNldHRpbmdzID0gZGVmYXVsdHM7XG5cbiAgICAvLyBPdmVycmlkZSB0aGUgZGVmYXVsdHMgd2l0aCBhbnkgZGVmaW5lZCBzZXR0aW5nc1xuICAgIHZhciBfID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgc2V0dGluZ3MpO1xuXG4gICAgLy8gR2xvYmFsIHZhcmlhYmxlc1xuICAgIHZhciBuYXYgPSB0aGlzLFxuICAgICAgICBsaW5rcyA9IHRoaXMucXVlcnlTZWxlY3RvckFsbCgnc3BhbicpLFxuICAgICAgICBzZWN0aW9ucyA9IF8uc2VjdGlvbnMsXG4gICAgICAgIHNlY3Rpb25fcG9zaXRpb24sXG4gICAgICAgIHNlY3Rpb25faWQsXG4gICAgICAgIHNlY3Rpb25fdG9wLFxuICAgICAgICBzZWN0aW9uX2JvdHRvbTtcblxuICAgIGxpbmtzLmZvckVhY2goZnVuY3Rpb24gKGxpbmspIHtcblxuICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihsaW5rLmdldEF0dHJpYnV0ZSgnZGF0YS1vbi1wYWdlLWxpbmsnKSkuYW5pbWF0ZVNjcm9sbCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHZhciBhY3Rpb24gPSBmdW5jdGlvbiBhY3Rpb24oZSkge1xuXG4gICAgICAgIC8vIEdldCB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb25cbiAgICAgICAgdmFyIHNjcm9sbF9wb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgICAgICAgdGFyZ2V0X3BvaW50ID0gc2Nyb2xsX3Bvc2l0aW9uICsgdmgoKSAvIDI7XG5cbiAgICAgICAgc2VjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoc2VjdGlvbikge1xuXG4gICAgICAgICAgICBpZiAoZS50eXBlICE9ICdzY3JvbGwnKSB7XG5cbiAgICAgICAgICAgICAgICBzZWN0aW9uX3Bvc2l0aW9uID0gc2VjdGlvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgIHNlY3Rpb25fdG9wID0gc2VjdGlvbl9wb3NpdGlvbi50b3AgKyBzY3JvbGxfcG9zaXRpb247XG4gICAgICAgICAgICAgICAgc2VjdGlvbl9ib3R0b20gPSBzZWN0aW9uX3Bvc2l0aW9uLmJvdHRvbSArIHNjcm9sbF9wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGlkID0gc2VjdGlvbi5nZXRBdHRyaWJ1dGUoJ2lkJykuc3Vic3RyaW5nKDgpLFxuICAgICAgICAgICAgICAgIHNlY3Rpb25fdG9wID0gc2VjdGlvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBzY3JvbGxfcG9zaXRpb24sXG4gICAgICAgICAgICAgICAgc2VjdGlvbl9ib3R0b20gPSBzZWN0aW9uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSArIHNjcm9sbF9wb3NpdGlvbjtcblxuICAgICAgICAgICAgaWYgKHRhcmdldF9wb2ludCA+IHNlY3Rpb25fdG9wICYmIHRhcmdldF9wb2ludCA8IHNlY3Rpb25fYm90dG9tKSB7XG5cbiAgICAgICAgICAgICAgICBsaW5rc1tpZCAtIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGxpbmtzW2lkIC0gMV0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgYWN0aW9uKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgYWN0aW9uKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgLyogIC8vLy8gIC0tfCAgICBHYWxsZXJ5XG4gICAgICAgICAqIEJyYW5kIG5ldyBjb21wb25lbnRcbiAgICAqL1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbGxlcnknKS5nYWxsZXJ5KCk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuLyogIFxuICAgIC8vLy8gIC0tfCAgICBJTklUIEpTXG5cbiAgICAqIFNldC11cCBKYXZhU2NyaXB0XG4qL1xuXG5mdW5jdGlvbiBvbl9sb2FkKCkge1xuXHRcdFx0XHR2YXIgZm4gPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGZ1bmN0aW9uIChlKSB7fTtcblxuXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRcdGZuO1xuXHRcdFx0XHR9KTtcbn1cblxuLyogIC8vLy8gIC0tfCAgICBSZXR1cm4gd2luZG93IHNpemVcblxuICAgICogVHdpbiBmdW5jdGlvbnMsIG9uZSBmb3Igd2lkdGggYW5kIGFub3RoZXIgZm9yIGhlaWdodFxuKi9cblxuZnVuY3Rpb24gdncoKSB7XG5cdFx0XHRcdHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aDtcbn1cblxuZnVuY3Rpb24gdmgoKSB7XG5cdFx0XHRcdHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG59XG5cbi8qICAvLy8vICAtLXwgICAgV2lkdGggQnJlYWtwb2ludCAtIHRoZSBKUyBlcXVpdmlsYW50IHRvIENTUyBtZWRpYSBxdWVyaWVzXG5cbiAgICAqIEVuc3VyZSBicmVha3BvaW50IHNldHRpbmdzIG1hdGNoIHRob3NlIHNldCBpbiB0aGUgc3R5bGVzXG4qL1xuXG52YXIgcyA9ICdzJztcbnZhciBtID0gJ20nO1xudmFyIGwgPSAnbCc7XG52YXIgeGwgPSAneGwnO1xudmFyIG1heCA9ICdtYXgnO1xuXG5mdW5jdGlvbiB4KHdpZHRoLCBmbikge1xuXHRcdFx0XHR2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IGZ1bmN0aW9uICgpIHt9O1xuXHRcdFx0XHR2YXIgcnVuX29uY2UgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IGZhbHNlO1xuXG5cblx0XHRcdFx0dmFyIHZhbHVlO1xuXG5cdFx0XHRcdHN3aXRjaCAod2lkdGgpIHtcblx0XHRcdFx0XHRcdFx0XHRjYXNlIHM6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IDQ1MDticmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIG06XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IDc2ODticmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIGw6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IDEwMjQ7YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSB4bDpcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gMTYwMDticmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIG1heDpcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gMTkyMDticmVhaztcblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSB3aWR0aDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBydW4gPSBmdW5jdGlvbiBydW4oKSB7XG5cblx0XHRcdFx0XHRcdFx0XHR2YXIgYWxsb3cgPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmICh2dygpID4gdmFsdWUpIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJ1bl9vbmNlID09PSB0cnVlICYmIGFsbG93ID09PSBmYWxzZSkgcmV0dXJuO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmbigpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhbGxvdyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChydW5fb25jZSA9PT0gdHJ1ZSAmJiBhbGxvdyA9PT0gdHJ1ZSkgcmV0dXJuO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYWxsYmFjaygpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhbGxvdyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBydW4pO1xuXHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcnVuKTtcblx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgcnVuKTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAvKiAgLy8vLyAgLS18ICAgIEFjY29yZGlvblxuICAgICAgICAgQHNpbmNlIDEuMFxuICAgICovXG5cbiAgICAvLyBDaGVjayBHYWxsZXJ5IGNvbXBvbmVudCBleGlzdHMgb24gcGFnZVxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zaGlmdHItYWNjb3JkaW9uXScpID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgICB2YXIgYWNjb3JkaW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbicpLFxuICAgICAgICBhY2NvcmRpb25fc2luZ2xlcyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2luZ2xlJyk7XG5cbiAgICBhY2NvcmRpb25fc2luZ2xlcy5mb3JFYWNoKGZ1bmN0aW9uIChzaW5nbGUpIHtcblxuICAgICAgICBzaW5nbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBzaW5nbGUuY2xhc3NMaXN0LnRvZ2dsZSgnb3BlbicpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgLyogIC8vLy8gIC0tfCAgICBDb29raWVcbiAgICAgICAgICogSGFuZGxlIHRoZSBTaGlmdHIgQ29va2llIENvbnNlbnRcbiAgICAqL1xuXG4gICAgLy8gIC8vLy8gIC0tfCAgICBUaGlzIGlzIHdoZXJlIHdlIHNldCB0aGUgY29va2llXG5cbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaWZ0ci1jb29raWUtbm90aWNlJykgPT09IG51bGwpIHJldHVybjtcblxuICAgIHZhciBjb29raWVfYWNjZXB0ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hpZnRyLWNvb2tpZS1hY2NlcHQnKTtcbiAgICB2YXIgc2hpZnRyX2Nvb2tpZV9ub3RpY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpZnRyLWNvb2tpZS1ub3RpY2UnKTtcblxuICAgIGNvb2tpZV9hY2NlcHRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBzaGlmdHJfY29va2llX25vdGljZS5jbGFzc0xpc3QuYWRkKCdhY2NlcHRlZCcpO1xuXG4gICAgICAgIC8vIFByZXBhcmUgdGhlIGNvb2tpZVxuICAgICAgICB2YXIgY29va2llX25hbWUgPSAnc2hpZnRyXycgKyBzaGlmdHIubmFtZSArICdfY29uc2VudCc7XG5cbiAgICAgICAgY29va2llX25hbWUgPSBjb29raWVfbmFtZS5yZXBsYWNlKCcgJywgJ18nKTtcbiAgICAgICAgY29va2llX25hbWUgPSBjb29raWVfbmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIHZhciBjb29raWVfZXhwaXJ5ID0gJ1RodSwgMTggRGVjIDIwMTkgMTI6MDA6MDAgVVRDJztcblxuICAgICAgICAvLyBTZXQgdGhlIGNvb2tpZVxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWVfbmFtZSArICc9JyArIHRydWUgKyAnOyBleHBpcmVzPScgKyBjb29raWVfZXhwaXJ5ICsgJzsgcGF0aD0vJztcblxuICAgICAgICAvLyBOb3csIHJlbW92ZSB0aGUgbm90aWNlXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2hpZnRyX2Nvb2tpZV9ub3RpY2UuY2xhc3NMaXN0LnJlbW92ZSgncG9zdGVkJyk7XG4gICAgICAgIH0sIDc1MCk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNoaWZ0cl9jb29raWVfbm90aWNlKTtcbiAgICAgICAgfSwgMjAwMCk7XG4gICAgfSk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qICAvLy8vICAtLXwgICAgRk9STSBIQU5ETEVSIDAuNSBbQkVUQV1cbiAgICAgICAgICogU2hpcHMgMTAwJSBkeW5hbWljLCBub3QgdGllZCB0byBhIHNwZWNpZmljIGZvcm0sXG4gICAgICAgICAgYWxsb3dpbmcgbXVsdGlwbGUgZm9ybXMgdG8gdXNlIHRoZSB3aG9sZSBtb2R1bGVcbiAgICAqL1xuXG4gICAgLy8gIC0tfCAgICBTRVRUSU5HU1xuICAgIHZhciBzZXR0aW5ncyA9IHNoaWZ0ci5mb3JtO1xuXG4gICAgLy8gVmFsaWRhdGlvbiBjbGFzc2VzXG4gICAgdmFyIHZjID0ge1xuICAgICAgICBmb2N1czogJ2ZvY3VzJyxcbiAgICAgICAgc3VjY2VzczogJ3N1Y2Nlc3MnLFxuICAgICAgICBlcnJvcjogJ2Vycm9yJ1xuICAgIH07XG5cbiAgICAvLyAgLS18ICAgIEZJRUxEU1xuXG4gICAgdmFyIGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0LCB0ZXh0YXJlYScpLFxuICAgICAgICBsaXN0ZWQgPSBbJ25hbWUnLCAndGV4dCcsICdlbWFpbCddO1xuXG4gICAgaW5wdXRzLmZvckVhY2goZnVuY3Rpb24gKGlucHV0KSB7XG5cbiAgICAgICAgaWYgKGxpc3RlZC5pbmRleE9mKGlucHV0LnR5cGUpID49IDAgfHwgaW5wdXQubm9kZU5hbWUgPT0gJ1RFWFRBUkVBJykge1xuXG4gICAgICAgICAgICAvLyB0YXJnZXQgaXMgbGFiZWxcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBpbnB1dC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCh2Yy5mb2N1cyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQodmMuZm9jdXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9ICcnO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc05hbWUgPSAnJztcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlICE9ICcnKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tWYWxpZGl0eSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCh2Yy5zdWNjZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX3ZhbGlkYXRpb24odGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCh2Yy5lcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW52YWxpZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQodmMuZXJyb3IpO1xuXG4gICAgICAgICAgICAgICAgZG9fdmFsaWRhdGlvbih0aGlzLCB0aGlzLnZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnR5cGUgPT0gJ2NoZWNrYm94Jykge1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhcl92YWxpZGF0aW9uKGlucHV0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW52YWxpZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgZG9fdmFsaWRhdGlvbih0aGlzLCB0aGlzLnZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBkb192YWxpZGF0aW9uKGlucHV0LCBtZXNzYWdlKSB7XG5cbiAgICAgICAgdmFyIG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbiAgICAgICAgbS5jbGFzc0xpc3QuYWRkKCd2YWxpZGF0aW9uJyk7XG4gICAgICAgIG0uaW5uZXJIVE1MID0gbWVzc2FnZTtcbiAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChtKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG0uY2xhc3NMaXN0LmFkZCgncG9wJyk7XG4gICAgICAgIH0sIDQwMCk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjbGVhcl92YWxpZGF0aW9uKGlucHV0KTtcbiAgICAgICAgfSwgNjAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJfdmFsaWRhdGlvbihpbnB1dCkge1xuXG4gICAgICAgIHZhciBuZXh0RWwgPSBpbnB1dC5uZXh0RWxlbWVudFNpYmxpbmc7XG5cbiAgICAgICAgaWYgKG5leHRFbCkge1xuXG4gICAgICAgICAgICBpZiAobmV4dEVsLm5vZGVOYW1lID09ICdTUEFOJykge1xuXG4gICAgICAgICAgICAgICAgbmV4dEVsLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcCcpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQobmV4dEVsKTtcbiAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyogIC0tfCAgICBIYW5kbGUgdGhlIHN1Ym1pc3Npb25cbiAgICAgICAgICAqIElFIDEwLTExOiBkb2VzIG5vdCBzdXBwb3J0IGpzb24gYXMgcmVzcG9uc2VUeXBlXG4gICAgICAgICogRmlyZWZveCA2LTk6IGRvZXMgbm90IHN1cHBvcnQganNvbiBhcyByZXNwb25zZVR5cGVcbiAgICAgICAgKiBGaXJlZm94IDYtMTE6IGRvZXMgbm90IHN1cHBvcnQgLnRpbWVvdXQgYW5kIC5vbnRpbWVvdXRcbiAgICAgICAgKiBDaHJvbWUgNy0yODogZG9lcyBub3Qgc3VwcG9ydCAudGltZW91dCBhbmQgLm9udGltZW91dFxuICAgICAgICAqIENocm9tZSA3LTMwOiBkb2VzIG5vdCBzdXBwb3J0IGpzb24gYXMgcmVzcG9uc2VUeXBlXG4gICAgICAgICogU2FmYXJpIDUtNzogZG9lcyBub3Qgc3VwcG9ydCAudGltZW91dCBhbmQgLm9udGltZW91dFxuICAgICAgICAqIFNhZmFyaSA2LjEtNzogZG9lcyBub3Qgc3VwcG9ydCBqc29uIGFzIHJlc3BvbnNlVHlwZVxuICAgICAqL1xuXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtJykpIHtcbiAgICAgICAgdmFyIGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybScpO1xuXG4gICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwic3VibWl0XCJdJykuY2xhc3NMaXN0LmFkZCgnc3VibWl0dGluZycpO1xuXG4gICAgICAgICAgICB2YXIgZGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcblxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDQwMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgX2RhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICAgICAgICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJzdWJtaXRcIl0nKS5jbGFzc0xpc3QucmVtb3ZlKCdzdWJtaXR0aW5nJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF9kYXRhLnNlbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZG9fc3VibWlzc2lvbih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJywgeGhyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhbGVydChzZXR0aW5ncy54aHJfZXJyb3IpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCBzZXR0aW5ncy5hamF4KTtcbiAgICAgICAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkb19zdWJtaXNzaW9uKHR5cGUpIHtcblxuICAgICAgICB2YXIgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcblxuICAgICAgICB2YXIgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgaGVhZGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcbiAgICAgICAgICAgIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyksXG4gICAgICAgICAgICBlcnJvcl9yZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyksXG4gICAgICAgICAgICBjbG9zZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICAgICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ3N1Ym1pc3Npb24nKTtcblxuICAgICAgICAvLyBTZWxlY3QgY29ycmVzcG9uZGluZyBjb25maXJtYXRpb24gY29udGVudFxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcblxuICAgICAgICAgICAgY2FzZSAnUE9TVCcgfHwgJ01BSUwnOlxuICAgICAgICAgICAgICAgIHZhciBib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBoOiBzZXR0aW5ncy5lcnJvcl9oZWFkaW5nLFxuICAgICAgICAgICAgICAgICAgICBjOiBzZXR0aW5ncy5lcnJvcl9ib2R5XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBlcnJvcl9yZWYuaW5uZXJIVE1MID0gJ0VSUk9SIFJFRjogJyArIHR5cGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdmFyIGJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIGg6IHNldHRpbmdzLnN1Y2Nlc3NfaGVhZGluZyxcbiAgICAgICAgICAgICAgICAgICAgYzogc2V0dGluZ3Muc3VjY2Vzc19ib2R5XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhlYWRpbmcuaW5uZXJIVE1MID0gYm9keS5oO1xuICAgICAgICBjb250ZW50LmlubmVySFRNTCA9IGJvZHkuYztcblxuICAgICAgICBjbG9zZXIuaW5uZXJIVE1MID0gJ0Nsb3NlJztcbiAgICAgICAgY2xvc2VyLnNldEF0dHJpYnV0ZSgnaWQnLCAnY2xvc2Utc3VibWlzc2lvbicpO1xuICAgICAgICBjbG9zZXIuY2xhc3NMaXN0LmFkZCgnYnV0dG9uJyk7XG5cbiAgICAgICAgd3JhcC5hcHBlbmRDaGlsZChoZWFkaW5nKTtcbiAgICAgICAgd3JhcC5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICAgICAgd3JhcC5hcHBlbmRDaGlsZChlcnJvcl9yZWYpO1xuICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKHdyYXApO1xuICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKGNsb3Nlcik7XG5cbiAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChtZXNzYWdlKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgIGNsb3Nlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoYXV0b19jbGVhcik7XG4gICAgICAgICAgICBjbGVhcl9zdWJtaXNzaW9uKG1lc3NhZ2UsIHR5cGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgZXJyb3JfdHlwZXMgPSBbJ1BPU1QnLCAnTUFJTCddLFxuICAgICAgICAgICAgYXV0b19jbGVhcl9kZWxheSA9IHZvaWQgMDtcblxuICAgICAgICBpZiAoZXJyb3JfdHlwZXMuaW5kZXhPZih0eXBlKSA9PSAtMSkge1xuICAgICAgICAgICAgYXV0b19jbGVhcl9kZWxheSA9IDgxMDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdXRvX2NsZWFyX2RlbGF5ID0gMzAwMDA7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYXV0b19jbGVhciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBjbGVhcl9zdWJtaXNzaW9uKG1lc3NhZ2UsIHR5cGUpO1xuICAgICAgICB9LCBhdXRvX2NsZWFyX2RlbGF5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhcl9zdWJtaXNzaW9uKGVsLCBhY3Rpb24pIHtcblxuICAgICAgICBpZiAoYWN0aW9uID09PSB0cnVlKSB7XG5cbiAgICAgICAgICAgIHZhciBpO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAobGlzdGVkLmluZGV4T2YoaW5wdXRzW2ldLnR5cGUpID4gMCB8fCBpbnB1dHNbaV0ubm9kZU5hbWUgPT0gJ1RFWFRBUkVBJykge1xuXG4gICAgICAgICAgICAgICAgICAgIGlucHV0c1tpXS52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dHNbaV0uY2xhc3NOYW1lID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0c1tpXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTmFtZSA9ICcnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXRzW2ldLnR5cGUgPT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dHNbaV0uY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9LCAxMDApO1xuICAgIH1cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgLyogIC8vLy8gIC0tfCAgICBHRU5FUklDXG4gICAgICAgICAqIEp1c3Qgc29tZSBtYWdpY1xuICAgICovXG5cbiAgICAvLyAgLy8vLyAgLS18ICAgIFRPR0dMRSBISURERU4gTUVOVVxuXG5cbiAgICB2YXIgdG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvZ2dsZScpLFxuICAgICAgICBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbi1uYXYnKSxcbiAgICAgICAgc3ViX25hdnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaS5wYXJlbnQnKSxcbiAgICAgICAgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlci1wcmltYXJ5JyksXG4gICAgICAgIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuXG4gICAgdmFyIGhlYWRlcl90cmFuc2l0aW9uX2hlaWdodCA9ICcxMDB2aCc7XG5cbiAgICB2YXIgc3RvcCA9IGZ1bmN0aW9uIHN0b3AoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH07XG5cbiAgICB2YXIgdG9nZ2xlX21lbnUgPSBmdW5jdGlvbiB0b2dnbGVfbWVudShlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdG9nZ2xlLmNsYXNzTGlzdC50b2dnbGUoJ3RyYW5zaXRpb24nKTtcbiAgICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCduby1zY3JvbGwnKTtcblxuICAgICAgICBpZiAoaGVhZGVyLm9mZnNldEhlaWdodCA+IG5hdi5vZmZzZXRIZWlnaHQpIHtcbiAgICAgICAgICAgIGhlYWRlci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLmhlaWdodCA9IGhlYWRlcl90cmFuc2l0aW9uX2hlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hdi5jbGFzc0xpc3QudG9nZ2xlKCdzaG93Jyk7XG4gICAgfTtcblxuICAgIHZhciB0b2dnbGVfd2luZG93ID0gZnVuY3Rpb24gdG9nZ2xlX3dpbmRvdygpIHtcbiAgICAgICAgdG9nZ2xlLmNsYXNzTGlzdC5yZW1vdmUoJ3RyYW5zaXRpb24nKTtcbiAgICAgICAgaGVhZGVyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnJyk7XG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm8tc2Nyb2xsJyk7XG4gICAgICAgIG5hdi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgfTtcblxuICAgIHgobCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB0b2dnbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVfbWVudSk7XG4gICAgICAgIG5hdi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHN0b3ApO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVfd2luZG93KTtcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZV9tZW51KTtcbiAgICAgICAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3RvcCk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZV93aW5kb3cpO1xuICAgIH0sIHRydWUpO1xuXG4gICAgeChsLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgc3ViX25hdnMuZm9yRWFjaChmdW5jdGlvbiAoc3ViKSB7XG5cbiAgICAgICAgICAgIHZhciBsaW5rID0gc3ViLmNoaWxkcmVuWzBdLFxuICAgICAgICAgICAgICAgIG1lbnUgPSBzdWIuY2hpbGRyZW5bMV0sXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29wZW4gPSB2b2lkIDA7XG5cbiAgICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocmVtb3ZlX29wZW4pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHN1Yi5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzdWIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29wZW4gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3ViLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlbW92ZV9vcGVuKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICByZW1vdmVfb3BlbiA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzdWIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHN1Yl9uYXZzLmZvckVhY2goZnVuY3Rpb24gKHN1Yikge1xuXG4gICAgICAgICAgICB2YXIgbGluayA9IHN1Yi5jaGlsZHJlblswXSxcbiAgICAgICAgICAgICAgICBtZW51ID0gc3ViLmNoaWxkcmVuWzFdLFxuICAgICAgICAgICAgICAgIHJlbW92ZV9vcGVuID0gdm9pZCAwO1xuXG4gICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2snKTtcblxuICAgICAgICAgICAgICAgIHN1Yi5jbGFzc0xpc3QudG9nZ2xlKCdzaG93Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyAgLy8vLyAgLS18ICAgIFNJWkUgVVAgU1ZHIExPR09cblxuXG4gICAgdmFyIHRoZV9sb2dvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RoZV9sb2dvJyksXG4gICAgICAgIHZpZXdib3ggPSB0aGVfbG9nby5nZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnKSxcbiAgICAgICAgdmFsdWVzID0gdmlld2JveC5zcGxpdCgnICcpLFxuICAgICAgICByYXRpbyA9IHZhbHVlc1syXSAvIHZhbHVlc1szXSxcbiAgICAgICAgd2lkdGggPSB0aGVfbG9nby5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCAvIDEwICogcmF0aW87XG5cbiAgICB0aGVfbG9nby5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3JlbSc7XG5cbiAgICAvLyAgLy8vLyAgLS18ICAgIEJMT0cgU1RJQ0tZIFNJREVCQVJcblxuXG4gICAgeChsLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHNpZGViYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmxvZy1zaWRlYmFyJyksXG4gICAgICAgICAgICBibG9nX2xheW91dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ibG9nLWxheW91dCA+IGRpdicpO1xuXG4gICAgICAgIGlmIChzaWRlYmFyID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgdmFyIHNpZGViYXJfd2lkdGggPSBzaWRlYmFyLm9mZnNldFdpZHRoLFxuICAgICAgICAgICAgc2lkZWJhcl9wb3MgPSBzaWRlYmFyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgYmxvZ19sYXlvdXRfcG9zID0gYmxvZ19sYXlvdXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGN1cnJfcG9zID0gd2luZG93LnNjcm9sbFk7XG5cbiAgICAgICAgICAgIGlmIChjdXJyX3BvcyArIHNpZGViYXIub2Zmc2V0SGVpZ2h0ICsgaGVhZGVyLm9mZnNldEhlaWdodCArIDIwID49IGJsb2dfbGF5b3V0X3Bvcy5ib3R0b20pIHtcblxuICAgICAgICAgICAgICAgIHNpZGViYXIuY2xhc3NMaXN0LmFkZCgncGF1c2UnKTtcbiAgICAgICAgICAgICAgICBzaWRlYmFyLmNsYXNzTGlzdC5yZW1vdmUoJ3N0aWNreScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyX3BvcyArIGhlYWRlci5vZmZzZXRIZWlnaHQgKyAyMCA+PSBibG9nX2xheW91dF9wb3MudG9wKSB7XG5cbiAgICAgICAgICAgICAgICBzaWRlYmFyLnN0eWxlLndpZHRoID0gc2lkZWJhci5vZmZzZXRXaWR0aCArICdweCc7XG4gICAgICAgICAgICAgICAgc2lkZWJhci5zdHlsZS50b3AgPSBoZWFkZXIub2Zmc2V0SGVpZ2h0ICsgMjAgKyAncHgnO1xuICAgICAgICAgICAgICAgIHNpZGViYXIuc3R5bGUubGVmdCA9IHNpZGViYXJfcG9zLmxlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgIHNpZGViYXIuY2xhc3NMaXN0LmFkZCgnc3RpY2t5Jyk7XG4gICAgICAgICAgICAgICAgc2lkZWJhci5jbGFzc0xpc3QucmVtb3ZlKCdwYXVzZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHNpZGViYXIuY2xhc3NMaXN0LnJlbW92ZSgnc3RpY2t5Jyk7XG4gICAgICAgICAgICAgICAgc2lkZWJhci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vICAvLy8vICAtLXwgICAgQ0FST1VTRUxcblxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zaGlmdHItY2Fyb3VzZWxdJykpIHtcblxuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlcm8tY2Fyb3VzZWwnKSkge1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZXJvLWNhcm91c2VsIC5jb250ZW50JykuY2xhc3NMaXN0LmFkZCgnbG9hZCcpO1xuICAgICAgICAgICAgICAgIH0sIDgwMCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlcm8tY2Fyb3VzZWwnKS5zaGlmdHJDYXJvdXNlbCh7XG4gICAgICAgICAgICAgICAgcGF1c2Vfb25fbWFya2VyX2hvdmVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzcGVlZDogNjAwMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qICAvLy8vICAtLXwgICAgTEFaWSBMT0FERVIgMi4wXG4gICAgICAgICAqIFRoZSBzZWNvbmQgaXRlcmF0aW9uIG9mIHRoZSBMYXp5IExvYWRlclxuICAgICAgICAqIE5vdyBjb250YWluZWQgd2l0aGluIGZ1bmN0aW9uXG4gICAgICAgICogSGFuZGxlcyBpbWcsIGlmcmFtZSBhbmQgYmFja2dyb3VuZC1pbWFnZXMgYWxsIGluIG9uZVxuICAgICAgICAqIFVwZGF0ZWQgdG8gRVM2IHdpdGggYXJyb3cgZnVuY3Rpb25zIGFuZCBpbnRlcnBvbGF0aW9uXG4gICAgKi9cblxuICAgIHZhciBsYXp5Q29udGVudCA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmxhenknKSksXG4gICAgICAgIGxpc3RlZCA9IFsnSU1HJywgJ0lGUkFNRSddO1xuXG4gICAgaWYgKCdJbnRlcnNlY3Rpb25PYnNlcnZlcicgaW4gd2luZG93KSB7XG5cbiAgICAgICAgdmFyIGxhenlPYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbiAoZW50cmllcywgb2JzZXJ2ZXIpIHtcblxuICAgICAgICAgICAgZW50cmllcy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhenlJdGVtID0gZW50cnkudGFyZ2V0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZWQuaW5kZXhPZihsYXp5SXRlbS5ub2RlTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGF6eUl0ZW0uc3JjID0gbGF6eUl0ZW0uZGF0YXNldC5zcmM7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXp5SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdsYXp5Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXp5SXRlbS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7bGF6eUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbGF6eScpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGF6eU9ic2VydmVyLnVub2JzZXJ2ZShsYXp5SXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIHsgcm9vdE1hcmdpbjogJzBweCAwcHggJyArIHdpbmRvdy5pbm5lckhlaWdodCArICdweCAwcHgnIH0pO1xuXG4gICAgICAgIGxhenlDb250ZW50LmZvckVhY2goZnVuY3Rpb24gKGxhenlJdGVtKSB7XG4gICAgICAgICAgICBsYXp5T2JzZXJ2ZXIub2JzZXJ2ZShsYXp5SXRlbSk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdmFyIGFjdGl2ZSA9IGZhbHNlLFxuICAgICAgICAgICAgbGF6eUxvYWQgPSBmdW5jdGlvbiBsYXp5TG9hZCgpIHtcblxuICAgICAgICAgICAgaWYgKGFjdGl2ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhenlDb250ZW50LmZvckVhY2goZnVuY3Rpb24gKGxhenlJdGVtKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXp5SXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPD0gd2luZG93LmlubmVySGVpZ2h0ICYmIGxhenlJdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSA+PSB3aW5kb3cuaW5uZXJIZWlnaHQgJiYgZ2V0Q29tcHV0ZWRTdHlsZShsYXp5SXRlbSkuZGlzcGxheSAhPSAnbm9uZScpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZWQuaW5kZXhPZihsYXp5SXRlbS5ub2RlTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXp5SXRlbS5zcmMgPSBsYXp5SXRlbS5kYXRhc2V0LnNyYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF6eUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbGF6eScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhenlJdGVtLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtsYXp5SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdsYXp5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF6eUNvbnRlbnQgPSBsYXp5Q29udGVudC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT09IGxhenlJdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhenlDb250ZW50Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGxhenlMb2FkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxhenlMb2FkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgbGF6eUxvYWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7YWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBsYXp5TG9hZCk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsYXp5TG9hZCk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGxhenlMb2FkKTtcbiAgICB9XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qICAvLy8vICAtLXwgICAgR09PR0xFIE1BUFMgQVBJIExBWlkgTE9BREVSXG4gICAgICAgICAqIFRoZSBmdW5jdGlvbiBpcyBzcGxpdCwgbWVhbmluZyBsYXp5IGxvYWRpbmcgXG4gICAgICAgICAgY2FuIGJlIHRvZ2dsZWQgZm9yIGRpZmVyZW50IHBhZ2VzIGlmIG5lY2Vzc2FyeVxuICAgICovXG5cbiAgICBmdW5jdGlvbiBtYXBzX2FwaV9sYXp5X2xvYWRlcihrZXkpIHtcblxuICAgICAgICBpZiAoYXBpX2tleSkge1xuXG4gICAgICAgICAgICBpZiAoUEhQX1BBR0VfSUQgPT0gU1RBVElDX1BBR0VfSUQpIHtcblxuICAgICAgICAgICAgICAgIHZhciB3aW5kb3dfaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBtYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhhbGYtbWFwXCIpLFxuICAgICAgICAgICAgICAgICAgICBhcGlfdXJsID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9qcz9jYWxsYmFjaz1pbml0aWFsaXplJmtleT0nICsga2V5O1xuXG4gICAgICAgICAgICAgICAgaWYgKCdJbnRlcnNlY3Rpb25PYnNlcnZlcicgaW4gd2luZG93KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb290TWFyZ2luOiB3aW5kb3dfaGVpZ2h0ICsgJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocmVzaG9sZDogMFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbiAoZW50cmllcywgb2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc0ludGVyc2VjdGluZyA9IHR5cGVvZiBlbnRyaWVzWzBdLmlzSW50ZXJzZWN0aW5nID09PSAnYm9vbGVhbicgPyBlbnRyaWVzWzBdLmlzSW50ZXJzZWN0aW5nIDogZW50cmllc1swXS5pbnRlcnNlY3Rpb25SYXRpbyA+IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0ludGVyc2VjdGluZykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC5zcmMgPSBhcGlfdXJsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZShtYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBvcHRpb25zKTtcblxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKG1hcCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhenlNYXAgPSBmdW5jdGlvbiBsYXp5TWFwKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIDw9IHdpbmRvdy5pbm5lckhlaWdodCAqIDIgJiYgbWFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSA+PSAwICYmIGdldENvbXB1dGVkU3R5bGUobWFwKS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlX3NjcmlwdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBsYXp5TWFwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsYXp5TWFwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGxhenlNYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBsYXp5TWFwKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxhenlNYXApO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBsYXp5TWFwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIElmIGN1cnJlbnQgcGFnZSBkb2Vzbid0IG1hdGNoLCBsb2FkIGltbWVkaWF0ZWx5XG5cbiAgICAgICAgICAgICAgICBjcmVhdGVfc2NyaXB0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVfc2NyaXB0KCkge1xuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgICAgc2NyaXB0LnNyYyA9IGFwaV91cmw7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXBzX2FwaV9sYXp5X2xvYWRlcignQUl6YVN5Qjlucl9vVEgxUnRUZ1lXR1h4Wmo2TVNOVy15YjZoRTdjJyk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAvKiAgLy8vLyAgLS18ICAgIE9SUEhBTlxuICAgICAgICAgKiBTYXkgZ29vZGJ5ZSB0byBvcnBoYW4gY2hpbGRyZW4gaW4gdGV4dDtcbiAgICAgICAgICBiZSBpdCBoZWFkaW5ncywgcGFyYWdyYXBocywgbGlzdCBpdGVtcyBvciBzcGFucy5cbiAgICAgICAgICogRXhjbHVkZSBlbGVtZW50cyB3aXRoIGRhdGEtb3JwaGFuIGF0dHJpYnV0ZVxuICAgICAqL1xuXG4gICAgLy8gQ29sbGVjdCB0ZXh0IGVsZW1lbnRzXG4gICAgdmFyIGdyb3VwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtb3JwaGFuXScpO1xuXG4gICAgLy8gVGhlIExvb3BcbiAgICBncm91cC5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuXG4gICAgICAgIC8vIEFzc2lnbiB0ZXh0IGNvbnRlbnRcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBlbC5pbm5lckhUTUwsXG4gICAgICAgICAgICBuZXdOb2RlID0gW107XG5cbiAgICAgICAgLy8gVGFyZ2V0IGVsZW1lbnRzIHdpdGggYnJlYWsgdGFnc1xuICAgICAgICBpZiAoY29udGVudC5pbmRleE9mKCc8YnI+JykgPj0gMCAmJiBjb250ZW50LmluZGV4T2YoJyAnKSA+PSAwKSB7XG4gICAgICAgICAgICB2YXIgdGV4dE5vZGVzID0gY29udGVudC5zcGxpdCgnPGJyPicpO1xuXG4gICAgICAgICAgICB0ZXh0Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRleHQgd2l0aCBubyBtb3JlIG9ycGhhbnMhXG4gICAgICAgICAgICAgICAgbmV3Tm9kZS5wdXNoKG5vX29ycGhhbihub2RlKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUmVqb2luIHdob2xlIGVsZW1lbnQgYW5kIHVwZGF0ZVxuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gbmV3Tm9kZS5qb2luKCc8YnI+Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29udGVudC5pbmRleE9mKCcgJykgPj0gMCkge1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGV4dCB3aXRoIG5vIG1vcmUgb3JwaGFucyFcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IG5vX29ycGhhbihjb250ZW50KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gUmVwbGFjZSBzcGFjZSB3aXRoICZuYnNwO1xuICAgIGZ1bmN0aW9uIG5vX29ycGhhbihlbCkge1xuXG4gICAgICAgIC8vIEdldCBsYXN0IHNwYWNlIHBvc2l0aW9uXG4gICAgICAgIHZhciBzcGFjZSA9IGVsLmxhc3RJbmRleE9mKCcgJyk7XG5cbiAgICAgICAgLy8gRG8gdGhlIG1hZ2ljXG4gICAgICAgIHJldHVybiBlbC5zbGljZSgwLCBzcGFjZSkgKyBlbC5zbGljZShzcGFjZSkucmVwbGFjZSgnICcsICcmbmJzcDsnKTtcbiAgICB9XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qICAvLy8vICAtLXwgICAgUE9QVVBTXG4gICAgICAgICAqIEJhc2ljIGZ1bmN0aW9uYWxpdHkgdG8gaGFuZGxlIG9wZW5pbmcgYW4gY2xvc2luZ1xuICAgICAgICAgIG9mIHBvcHVwIGVsZW1lbnRzLlxuICAgICAgICAqIENhbiBoYW5kbGUgbXVsdGlwbGUgcG9wdXBzIHBlciBwYWdlXG4gICAgKi9cblxuICAgIHZhciBvcGVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm9wZW4nKSxcbiAgICAgICAgY2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcueCcpLFxuICAgICAgICBib2R5ID0gZG9jdW1lbnQuYm9keTtcblxuICAgIG9wZW4uZm9yRWFjaChmdW5jdGlvbiAob3BlbmVyKSB7XG4gICAgICAgIG9wZW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gb3BlbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuJyksXG4gICAgICAgICAgICAgICAgcG9wdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wb3B1cD1cIicgKyBpbnN0YW5jZSArICdcIl0nKTtcblxuICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgncG9wdXAtYXBwZWFyJyk7XG4gICAgICAgICAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ25vLXNjcm9sbCcpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNsb3NlLmZvckVhY2goZnVuY3Rpb24gKGNsb3Nlcikge1xuICAgICAgICBjbG9zZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciBwb3B1cCA9IGNsb3Nlci5wYXJlbnRFbGVtZW50O1xuXG4gICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKCdwb3B1cC1kaXNhcHBlYXInKTtcbiAgICAgICAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm8tc2Nyb2xsJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLWFwcGVhcicpO1xuICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLWRpc2FwcGVhcicpO1xuICAgICAgICAgICAgfSwgMTIwMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7Il19
