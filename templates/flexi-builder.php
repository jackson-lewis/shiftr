<?php 
/**
 * Template name: Flexi
 * 
 * This is the primary blocks builder template of the theme.
 * It may be appropriate that the majority of pages are built
 * using this template due to its flexible and adaptive nature.
 * 
 * @since v1.2
 */

get_header();
?>


<main class="site-main">

<?php

if ( have_rows( 'flexi_blocks' ) ) :

    while ( have_rows( 'flexi_blocks' ) ) : the_row();

        $block = get_row_layout();
        $settings = shiftr_get_block_settings();
        $atts = shiftr_get_block_attributes( $block, $settings );


        echo '<section ' . shiftr_output_attr( $atts ) . '>';

        switch ( $block ) :

            /**
             * Basic block, single ACF WYSIWYG field for any use.
             */
            case 'content':
?>


<div class="container contain-line-width">
    <div class="content">
        <?php the_sub_field( 'content' ); ?>
    </div>
</div>


<?php
    break;

    /**
     * Basic block
     * 
     * WYSIWYG and image field side by side for larger screens.
     * On mobile, content is first by default.
     */
    case 'content_image':
?>


<div class="container">
    <div class="content">
        <?php the_sub_field( 'content' ); ?>
    </div>
    <div class="image">
        <?php shiftr_image(); ?>
    </div>
</div>


<?php
    break;

    /**
     * Basic block
     * 
     * Two Image fields for displaying two images side-by-side.
     * There is a JS function that watches for this block, to force 
     * set an average hieght of the images. This is due to varying browwer
     * handling of Grid and how elements fill a grid area.
     */
    case 'image_image':
?>


<div class="container">
    <div class="image">
        <?php shiftr_image( get_sub_field( 'image_1' ) ); ?>
    </div>
    <div class="image">
        <?php shiftr_image( get_sub_field( 'image_2' ) ); ?>
    </div>
</div>
   

<?php
    break;

    /**
     * Accordion
     * 
     * Behavour should be configured using HTML data attributes.
     */
    case 'accordion':

        shiftr_get_block( $block, array( $settings ) );
?>
        

<?php
    break;

    /**
     * A Glide.js slider 
     */
    case 'gallery':

        $images = get_sub_field( 'images' );

        if ( empty( $images ) ) break;

        shiftr_get_block( $block, array( $images ) );
?>


<?php
    break;

    /**
     * Display featured posts, from most recent to filtered by
     * a category/taxonomy. 
     */
    case 'feature_posts':

        $featured_posts = get_sub_field( 'feature_posts' );
        $by_category = get_sub_field( 'filter_by_category' );

        $args = array(
            'numberposts' => 20
        );

        if ( ! empty( $featured_posts ) && $by_category <= 0 ) {

            $args['post__in'] = $featured_posts;
            $args['orderby'] = 'post__in';

        } else if ( $by_category > 0 ) {

            $args['cat'] = array( $by_category );
        }

        $posts = new WP_Query( $args );

        shiftr_get_block( $block, array( $posts ) );
?>


<?php
            break;

        endswitch;

        echo '</section>';

    endwhile;
endif;

?>

</main>
    

<?php get_footer(); ?>
