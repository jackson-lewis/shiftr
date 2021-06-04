<?php
/**  
 *  Loop through an array of attributes and output string
 *
 *  @since 1.0
 *
 *  @param $raw array The array of attributes
 *  @param $force_empty_values bool Whether an attribute with no value should be included in output
 *  @return str The attributes to be included inside HTML tag
 */
function shiftr_output_attr( $raw = [], $force_empty_values = false ) {

    $the_attributes = array();

    foreach ( $raw as $_key => $_value ) {

        if ( ! $force_empty_values ) {
            if ( $_value == '' ) continue;
        }

        $key = strtolower( $_key );

        $attr_url = array( 'href', 'src', 'srcset' );

        $value = in_array( $key, $attr_url ) ? esc_url( $_value ) : esc_attr( $_value );

        $the_attributes[] = $key . '="' . $value . '"';
    }

    return join( ' ', $the_attributes );    
}


/**  
 *  Return the HTML markup of an image from attachment ID or ACF field name
 *
 *  @since 1.0.5
 *
 *  @param $id int|str The attachment ID or ACF field name
 *  @param $size str The size of the image to output
 *  @param $attr array Attributes that should be added to the img tag
 */
function get_shiftr_image( $id = 0, $size = 'large', $attr = [] ) {

    $html = '';

    // Check if string value may acutally be a integar before proceeding
    $id = intval( $id ) ? intval( $id ) : $id;

    // Capture ACF values automatically if field name is passed as $id
    if ( $id == 0 || is_string( $id ) ) {

        $acf_field = is_string( $id ) ? $id : 'image';

        if ( get_field( $acf_field ) ) {
            $id = get_field( $acf_field );

        } elseif ( get_sub_field( $acf_field ) ) {
            $id = get_sub_field( $acf_field );

        } else {
            return false;
        }
    }

    if ( $id > 0 ) {
        $html = wp_get_attachment_image( $id, $size, false, $attr );
    }

    return $html;
}


/**  
 *  Output the returned value from get_shiftr_image()
 *
 *  @since 1.0
 *
 *  @param $id int|str The attachment ID or ACF field name
 *  @param $size str The size of the image to output
 *  @param $attr array Attributes that should be added to the img tag
 */
function shiftr_image( $id = 0, $size = 'large', $attr = [] ) {

    echo get_shiftr_image( $id, $size, $attr );
}


/**  
 *  Output the html of the current post featured image
 *
 *  @since 1.0
 *
 *  @param $id null|int The post ID
 *  @param $size str The size of the image to output
 *  @param $attr array Attributes that should be added to the img tag
 */
function shiftr_featured_image( $id = null, $size = 'large', $attr = [] ) {
    global $post;

    if ( $id === null ) {
        $id = $post->ID;
    }

    // Allows ability to set placeholder images based on post type via $post
    $thumbnail_id = apply_filters( 'shiftr_featured_image_thumbnail_id', get_post_thumbnail_id( $id ), $post );

    echo get_shiftr_image( $thumbnail_id, $size, $attr );
}


/**  
 *  Include an SVG file to inline on the page
 *
 *  @since 1.0
 *
 *  @param $file str The name of the file, excluding .svg extension, or full path to uploads
 *  @param $dir str|bool The directory path relative to the theme root, or false if uploads path
 *  @return mixed Output SVG element or bool (false) if file not found
 */
function shiftr_inline_svg( $file = '', $dir = '/assets/icons/' ) {

    // Put together file path
    $relative_path = get_template_directory() . $dir . $file . '.svg';

    if ( ! $dir ) {
        $relative_path = str_replace( get_bloginfo( 'url' ), '', $file );

    } else {
        $relative_path = get_template_directory() . $dir . $file . '.svg';
    }

    // Check if file exists
    if ( file_exists( $relative_path ) ) {

        include $relative_path;
    } else {

        return false;
    } 
}


/**  
 *  Include a template part
 *
 *  @since 1.0.5
 *
 *  @param $template_name str The template file name and path relative from theme_root/parts/
 *  @param $args array Any variables to pass into the template file
 *  @param $template_path str The directory to locate the template, relative from the theme root
 *  @return null on failure to find file
 */
function shiftr_get_template( $template_name, $args = array(), $template_path = 'parts/' ) {

    /**
     * This allows flexibility to omit the .php extension when calling a template file
     */
    if ( ! stripos( $template_name, '.php' ) ) {
        $template_name .= '.php';
    }

    $template = locate_template( $template_path . $template_name );

    if ( ! file_exists( $template ) ) {
        return;
    }

    // Pass arguments into template file
    if ( ! empty( $args ) && is_array( $args ) ) {

        extract( $args, EXTR_SKIP );
    }

    include $template;
}


/**  
 *  Include a template part, specific to blocks used in a ACF flexible content template
 *
 *  @since 1.0.5
 *
 *  @param $template_name str The template file name and path relative from theme_root/blocks/
 *  @param $args array Any variables to pass into the template file
 *  @param $template_path str The directory to locate the template, relative from the theme root
 */
function shiftr_get_block( $block_name, $args = array(), $template_path = 'blocks/' ) {

    shiftr_get_template( $block_name, $args, $template_path );
}

