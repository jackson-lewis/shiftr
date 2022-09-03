<?php
/**
 * ...
 */
define( 'SHIFTR_SPACE_ENTITY', '&nbsp;' );


/**  
 *  Output a file uri from within the branding directory
 *
 *  @since 1.0
 *  @param string $file The file name of the requested file
 */
function shiftr_get_branding_url( string $file = '' ) {
    echo esc_url( get_template_directory_uri() . '/assets/branding/' . $file );
}


/**  
 *  Output a file uri from within the media directory
 *
 *  @since 1.0
 *  @param string $file The file name of the requested file
 *  @param string $media_dir The directory name where the file is expected
 */
function shiftr_get_asset_url( string $file = '', string $asset_dir = 'images' ) {
    echo esc_url( get_template_directory_uri() . '/assets/' . $asset_dir . '/' . $file );
}


/**  
 *  Return a Shiftr setting
 *
 *  @since 1.0
 *  @param string $key The suffix of the setting name
 *  @return mixed
 */
function shiftr_get_setting( string $key = '' ) {
    return get_option( 'shiftr_' . $key );
}


/**  
 *  Convert spaces in a string to underscores
 *
 *  @since 1.0
 *  @param string $str The string to convert
 *  @return string The re-formatted string
 */
function space_to_( string $str = '' ) {
    return str_replace( ' ', '_', $str );
}


/**  
 *  Convert spaces in a string to HTML space entity &nbsp;
 *
 *  @since 1.0
 *  @param string $str The string to convert
 *  @return string
 */
function space_to_nbsp( string $str = '' ) {
    return str_replace( ' ', SHIFTR_SPACE_ENTITY, $str );
}


/**  
 *  Convert a string with hyphans to spaces and capitalize
 *
 *  @since 1.0
 *  @param string $str The string to convert
 *  @return string
 */
function shiftr_to_nicename( string $str = '' ) {
    $nicename = str_replace( '-', ' ', $str );
    $nicename = str_replace( '_', ' ', $str );
    $nicename = ucwords( $nicename );

    return $nicename;
}


/**  
 *  Prep the JS object for wp_localize_script
 *
 *  @since 1.0
 *  @return array
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
 *  @return bool
 */
function shiftr_is_sending_form() {
    return defined( 'DOING_AJAX' ) && isset( $_REQUEST['action'] ) && $_SERVER['REQUEST_METHOD'] == 'POST' && isset( $_POST['shiftr_form_id'] );
}


/**
 * Return the state of the lazy loading ability.
 * 
 * @since 1.1.x
 * @return bool
 */
function shiftr_lazy_loading_enabled() {
    return apply_filters( 'shiftr_lazy_loading_enabled', shiftr()->bg_lazy_loading );
}


/**
 * Works out if the current page should be using Glide.js
 * 
 * @return bool
 */
function shiftr_page_uses_glidejs() {
    $uses = false;

    $page_fields = get_fields();

    if ( !$page_fields ) {
        return false;
    }

    $page_fields_keys = array_filter( array_keys( $page_fields ), function( $field_name ) {
        return stripos( $field_name, 'flexi_blocks_builder-' ) >= 0;
    });

    $flexi_blocks = $page_fields[ $page_fields_keys[0] ];

    if ( is_array( $flexi_blocks ) ) {
        $gallery_blocks = array_filter( $flexi_blocks, function( $block ) {
            return $block['acf_fc_layout'] == 'gallery';
        });
    
        if ( count( $gallery_blocks ) > 0 ) {
            $uses = true;
        }
    }

    return apply_filters( 'shiftr_page_uses_glidejs', $uses );
}
