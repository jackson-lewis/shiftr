<?php
/**
 * Accordion block
 * 
 * A accordion component with a multi-function use. An accordion
 * is commonly used for lsiting frequently asked questions, so why not
 * pre-built this via a 'faq' post type, where each post is a question/answer. 
 * 
 * It's also possible to select feature questions that you want to appear in the 
 * accordion. It may be a good idea in the future to add a 'category' taxonomy so
 * that questions can fall into different categories, and then call on a specific
 * category for an accordion block instance.
 * 
 * There is also the option to manually add accordion items with use of ACF
 * repeater field.
 * 
 * @var array $settings The block settings used to get the use_faqs bool value
 */
?>
<div class="container contain-line-width">
    <?php shiftr_block_heading(); ?>

    <?php if ( have_rows( 'accordion' ) ) : ?>

    <div class="shiftr-accordion" data-shiftr-accordion>
        
        <?php while ( have_rows( 'accordion' ) ) : the_row(); ?>
                        
        <div class="accordion--item">
            <div class="accordion--tab">
                <?php the_sub_field( 'tab' ); ?>
            </div>
            <div class="accordion--panel">
                <?php the_sub_field( 'panel' ); ?>
            </div>
        </div>

        <?php endwhile; ?>

    </div>

    <?php elseif ( $settings['use_faqs'] ) :

        $posts = get_posts( array(
            'post_type' => 'faq',
            'numberposts' => -1,
            'post__in' => get_sub_field( 'featured_questions' ) ? get_sub_field( 'featured_questions' ) : array()
        ));
        
        ?>

    <div class="shiftr-accordion" data-shiftr-accordion>
        
        <?php foreach ( $posts as $post ) : setup_postdata( $post ); ?>
                        
        <div class="accordion--item">
            <div class="accordion--tab">
                <?php the_title(); ?>
            </div>
            <div class="accordion--panel">
                <?php the_content(); ?>
            </div>
        </div>

        <?php endforeach; wp_reset_postdata(); ?>

    </div>

    <?php endif; ?>

    <?php shiftr_block_after(); ?>
</div>
