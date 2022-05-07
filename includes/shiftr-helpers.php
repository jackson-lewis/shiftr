<?php
/**  
 *  Loop through an array of attributes and output string
 *
 *  @since 1.0
 *  @param array $raw The array of attributes
 *  @param bool $force_empty_values Whether an attribute with no value should be included in output
 *  @return string The attributes to be included inside HTML tag
 */
function shiftr_output_attr( array $raw = [], bool $force_empty_values = false ) {
    $the_attributes = [];

    foreach ( $raw as $_key => $_value ) {

        if ( ! $force_empty_values ) {
            if ( $_value == '' ) continue;
        }

        $key = strtolower( $_key );

        $attr_url = [ 'href', 'src', 'srcset' ];

        $value = in_array( $key, $attr_url ) ? esc_url( $_value ) : esc_attr( $_value );

        $the_attributes[] = $key . '="' . $value . '"';
    }

    return join( ' ', $the_attributes );    
}


/**  
 *  Return the HTML markup of an image from attachment ID or ACF field name
 *
 *  @since 1.0.5
 *  @param string|integer $id The attachment ID or ACF field name
 *  @param string $size The size of the image to output
 *  @param array $attr Attributes that should be added to the img tag
 * @return string
 */
function get_shiftr_image( int|string $id = 0, string $size = 'large', array $attr = [] ) {
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
 *  @param int|string $id The attachment ID or ACF field name
 *  @param string $size The size of the image to output
 *  @param array $attr Attributes that should be added to the img tag
 */
function shiftr_image( int|string $id = 0, string $size = 'large', array $attr = [] ) {
    echo get_shiftr_image( $id, $size, $attr );
}


/**  
 *  Output the html of the current post featured image
 *
 *  @since 1.0
 *  @param int $id The post ID
 *  @param string $size The size of the image to output
 *  @param array $attr Attributes that should be added to the img tag
 */
function shiftr_featured_image( int $id = 0, string $size = 'large', array $attr = [] ) {
    global $post;

    if ( $id === 0 ) {
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
 *  @param string $file The name of the file, excluding .svg extension, or full path to uploads
 *  @param string|bool $dir The directory path relative to the theme root, or false if uploads path
 *  @return mixed Output SVG element or bool (false) if file not found
 */
function shiftr_inline_svg( string $file = '', string|bool $dir = '/assets/icons/' ) {

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
 * Display the archive title, supports Shiftr archive pages.
 * 
 * @since 1.6.1
 * @param bool $display Echo or return title
 */
function shiftr_archive_title( bool $display = true ) {
    $title = '';

    if ( is_home() ) {
        $title = single_post_title( '', false );
    } else if ( is_post_type_archive() ) {
        $post_type = get_query_var( 'post_type' );

        $archive_page_id = shiftr_get_page_id( $post_type );

        if ( $archive_page_id ) {
            $archive_page = get_post( $archive_page_id );
    
            if ( $archive_page ) {
                $title = $archive_page->post_title;
            }
        } else {
            $title = get_the_archive_title();
        }

    } else {
        $title = get_the_archive_title();
    }

    if ( $display ) {
        echo $title;

    } else {
        return $title;
    }
}


/**
 * Displays the description for an archive page or taxonomy.
 * 
 * @since 1.6.1
 */
function shiftr_archive_description() {
    $description = '';

    if ( is_home() ) {
        $posts_page_id = get_option( 'page_for_posts' );
        $posts_page = get_post( $posts_page_id );

        if ( $posts_page ) {
            $description = $posts_page->post_content;
        }

    } else if ( is_post_type_archive() ) {
        $post_type = get_query_var( 'post_type' );

        $archive_page_id = shiftr_get_page_id( $post_type );

        if ( $archive_page_id ) {
            $archive_page = get_post( $archive_page_id );
    
            if ( $archive_page ) {
                $description = $archive_page->post_content;
            }
        }

    } else if ( ( is_category() || is_tax() ) && 0 === absint( get_query_var( 'paged' ) ) ) {
        $term = get_queried_object();

        if ( $term && ! empty( $term->description ) ) {
            $description = $term->description;
        }
    }

    printf( '<div class="description">%s</div>', apply_filters( 'the_content', $description ) );
}


/**
 * Displays the featured image of the associated page for the custom post type
 * 
 * @since 1.6.3
 * @param string $size
 * @param array $attr
 */
function shiftr_archive_thumbnail( string $size = 'full', array $attr = [] ) {

    if ( is_home() ) {
        shiftr_featured_image( get_option( 'page_for_posts' ), $size, $attr );

    } else if ( is_post_type_archive() ) {
        shiftr_featured_image( shiftr_get_page_id( get_query_var( 'post_type' ) ), $size, $attr );
    }
}


/**  
 *  Include a template part
 *
 *  @since 1.0.5
 *  @param string $template_name The template file name and path relative from theme_root/parts/
 *  @param array $args Any variables to pass into the template file
 *  @param string $template_path The directory to locate the template, relative from the theme root
 *  @return null on failure to find file
 */
function shiftr_get_template( string $template_name, array $args = [], string $template_path = 'parts/' ) {

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
 *  @param string $template_name The template file name and path relative from theme_root/blocks/
 *  @param array $args Any variables to pass into the template file
 *  @param string $template_path The directory to locate the template, relative from the theme root
 */
function shiftr_get_block( string $block_name, array $args = [], string $template_path = 'blocks/' ) {

    shiftr_get_template( $block_name, $args, $template_path );
}


/**
 * Get the page id for a custom post type archive.
 * 
 * Supported:
 * - Custom post types registered via Shiftr.
 * 
 * @since 1.6.1
 * @param string $page The page slug.
 * @return int
 */
function shiftr_get_page_id( string $page ) {
    $page_setup = get_field( 'page_setup', 'option' );

    if ( is_array( $page_setup ) && isset( $page_setup['shiftr_' . $page . '_page_id'] ) ) {
        $page = $page_setup['shiftr_' . $page . '_page_id'];
    }

    return $page ? absint( $page ) : -1;
}


/**
 * Dynamically get the page id for a custom post type archive.
 * 
 * @since 1.6.1
 * 
 * @param string $post_type Defaults to current post type.
 * @return int
 */
function shiftr_get_page_id_for_archive( string $post_type = '' ) {
    
    if ( empty( $post_type ) ) {
        $post_type = get_query_var( 'post_type' );
    }

    return shiftr_get_page_id( $post_type );
}
