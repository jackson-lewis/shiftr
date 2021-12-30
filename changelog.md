# Changelog


## v1.6
*30/12/21*

Many long awaited improvements and fixes, with several new features. It offers a more stable foundation as we enter a new year.

### New Flexi Blocks
Shiftr now comes with 7 Flexi Blocks by default.

#### Columns
Columns allows up to 12 columns to be displayed with either 2, 3 or 4 columns per row. Columns are automatically disrupted across rows based on how many columns are present. A column can contain either an image, content, or both together! All standard block settings are available, including a block heading and additional content.

#### Contact
A generic contact block provides a starting point for a commonly required block. By default, the block ships with standard contact details (phone, email and address), social links and a general contact form. Because of this block, a contact form is now enabled out-the-box. The block heading is also available.

#### Google Maps
With a valid Google Maps API key provided, a simple map can be added using ACF Google Map field. This also accepts the zoom, so the zoom level set will be reflected on the frontend also. This is a full width block, and background is not available. Please note that the Google Map API will be automatically lazy loaded, and because of this, only one block is permitted per page.

### Goodbye Internet Explorer
Support for IE has been 100% dropped in this version, with legacy methods such as XHR requests being dropped.

* autoprefixer `grid` support for IE removed
* `XHR` swapped in favour of `fetch()` for contact form submissions.
* JavaScript polyfills removed.

### Gulp
* The default proxy renamed from `shiftr.source`  to `shiftr-dev.test`
* Backticks swapped for single quotes.
* `watch` task renamed to `dev`, however `watch` still available via gulp CLI
* Added `gulp build` to npm `postinstall`

### Templates
* New naming convention on template part files. `/parts/single-post.php` renamed to `/parts/content-post.php` as this is more inline with WordPress naming conventions.
    * The format should be `single-{post_type_name}.php`
* A slightly revised standard hero banner, which supports either a featured image or just the page title.

### Forms
* Some default styling such as `max-width` on the form and inputs have been removed.
* Styling has been simplified to reduce amount of css.
* Fix for file path in Shiftr form handler referencing incorrect file path after directory move.
* Revised styling of validation notices.
* Revised submit message element.
* New error codes for dealing with any server-side errors encountered.
* A JSON response is now sent back instead of a string.
* A fix for file validation which was not correctly set.

### Pagination, Breadcrumbs & Social Links
* The pagination is now correctly included in the archive template, and has default styling. Call the pagination after a loop using `shiftr_pagination()`
* Breadcrumbs, initially set via Yoast SEO, is available using a wrapper function. The wrapper function allows for simple changes like wrapper elements to be set. Call the breadcrumbs using `shiftr_breadcrumb()`
* Social Links, set via Yoast SEO, provides a simple way to include social links in areas of the website like the footer and contact page. Call the social links using the new function `shiftr_social_links()`

### Trial of new grid system
A handful of css grid utility classes have been included, `.grid-small`, `.grid-medium` and `.grid-large`. Each respectively enables a 12-column grid layout at the specified breakpoint. This will just be tested out to see if it works and it even the slighest bit useful during development, and if it is, the system can be expanded upon.

### Other
* caniuse browserlist updated to `1.0.30001292`
* Support for PHP 8
* Support for ACF 5.11.1

## v1.5.1
*03/08/21*

Plenty of much wanted improvements found here...

### Misc
* `inc` directory renamed to `includes`
* General cleanup throughout the codebase
* `theme-color` meta tag hooked onto `wp_head`, default color also removed
* Further fixes for global setup of `$shiftr`
* Working with the fonts has been improved, now defined in an associative array for supporting multiple font sources
* `functions/_shiftr-custom.php` has been removed in favour of using the `functions.php` as it is more commonly used
* Re-enabled the tracking fields, updated to work with Shiftr_ACF

### Shiftr ACF
* All field types added!
* Global Blocks now has its own top level Options page
* Introducing `get_flexi_field()` a brand new function making it easier than ever to work with Blocks. The ultimate goal here was to bring the Developer Experience back inline with how you would typically expect to handle ACF flexible content field. So there no longer any need to manually construct the data arrays of each Block.
* New function `register_flexi_block()` can now be used instead of directly referencing the `Flexi_Block` class



