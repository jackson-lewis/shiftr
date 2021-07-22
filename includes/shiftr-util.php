<?php
/**
 * ...
 */
define( 'SHIFTR_SPACE_ENTITY', '&nbsp;' );


/**  
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
 *  Prep the JS object for wp_localize_script
 *
 *  @since 1.0
 *
 *  @param $str str The string to convert
 *  @return array The re-formatted array
 */
function shiftr_js_object() {
    // For admin
    if ( is_admin() ) {
        unset( shiftr()->js_object['form'] );
    }

    return shiftr()->js_object;
}


/**  
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
    return apply_filters( 'shiftr_lazy_loading_enabled', shiftr()->bg_lazy_loading );
}
