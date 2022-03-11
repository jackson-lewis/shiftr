<?php
/**
 * The reason the majority of these functions exist is to reduce
 * the amount of code acutally within the template file. This helps
 * reduce noise so you, the developer, can focus on what matters.
 */
use Shiftr_ACF\Utils as Utils;
use Shiftr_ACF\Field_Types;


/**
 * Outputs the whole Flexi Blocks Builder HTML
 * 
 * @param string $builder_name The suffix to the full name
 */
function shiftr_flexi_blocks_builder( $builder_name, $flexible_content_object = false ) {

    if( ! $flexible_content_object ) {
        if ( is_singular( 'page' ) ) {
            global $post;
            $flexible_content_object = $post;
    
        } else if ( is_tax() ) {
            $flexible_content_object = get_queried_object();

        } else if ( is_post_type_archive() ) {
            global $shiftr_post_types;

            $current_post_type = get_query_var( 'post_type' );

            if ( isset( $shiftr_post_types[ $current_post_type ] ) ) {
                $post_type_page_id = shiftr_get_page_id( $current_post_type );
                $post_type_page = get_post( $post_type_page_id );

                if ( $post_type_page ) {
                    $flexible_content_object = $post_type_page;
                }
            }
            
        } else if ( is_home() ) {
            $posts_page_id = get_option( 'page_for_posts' );
            $posts_page = get_post( $posts_page_id );

            if ( $posts_page ) {
                $flexible_content_object = $posts_page;
            }
        }
    }

    /**
     * Filter the object to use for the ACF field data.
     * 
     * @param WP_Post|WP_Term $flexible_content_object
     * @param string $builder_name
     */
    $flexible_content_object = apply_filters( 'shiftr_flexible_content_object', $flexible_content_object, $builder_name );

    
    if ( have_rows( 'flexi_blocks_builder-' . $builder_name, $flexible_content_object ) ) {
        echo '<div class="flexi-blocks-builder builder-' . $builder_name . '">';

        /**
         * Fires before the builder loop
         */
        do_action( 'shiftr_flexi_loop_start', $builder_name );

        while ( have_rows( 'flexi_blocks_builder-' . $builder_name, $flexible_content_object ) ) {
            the_row();

            $block = get_row_layout();
            $settings = shiftr_get_block_settings();
            $wrapper_attr = shiftr_get_block_wrapper_attributes( $block, $settings );

            if ( Utils\block_exists( $block ) ) {
                echo '<section ' . shiftr_output_attr( $wrapper_attr ) . '>';

                /**
                 * Fires before the block contents
                 */
                do_action( 'shiftr_flexi_open_block', $block );

                /**
                 * Retrieve the block template
                 */
                shiftr_get_block( $block );

                /**
                 * Fires after the block contents
                 */
                do_action( 'shiftr_flexi_close_block', $block );

                echo '</section>';
            }
        }

        /**
         * Fires after the builder loop
         */
        do_action( 'shiftr_flexi_close_block', $builder_name );

        echo '</div>';
        
    } else {
        /**
         * Fires when no blocks are found
         */
        do_action( 'shiftr_flexi_no_blocks_found', $builder_name );
    }
}


/**
 * Print the html of a block heading element
 * 
 * @since v1.2
 * 
 * @param string $content Use html string instead of active field
 * @param string The name of the ACF field
 */
function shiftr_block_heading( $field = 'block-before' ) {

    $content = get_flexi_field( $field );

    if ( $content ) {
        ?>
<div class="block-heading">
    <?php echo $content; ?>
</div>
        <?php
    }
}


/**
 * Print the html of a block after content element
 * 
 * @since v1.2
 * 
 * @param string $content Use html string instead of active field
 * @param string The name of the ACF field
 */
function shiftr_block_after( $content = '', $field = 'block-after' ) {

    $content = get_flexi_field( $field );

    if ( $content ) {
        ?>
<div class="block-after">
    <?php echo $content; ?>
</div>
        <?php
    }
}

/**
 * Get the current block settings via the ACF group
 * 
 * @since v1.2
 * 
 * @return array The settings of the block
 */
function shiftr_get_block_settings() {
    return get_sub_field( 'settings' ) ?: [];
}


/**
 * Using the block settings, build the attributes of the
 * block wrapper element. The attributes help identify and target
 * the block instance.
 * 
 * @since v1.2
 * 
 * @param string $block The block name
 * @param array $settings The block settings
 * @return array The attributes for the block wrapper element
 */
function shiftr_get_block_wrapper_attributes( string $block, array $settings = [] ) {
    $is_global_instance = false;
    /**
     * Override to global block instance settings if set
     */
    if ( $settings['use_global'] ) {
        $global_field_data = shiftr_get_global_block_data( $block );

        if ( $global_field_data ) {
            $settings = $global_field_data['settings'];

            $is_global_instance = true;
        }
    }

    // Default class name
    $attributes = [ 'class' => 'flexi-block block--' . $block ];

    foreach ( $settings as $setting => $value ) {

        if ( $setting == 'id' ) {
            $attributes['id'] = $value;

        } else if ( is_bool( $value ) ) {
            $attributes['class'] .= $value ? " {$setting}" : '';
            
        } else {
            if ( $setting == 'background' && $value == 'white' ) {
                continue;
            } elseif ( $setting == 'background' ) {
                $setting = 'bg';

                $attributes['class'] .= ' has-bg';
            }

            $attributes['class'] .= " {$setting}-{$value}";
        }                 
    }
    $attributes['class'] .= $is_global_instance ? ' is-global-instance' : '';

    return apply_filters( 'shiftr_get_block_wrapper_attributes', $attributes, $block );
}


