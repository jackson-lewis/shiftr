<?php
/**
 * The reason the majority of these functions exist is to reduce
 * the amount of code acutally within the template file. This helps
 * reduce noise so you, the developer, can focus on what matters.
 */
use Shiftr_ACF\Utils as Utils;


/**
 * Outputs the whole Flexi Blocks Builder HTML
 * 
 * @param string $builder_name The suffix to the full name
 */
function shiftr_flexi_blocks_builder( $builder_name ) {
    $flexible_content_object = false;

    if ( is_singular( 'page' ) ) {
        global $post;
        $flexible_content_object = $post;

    } else if ( is_archive() || is_tax() ) {
        $flexible_content_object = get_queried_object();
    }

    
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
function shiftr_block_heading( $content = '', $field = 'block-before' ) {

    $content = $content ?: get_sub_field( $field );

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

    $content = $content ?: get_sub_field( $field );

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
    return get_sub_field( 'settings' ) ?: array();
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
function shiftr_get_block_wrapper_attributes( $block, $settings = array() ) {
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
    $attributes = array( 'class' => 'site-section block--' . $block );

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
function shiftr_get_global_block_data( $block = '' ) {
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
