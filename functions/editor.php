<?php
/**
 * WYSIWYG editor
 */


/**  
 *  Filter the plugins in the WYSIWYG editor
 *
 *  @since 1.0
 *
 *  @param $plugin_array array The plugins used in the editor
 *  @return array The plugins used in the editor
 */
function shiftr_editor( $plugin_array ) {

    // Add Email plugin
    $plugin_array['email_link_plugin'] =  get_template_directory_uri() . '/assets/scripts/editor.js';

    // Add Phone plugin
    $plugin_array['phone_link_plugin'] =  get_template_directory_uri() . '/assets/scripts/editor.js';

    return $plugin_array;
}


/**  
 *  Add Shiftr custom buttons to the WYSIWYG editor
 *
 *  @since 1.0
 *
 *  @param $buttons array The buttons used in the editor
 *  @return array The buttons used in the editor
 */
function shiftr_editor_register_buttons( $buttons ) {
    // Shortcodes to add to editor
    array_push( $buttons, '|', 'email', 'phone' );

    return $buttons;
}


/**  
 *  Add the Shiftr WYSIWYG editor customizations 
 *
 *  @since 1.0
 */
function shiftr_mce() {
    add_filter( 'mce_external_plugins', 'shiftr_editor' );
    add_filter( 'mce_buttons', 'shiftr_editor_register_buttons' );
}
add_action( 'admin_init', 'shiftr_mce' );


/**  
 *  Filter the ACF editor to include Shiftr buttons
 *
 *  @since 1.0
 *
 *  @param $toolbars array The toolbars used in ACF editor
 *  @return array The toolbars used in ACF editor
 */
function shiftr_acf_editor_toolbar( $toolbars ) {

    $toolbars['Shiftr Full'] = array();
    $toolbars['Shiftr Basic'] = array();

    // Shiftr Full Toolbar
    $toolbars['Shiftr Full'][1] = array(
        'formatselect',
        'bold',
        'italic',
        'bullist',
        'numlist',
        'alignleft',
        'aligncenter',
        'alignright',
        'link',
        'spellchecker',
        '|',
        'email',
        'phone'
    );
    $toolbars['Shiftr Full'][2] = array(
        'strikethrough',
        'hr',
        'forecolor',
        'pastetext',
        'removeformat',
        'charmap',
        'outdent',
        'indent',
        'undo',
        'redo',
        'wp_help'
    );

    // Shiftr Basic Toolbar
    $toolbars['Shiftr Basic'][1] = array(
        'bold',
        'italic',
        '|',
        'alignleft',
        'aligncenter',
        'alignright',
        '|',
        'link',
        'spellchecker',
        '|',
        'email',
        'phone'
    );

    return $toolbars;
}
add_filter( 'acf/fields/wysiwyg/toolbars', 'shiftr_acf_editor_toolbar' );


/**  
 *  Filter the ACF editor to include Shiftr buttons
 *
 *  @since 1.0
 *
 *  @global $shiftr Access the class setting remove_editor_by_post_type
 */
function shiftr_remove_editor() {
    global $shiftr;

    if ( ! is_array( $shiftr->remove_editor_by_post_type ) ) return;

    foreach ( $shiftr->remove_editor_by_post_type as $post_type ) {
        remove_post_type_support( $post_type, 'editor' );
    }
}
add_action( 'init', 'shiftr_remove_editor', 99 );