/**
 * Get the global data of a block if set.
 * 
 * @param string $block The id of the block
 * @return array|bool Array of data, false if global block not set
 */
function shiftr_get_global_block_data( string $block = '' ) {
    $global_flexi_builder = get_field( 'flexi_blocks_builder-global', 'options' );
    $block_found = false;

    if ( ! empty( $global_flexi_builder ) ) {
        foreach ( $global_flexi_builder as $layout ) {

            if ( $layout['acf_fc_layout'] == $block ) {
                $block_found = $layout;
                unset( $layout['acf_fc_layout'] );
            }
        }
    }

    return $block_found;
}

//$GLOBALS['shiftr_flexi_blocks_global_store'] = get_field( 'flexi_blocks_builder-global', 'options' );

/**
 * Get the global flexi blocks builder.
 * 
 * @return array|bool False if no field data found
 */
function shiftr_flexi_blocks_global_store() {
    return get_field( 'flexi_blocks_builder-global', 'options' );
}


/**
 * Get a field value within the context of a Flexi Block, where Global Blocks are supported.
 * 
 * @param string $selector The field selector
 * @param bool $format_value Should format the field value
 */
function get_flexi_field( string $selector, bool $format_value = true ) {
    $settings = shiftr_get_block_settings();

    if ( $settings['use_global'] ) {
        $global_blocks_store = shiftr_flexi_blocks_global_store();

        $sub_field = get_row_sub_field( $selector );
        $row = acf_get_loop('active');
        $block = $sub_field['parent_layout'];
        $block_found = false;

        if ( ! empty( $global_blocks_store ) ) {
            foreach ( $global_blocks_store as $layout ) {

                if ( 'layout_block__' . $layout['acf_fc_layout'] == $block ) {
                    $block_found = $layout;
                    unset( $layout['acf_fc_layout'] );
                }
            }
        }

        return acf_format_value( $block_found[ $selector ], $row['post_id'], $sub_field );
    }

    return get_sub_field( $selector, $format_value );
}


/**
 * @param string $selector
 * @param bool $format_value
 */
function the_flexi_field( string $selector, bool $format_value = true ) {
    $value = get_flexi_field( $selector, $format_value );

    if ( !$value ) {
        return null;
    }

    echo $value;
}


/**
 * Google Maps Block - Automatic lazy loading.
 */
$GLOBALS['shiftr_has_google_maps_block'] = false;

add_action( 'shiftr_flexi_open_block', function( $block ) {
    if ( $block == 'google-maps' ) {
        $GLOBALS['shiftr_has_google_maps_block'] = true;
    }
});


/**
 * Handles the lazy loading capability of the Google Maps API from maps
 * served via the Google Maps Flexi Block.
 */
function shiftr_flexi_block_google_maps_lazy_load() {

    if ( ! defined( 'GOOGLE_API_KEY' ) ) {
        return;
    }
    /**
     * Ensures this script will only output if the block is present.
     */
    if ( isset( $GLOBALS['shiftr_has_google_maps_block'] ) && ! $GLOBALS['shiftr_has_google_maps_block'] ) {
        return;
    }

    ?>
<script async id="shiftr-google-maps-lazy-load">
    ( () => {
        if ( typeof initMap !== 'function' ) {
            console.warn( 'Attempted to lazy load Google Maps API, however the callback function `initMap` does not exist.' );
            return;
        }

        const googleMapsFlexiBlock = document.querySelector( '.flexi-block.block--google-maps' );

        const observer = new IntersectionObserver(
            function ( entries, observer ) {
                entries.forEach( entry => {
                    if ( entry.isIntersecting ) {
                        const script = document.createElement( 'script' );
                        script.src = 'https://maps.googleapis.com/maps/api/js?key=<?php echo GOOGLE_API_KEY; ?>&callback=initMap';
                        document.body.appendChild( script );
                        observer.unobserve( entry.target )
                    }
                })
            }, {
                rootMargin: window.innerHeight + 'px',
                threshold: 0.1
            }
        );

        observer.observe( googleMapsFlexiBlock )
    })();
</script>
    <?php
}
add_action( 'wp_footer', 'shiftr_flexi_block_google_maps_lazy_load' );


/**
 * Generate ACF fields based on post types registed via Shiftr.
 * 
 * @return array
 */
function shiftr_flexi_get_available_post_types() {
    global $shiftr_post_types;

    $fields = [];

    foreach ( $shiftr_post_types as $post_type => $instance ) {

        $fields[] = Field_Types\post_object_field(
            $instance->plural,
            [
                'key'       => 'shiftr_' . $post_type . '_page_id',
                'name'      => 'shiftr_' . $post_type . '_page_id',
                'post_type' => [ 'page' ],
                'multiple'  => 0
            ]
        );
    }

    return $fields;
}