## v1.5
*04/06/21*

Arguably one of the biggest releases to Shiftr in terms of impact to developer experience! Introducing Shiftr ACF which also brings the 3rd-generation Flexi Blocks Builder (Flexi Template), a big cleanup of php and scss files, removal of some unused code as well as various new additions.

### Shiftr ACF
This is a custom made framework/library which is tailored around Flexi, allowing superior experience for adding new Blocks, Builders and Groups. Plus changes to the GUI of a Block within a Flexible Content field make for a more seamless experience on the backend. All ACF is now controlled [via PHP](https://www.advancedcustomfields.com/resources/register-fields-via-php/), so we've tried to make the whole experience of working with ACF via PHP as effortless as possible.

The default Blocks available has also been revised, with a new starting point for the 3rd-generation Flexi.
* Content
* Content & Image
* CTA Banner (small)
* Featured Posts

### Default footer
There is a new default footer in town! Complete with contact details, TWO menu locations with menus already defined as well as a seperate row for legal info. This new default should really help kickstart every footer.

### Hello Announcement Bar
A new component built-in straight into the core is the Announcement Bar, a super lightweight component great for displaying a short notice with optionally linked text. `shiftr_announcement_bar()` can be called anywhere you like, whether it's just on one template or every page in the header.

### New and improved archive pages
There is a new look to the default posts loop, with better markup and simpler default styles. A new standard has been put in place for working with post loops. `ul.loop.posts` with `li.post`.

New files have been added, `home.php` and `search.php`, for a much better focus on the [WordPress template hierarchy ](https://developer.wordpress.org/themes/basics/template-hierarchy/). There is also a new basic hero applied to all archive templates for consistency and reduced markup and styles.

### Code cleanup
All the php files for `/functions` and `/inc` have undergone a cleanup of the comments standards. Also, where appropriate, certain code has been removed due to lack of use.
Similar goes for the styles, where certain files have been removed due to lack of use.

### Misc
* Added `p:empty { display: none }`
* Removed the public sanity check from registering custom post types, as the process is cumbersome and can easily become fustrating for new developers to the theme.
* Improved body class names, primarily for archives, taxonomies and search.
* Some styles on `section.site-section` have now been moved to a new dedicated class `section.flexi-block`, this makes much sense as some of the styles where only really appropriate in the context of a Flexi Builder. This also reduces conflicts and unnecessary overrides when using `section.site-section` outside of the Flexi Builder context.



## v1.4.2
*28/05/21*

This release is not short on new features, improvements and a good old cleanup!

* Improvements to the Flexi Blocks Builder
    * Re-enabled the post thumbnail for the hero image
    * Using post content for hero content
* Performance audit for Web Vitals
    * Tweaks to order of resources like main css bundle, fonts, etc...
    * Cleanup of css to remove unnecessary code and applied DRY
    * Font loading strategy extended to include support for handling FOUT
    * `loading="lazy"` removed from hero image on Flexi and post single
    * All icons in styles converted to uri encoded
    * Setup filters to the new preload feature
* Full conversion to css variables instead of sass variables (please note sass variables are still used in rgba functions)
* Cleanup of sass functions and mixins
    * Depreciated `last-child()`
    * `x()` renamed to `min-width()` and now uses `em` unit
    * Added `max-width()` for use cases of `@media (max-width:1000px)`
* General changes to sass
    * Renamed `_init` directory to `base`
    * Renamed `core` directory to `layout`
    * Renamed `base/_settings.scss` directory to `base/_variables.scss`
* Improved accuracy of `scroll-margin-top` with header state, when state is updated in JS, class applied to `<body>` which allows the property to be updated between zero and `--header-height`
* Binded svg site logo function to `resize` and `orientationchange` events
* On Flexi Blocks, the `background` settings has been renamed to `bg` in favour of shorter class name. Also adds a new `.has-bg` class which helps reduce duplication of styles.



## v1.4.1
*16/04/21*

Nothing too fancy in this one. Most exciting part is probably introduction of preload for featured post image!

* Added `scroll-behavior: smooth` to `html`
* Added Form shortcodes. It's now easy to display a form from within content.
* Updated post date stamps to use `<time>`.
* Added preload capability to featured post images. Must be manually set on either a post type or per page template basis.
* Revised `<table>` default styling.



## v1.4
*02/03/21*

This is a big one! It has been a whole 5 months since the last update so there is lots to cram into this one.

* Changed html `font-size` value back to default, causing `1rem` to equal `16px`.
* All new header and brand new mobile menu which works better on larger screens where necessary.
* All new Buttons! These have been fully rebuilt and more accessibilty and make use of `:focus-visible`. `<button>` also no longer have Shiftr button styling applied by default, this makes working with custom buttons much easier. There is a new generic `.button` class if needed.
* General cleanup of JavaScript files, changed `let` to `const` where appropriate
* `input` selector in styles is more responsibily set, not using `:not()` anymore which made it harder to override.
* The login screen has had minor styling tweaks.
* Anchor `<a>` tag is no longer underlined globally.
* Hello CSS variables! The only global use currently is for setting a globally defined `border-radius` with `--border-radius`.
* The `last-child` mixin has beened udpated from `:last-of-type` to `:last-child` which is better suited for more use-cases.
* Shiftr's implementation of native lazy loading has been removed in favour of WordPress' core implementation. Although Shiftr's version has been re-purposed to work specifically with background-images via a `.lazy-bg` selector.
* `.js` clas gets added to `<html>` element on page load for specific JS-only styles
* Updated browserlist


#### Form updates
* Security patch, the whole file attachment process has been rebuilt, and safe guards against unsafe files.
* SMTP support has been removed as this has not been successfully integrated.
* The way a form is registered to WordPress as a post has been imrpoved, it is now more reliable and less error prone.
* The wording of "Data" has been changed to "Submission" as it is more obvious.


## v1.3.2
*09/10/20*

* Styling bug fix on cookie notice using old version of vertical rhythem
* Added GTM event tracking to Forms.
* Minor code refactoring of Form component


## v1.3.1
*17/07/20*

* Introducing Fluid Typography🥳 All headings and body font sizes are now controlled using `clamp()`, with basic fallback where not supported.
* Big cleanup of the Posts templates
* The margin of all headings and other type elements has been adjusted to fit harmoniously together in `.content`, `.block-heading` and `.block-after`. We have also combined these three elements to share all major styling of their decendants for improved consistency.
* 404 template has been revamped. It is simpler to control and includes some placeholder notice for admins to see, which instructs them how to add content to the 404 page.

#### Minor updates
* Bug fixes!!
* Sourcemaps excluded from VS Code search
* Login page is more inline with standard WP, only basic styling enhancements remain


## v1.3
*10/07/20*

* JavaScript based components have been re-written as ES6 classes and utilize modern syntax such as destructuring.
* The `Floater` and `Follower` components have been removed due to in-frequent use. `Floater` has been dropped in favour of the css property `position: static`.
* The JS codebase has been been neatened up, with great improvements to the `Carousel`.
* The source assets directory has been renamed from `build` to `src`. We felt the naming was a better suit, as build can be viewed as the directory holding the production assets.
* The Inventory has been removed. We have decided to keep this private in-house for the time being.

#### Minor updates
* Styling updates to the `.site-header`
* Shiftr built-in cookie has been renamed to `shiftr_accept_cookie`
* Shortcuts has been removed for both front and backend
* Some minor bug fixes


## v1.2.2
*07/07/20*

**Bug fixes:**
* `Undefined variable: update_return in inc/shiftr-form.php on line 314` now resolved
* Admin notice is now displayed when updating the Form settings

**Other:**
* The Shiftr logo has been removed frmo the login screen. Felt it was best to keep it more standard with the WP logo.
* The before and after hooks to the Form capture method have been updated to use the form instance as the arg. The `$data` variable itself is now passed to the `shiftr_form_handler_capture_after` hook to amke life easier.


## v1.2.1
*26/06/20*

* **Bug fix:** The form name was not being found in Forms > Data in admin. Well, that has been resolved!


## v1.2
*19/06/20*

* Webpack has been added to Gulp. All JavaScript files have been converted to work on an export/import basis, giving total flexibility as to what is included in the site assets.
* **New feature:** Native Lazy Loading is here! A new class is dedicated to handling the lazy loading on the site. There is also the option in Shiftr settings to disable the lazy loading should it be needed to for whatever reason.
* **New feature:** Flexi Blocks Builder template has finally made its way into the theme as a pre-loaded template. The current starter blocks are: Content, Content & Image and Accordion. More are to follow in the future releases. The template has been very popular and become very simple to work with, so we've put in a real solid foundation to start on going forward.

#### Minor updates
* Accessibility improvements, mainly in the header and navigation.
* API samples for Mailchimp and Instagram are now in the Inventory
* Form submission behaviour has been improved, now the submit button is disabled on click to prevent dual submissions. There is also a clear sending indication when submit button clicked.
* Use of the `backdrop-filter` property has been updated on the header to include `saturate()` and also we use the non-prefixed declaration has support has improved since first added to the theme.
* Scripts are now properly registered via `wp_register_script()`. Such a minor thing, just want to make sure we follow correct practices.


## v1.1.1
*12/06/20*

* Corrected theme version in package.json to v1.1.0
* Cookie notice styling has been moved into main css bundle. Lighthouse was asking a few times to preconnect to the resource which was annoying. It also makes more sense logically to include the styling in the main bundle as it will always have to be downloaded anyway on initial user visit.


## v1.1
*12/06/20*

Major overhaul of the task runner processes. The Gulpfile has been completely rebuilt from the ground up and now uses Gulp v4. The functionality of the tasks remains the same, just rebuilt to work faster and more efficiently. Any previously known bugs have now been resolved, such as JS errors crashing watch, and CSS stops injecting changes after a JS change in the same watch session.

Task names have also been updated.
`watch` Previously `build`, watches for file changes and either injects changes or reloads page. 
`build` Previously `compile-production`, compiles CSS and JS assets for production, minification and comments stripped.
`build-dev` Previously just the standard `compile` task, although not to be used in the CD process, it gives the option to compile assets without building them for production or running watch.

`gulp-environments` has been dropped in favour of using `env.process.NODE_ENV` as it reduces dependancies.

Overall, not all the same packages are used in this update, as some were not needed, or other were replaced with ones that seemed to be better or were more of a package. For instance, `gulp-clean-css` will minify and strip comments.

> The following update has been completed and tested against node v12.18.0 and npm v6.14.4



## v1.0.8
*12/06/20*

* Cookie notice accessibility improvements. The "Accept" and "Learn more" links are now more descriptive to assistive technologies.



## v1.0.7
*18/05/20*

* Removed VS Code tasks from theme, instead tasks is used in the [WordPress Enhanced Workflow](https://github.com/jackson-lewis/wordpress-enhanced-workflow). It is probably more convenient and makes more sense for tasks to be managed by the project workflow instead of the theme.
* VS Code search exclude has been expanded to exclude compiled JS files from the search results.



## v1.0.6
*13/05/20*

* Added VS Code tasks, set to auto run when you open VS.



## v1.0.5
*13/03/20*

* Some minor styling corrections and improvements
* Minor JavaScript improvements to reduce engine crashes
* Lazy loading support for media added via content
* Break-proof wrapper added for buttons added via editor
* Major update to image functions, use of wrapper functions around get_shiftr_image()
* New shiftr_get_template() and shiftr_get_block() functions to include template files
* Added the default structure for the ACF flexible content template to the inventory
* Added new function file, shiftr-builtin-filters.php, where built-in filters can be added.



## v1.0.2
*22/01/20*

* Some minor corrections of mis-spelt variables...
* Headings to inherit color
* Contents of header offset container can now be scrolled where content extends the height of the viewport
* Removed use of nonces on Forms after a issue was highlighted where cached pages cause token to expire



## v1.0.1
*10/01/20*

* Added blocks styling directory
* Forms - reordered how the hidden fields are added
* shiftr_body_class() - template class name nested inside is_singular() conditional to prevent PHP errors
* Forms - data meta keys renamed
* ACF Options - New Tracking tab with three areas to add tracking code
* shiftr_image() - now auto-detects ACF field
* Admin - The .shiftr-editor-min class styling can now be applied with the simpler class name .mini-editor



## v1.0.0
*04/01/20*

* First production ready release

