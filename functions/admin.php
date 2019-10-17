<?php

	/*  ////  --|    Admin

    */


/*	
	--| Setup ACF options pages

	* @since 1.0

	* Support for multiple options pages
*/

if ( function_exists( 'acf_add_options_page' ) ) {
	
	acf_add_options_page( array(
		'page_title' 	=> 'General Options',
		'menu_title'	=> 'Options',
		'menu_slug' 	=> 'general-options',
		'capability'	=> 'edit_posts',
		'redirect'		=> false
	));
	
	acf_add_options_sub_page( array(
		'page_title' 	=> 'Footer Options',
		'menu_title'	=> 'Footer',
		'parent_slug'	=> 'general-options',
	));
	
}


/**  
 *  shiftr_remove_acf_menu_item
 *
 *  Filter which users can see ACF in the admin menu
 *
 *  @since 1.0
 *
 *	@param $show bool If the menu item should appear in the menu
 *	@return bool If the menu item should appear in the menu
 */

function shiftr_remove_acf_menu_item( $show ) {

    if ( get_current_user_id() != 1 ) {
        return false;
        
    } else {
        return $show;
    }
}

add_filter( 'acf/settings/show_admin', 'shiftr_remove_acf_menu_item' );


/**  
 *  shiftr_admin_bar_clean_up
 *
 *  Remove unnecessary items from the admin top bar
 *
 *  @since 1.0
 *
 *	@global $wp_admin_bar
 */

function shiftr_admin_bar_clean_up() {

	global $wp_admin_bar;

	$wp_admin_bar->remove_menu( 'customize' );
	$wp_admin_bar->remove_menu( 'new-content' );
	$wp_admin_bar->remove_menu( 'updates' );
	$wp_admin_bar->remove_menu( 'comments' );
	$wp_admin_bar->remove_menu( 'appearance' );
}

add_action( 'wp_before_admin_bar_render', 'shiftr_admin_bar_clean_up' );


/**  
 *  shiftr_admin_menu_clean_up
 *
 *  Remove Posts and Comments from the admin menu if not required
 *
 *  @since 1.0
 *
 *	@global $shiftr
 */

function shiftr_admin_menu_clean_up() {

	global $shiftr;

	if ( ! $shiftr->admin_show_posts ) {
		remove_menu_page( 'edit.php' );
	}
	
	if ( ! $shiftr->admin_show_comments ) {
		remove_menu_page( 'edit-comments.php' );
	}
}

add_action( 'admin_menu', 'shiftr_admin_menu_clean_up' );


/**  
 *  shiftr_admin_styles
 *
 *  Add Shiftr admin styles to the admin
 *
 *  @since 1.0
 *
 *	@global $shiftr Used to add the current theme version
 */

function shiftr_admin_styles() {

	global $shiftr;

	// Styles
	wp_enqueue_style( 'shiftr-admin-styles', get_template_directory_uri() . '/assets/styles/admin.css', false, $shiftr->get( 'version' ) );

	// Scripts
	wp_enqueue_script( 'shiftr-admin-script', get_template_directory_uri() . '/assets/scripts/admin/admin.js', array(), $shiftr->get( 'version' ), true );
	wp_localize_script( 'shiftr-admin-script', 'shiftr', shiftr_js_object() );
}

add_action( 'admin_enqueue_scripts', 'shiftr_admin_styles', 99 );


/**  
 *  shiftr_editor_stylse
 *
 *  Add Shiftr editor styles to the WYSIWYG editor
 *
 *  @since 1.0
 */

function shiftr_editor_styles() {

	global $shiftr;

	add_editor_style( $shiftr->font_url );
	add_editor_style( 'assets/styles/admin.css' );
}

add_action( 'admin_init', 'shiftr_editor_styles' );

