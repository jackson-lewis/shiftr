<?php


define( 'SHIFTR_SPACE_ENTITY', '&nbsp;' );


/**  
 *  shiftr_get_branding_url
 *
 *  Output a file uri from within the branding directory
 *
 *  @since 1.0
 *
 *  @param $file str The file name of the requested file
 */

function shiftr_get_branding_url( $file = '' ) {
    echo esc_url( get_template_directory_uri() . '/assets/branding/' . $file );
}


/**  
 *  shiftr_get_asset_url
 *
 *  Output a file uri from within the media directory
 *
 *  @since 1.0
 *
 *  @param $file str The file name of the requested file
 *  @param $media_dir str The directory name where the file is expected
 */

function shiftr_get_asset_url( $file = '', $asset_dir = 'images' ) {
    echo esc_url( get_template_directory_uri() . '/assets/' . $asset_dir . '/' . $file );
}


/**  
 *  shiftr_get_setting
 *
 *  Return a Shiftr setting
 *
 *  @since 1.0
 *
 *  @param $key str The suffix of the setting name
 *  @return str|null The value on success, null if setting does not exist
 */

function shiftr_get_setting( $key = '' ) {

    $value = get_option( 'shiftr_' . $key );

    if ( ! $value ) {
        return $value;

    } else {

        return null;
    }
}


/**  
 *  space_to_
 *
 *  Convert spaces in a string to underscores
 *
 *  @since 1.0
 *
 *  @param $str str The string to convert
 *  @return str The re-formatted string
 */

function space_to_( $str = '' ) {

    return str_replace( ' ', '_', $str );
}


/**  
 *  space_to_nbsp
 *
 *  Convert spaces in a string to HTML space entity &nbsp;
 *
 *  @since 1.0
 *
 *  @param $str str The string to convert
 *  @return str The re-formatted string
 */

function space_to_nbsp( $str = '' ) {

    return str_replace( ' ', SHIFTR_SPACE_ENTITY, $str );
}


/**  
 *  shiftr_to_nicename
 *
 *  Convert a string with hyphans to spaces and capitalize
 *
 *  @since 1.0
 *
 *  @param $str str The string to convert
 *  @return str The re-formatted string
 */

function shiftr_to_nicename( $str = '' ) {

    $nicename = str_replace( '-', ' ', $str );
    $nicename = str_replace( '_', ' ', $str );
    $nicename = ucwords( $nicename );

    return $nicename;
}

/**  
 *  shiftr_js_object
 *
 *  Prep the JS object for wp_localize_script
 *
 *  @since 1.0
 *
 *  @param $str str The string to convert
 *  @return array The re-formatted array
 */

function shiftr_js_object() {

    global $post, $shiftr;

    if ( isset( $post ) ) {
        $use_post_id = $post->ID;
    } else {
        $use_post_id = 0;
    }


    $shiftr->js_object['shortcuts']['edit'] = str_replace( '$$$POSTID$$$', $use_post_id, $shiftr->js_object['shortcuts']['edit'] );
    $shiftr->js_object['shortcuts']['view'] = str_replace( '$$$POSTPERMALINK$$$', get_the_permalink(), $shiftr->js_object['shortcuts']['view'] );
    $shiftr->js_object['vars']['archive'] = is_home() || is_archive();

    // For admin
    if ( is_admin() ) {
        unset( $shiftr->js_object['form'] );
        unset( $shiftr->js_object['vars'] );
    }

    return $shiftr->js_object;
}


/**  
 *  shiftr_is_sending_form
 *
 *  Check if AJAX call is doing form submission
 *
 *  @since 1.0
 *
 *  @return bool If a Shiftr Form is being submitted
 */

function shiftr_is_sending_form() {

    return defined( 'DOING_AJAX' ) && isset( $_REQUEST['action'] ) && $_SERVER['REQUEST_METHOD'] == 'POST' && isset( $_POST['shiftr_form_id'] );
}


/**
 * Return the state of the lazy loading ability.
 * 
 * @since 1.1.x
 * @global $shiftr
 * 
 * @return bool True is enabled, false if disabled
 */
function shiftr_lazy_loading_enabled() {
    global $shiftr;

    return $shiftr->lazy_loading;
}
