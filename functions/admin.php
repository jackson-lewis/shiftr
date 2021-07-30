<?php
/**  
 * Remove unnecessary items from the admin top bar
 *
 * @since 1.0
 *
 * @global $wp_admin_bar
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
 * Remove Posts and Comments from the admin menu if not required
 *
 * @since 1.0
 *
 * @global $shiftr
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
 * Add Shiftr admin styles to the admin
 *
 * @since 1.0
 *
 * @global $shiftr Used to add the current theme version
 */

function shiftr_admin_styles() {
    global $shiftr;

    // Styles
    wp_enqueue_style( 'shiftr-admin-styles', get_template_directory_uri() . '/assets/styles/admin.css', false, $shiftr->get( 'version' ) );

    // Scripts
    wp_enqueue_script( 'shiftr-admin-script', get_template_directory_uri() . '/assets/scripts/admin.js', array(), $shiftr->get( 'version' ), true );
    wp_localize_script( 'shiftr-admin-script', 'shiftr', shiftr_js_object() );
}
add_action( 'admin_enqueue_scripts', 'shiftr_admin_styles', 99 );


/**  
 * Add Shiftr editor styles to the WYSIWYG editor
 *
 * @since 1.0
 */
function shiftr_editor_styles() {
    $fonts = shiftr()->fonts;

    if ( is_array( $fonts ) ) {
        foreach ( $fonts as $font ) {
            add_editor_style( $font['url'] );
        }
    }

    add_editor_style( 'assets/styles/admin.css' );
}
add_action( 'admin_init', 'shiftr_editor_styles' );
