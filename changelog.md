# Changelog


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

