<?php
/**
 * The reason the majority of these functions exist is to reduce
 * the amount of code acutally within the template file. This helps
 * reduce noise so you, the developer, can focus on what matters.
 */


/**
 * Print the html of a block heading element
 * 
 * @since v1.2
 * 
 * @param string The name of the ACF field
 */
function shiftr_block_heading( $field = 'block_heading' ) {

    if ( get_sub_field( $field ) ) {
        ?>
<div class="block-heading">
    <?php the_sub_field( $field ); ?>
</div>
        <?php
    }
}


/**
 * Print the html of a block after content element
 * 
 * @since v1.2
 * 
 * @param string The name of the ACF field
 */
function shiftr_block_after( $field = 'block_after' ) {

    if ( get_sub_field( $field ) ) {
        ?>
<div class="block-after">
    <?php the_sub_field( $field ); ?>
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
    return get_sub_field( 'settings' ) ? get_sub_field( 'settings' ) : array();
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
function shiftr_get_block_attributes( $block, $settings = array() ) {

    // Default class name
    $attributes = array( 'class' => 'site-section block--' . $block );

    foreach ( $settings as $setting => $value ) {

        if ( $setting == 'id' ) {
            $attributes['id'] = $value;

        } else if ( is_bool( $value ) ) {
            $attributes['class'] .= $value ? " {$setting}" : '';
            
        } else {
            if ( $setting == 'bg' && $value == 'white' ) {
                continue;
            }

            $attributes['class'] .= " {$setting}-{$value}";
        }                    
    }

    if ( preg_match( '/bg\-/', $attributes['class'] ) ) {
        $attributes['class'] .= ' has-bg';
    }

    return apply_filters( 'shiftr_get_block_attributes', $attributes, $block );
}
