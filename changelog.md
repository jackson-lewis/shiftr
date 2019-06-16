# Changelog


## v1.5.5
*June 2019*
Browser compatibility, bug fixes, documentation update and much more!

### General
* **gulpfile.js** improvements
	* *gulp-postcss* and *autoprefixer* updated
	* *autoprefixer* settings added: grid and >1% of browsers
	* *scripster* task source includes two locations: /scripts/inc/ and /scripts/core/
* Class Shiftr_Walker updated with better code and improved logic
* Several utility functions added:
	* shiftr_get_html()
	* shiftr_get_setting() - currently unused, but ready for future use
	* space_to_()
	* space_to_nbsp()
* Accordion component added
* Support for sub menus in primary navigation
* Functions updated:
	* shiftr_do_acf_image()
* Includes files re-organised, functions categorised and grouped files

### Styles
* Grid Layout now supports IE10+ via use of grid-template-areas
* Removal of auto-fit function in Grid Layout as unsupported in IE
* New mixins:
	* before() - quciker implementation of ::before
	* after() - quciker implementation of ::after

### Scripts
* All Shiftr methods are kept in individual files for better housekeeping
* Polyfill added for Object.assign()
* Element.prototype.carousel() bug fixes
* Element.prototype.floater() added
* Element.prototype.follower() added




## v1.5.4
*10/05/19*
General development, main focus on WP and PHP

### General
* Added **shiftr_acf_editor_toolbar()**, custom toolbars to ACF editors
* Added **shiftr_remove_editor()**, able to remove WP editor by post type. Configurable in *_shiftr-settings.php*
* Added Gallery component
	* As new JS file, contained function
	* New SCSS file, */components/_gallery.scss*
	* Added **shiftr_gallery()**  to new file */inc/**shiftr-gallery.php***
* Added Carousel component
	* Element.prototype.shiftrCarousel() location in */core/_init.js*
* Added dashboard widgets support with **shiftr_add_dashboard_widgets()**
	* **shiftr_dashboard_widget_pages()**, widget to display max 10 pages in alphabetical order.
* New admin page - **Contact Form Settings**
	* Contains default settings for Contact Forms
* Added */inc/**shiftr-install.php***, a file that runs on the first activation of the theme
	* Creates settings for Contact Forms
	* Checks ACF plugin exists and is active
	* Creates admin notice on activation
	* Creates admin notice if ACF is not found or activated
* Added */inc/**shiftr-posts.php***, an inc file dedicated for functions related to posts
* **shiftr_before_head()** renamed to **shiftr_open_head()**
* **shiftr_before_body()** renamed to **shiftr_open_body()**
	* **shiftr_body_open()** hooks into new WP 5.2 function **wp_open_body()**, which is used in header.php
* ACF export JSON file included in theme root for installation - **required**
	* Filename "shiftr-acf-install-[version].json"
* Form Handler uses new Contact Form settings as set using WP Options.
	* Get default values, and override if form specific values are found.

### Styles
* Added new Shiftr stylesheet *admin.css* to back-end
* Added new accessibility file under */styles/features/_accessibility.scss*
	* Includes prefers-reduced-motion media query
* Media query breakpoints array renamed to **$breakpoints** and moved to */_init/_settings.scss*

### Scripts
* Media query breakpoint values 's' and 'max' added
* Added Element.prototype.shiftrAnimateScroll()
	* Animated scroll from current position to desired element
	* Parameters accepted are duration and buffer distance




## v1.5.3
*Late April 2019*

### General
* General cleanup of code
* Contact Link shortcodes [email_link] and [phone_link] now support attributes
* Contact Link supports address
* Added **SHIFTR_INC** and **SHIFTR_FUNC** to *functions.php*
* Added build-it cookie notice
* Better use of Shiftr Settings via ACF - settings are stored, read and edited via *Shape_Shiftr* class
* Shiftr JS Object supports project name
* */functions/navigation.php* cleaned up with better comments




## v1.5.2
*Early April 2019*

### General
* Directory changes
	* All scss sub-directories now found at the root of /assets/styles
	* Changes to /assets
		* /assets/images replaced with /assets/media
		* /assets/media contains \_shiftr, branding, icons and imagery
* Major enhancements to gulpfile.js
	* Introduction of environments in the build, supporting development and production
	* Strip comments and minification of Sass and JS files on production environment
	* JS files combined
	* Sourcemaps available on dev environment for Sass and JS
* Added Tiny MCE external plugins for Shiftr shortcodes [email_link] and [phone_link]
	* Inline email link
	* Inline phone link
* Added Inc files within /inc directory at the root of the theme
	* Each large core function and class of the theme are contained in individual file, like core WP
	* All inc files are called in functions.php, before any standard function files
* Added **Shiftr_Custom_Post_Type** class, used to add new post types by instantizing the class
* Huge number of functions added
* Form Handler updated to v1.3
	* Use $shiftr to call email address
	* Future overhaul to Form Handler coming soon
* Blog Sidebar created, featuring:
	* Sticky positioning
	* Custom search

### Styles
* New functions
	* get_baseline()
	* line_width()
	* rem()
* New core variables
	* $base-font-family
	* $heading-font-family
* Name changes/directory moves
	* **/tools** renamed to **/\_init**
	* /tools/\_variables.scss renamed to /tools/\_setting.scss
	* ../\_grid.scss moved from **/blueprints** to **/\_init**
* Reorder of imports in style.scss
* @import for typography has moved from **/foundation/\_typograhy.scss** to **/tools/\_settings.scss**
* $container-width variable moved from **/blueprint/\_core.scss** to **/tools/\_settings.scss**




## v1.5.1
*Feb 2019*

* Creation of the Form Handler v1.0
* Introduction of the Lazy Loader v2.1
* All core files created




## v1.5.0
*Jan 2019*

* Init of Shape Shiftr
	* Including the init of the Wordpress theme **Shiftr**, as Project Dawn was only standalone Sass and JS files that had to be added to an existing WP theme.
* Depreciation of Project Dawn v1.1

