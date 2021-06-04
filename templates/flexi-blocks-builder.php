<?php 
/**
 * Template name: Flexi Blocks Builder
 * 
 * This is the primary blocks builder template of the theme.
 * It may be appropriate that the majority of pages are built
 * using this template due to its flexible and adaptive nature.
 * 
 * @since v1.2
 */

get_header();

?>


<div class="hero--standard">
    <div class="hero-feature-image">
        <?php shiftr_featured_image( get_the_ID(), 'full', array( 'loading' => false ) ); ?>
    </div>
    <div class="hero-content">
        <div class="container">
            <?php 
                if ( have_posts() ) {
                    while ( have_posts() ) {
                        the_post();

                        the_content();
                    }
                }
            ?>
        </div>
    </div>
</div>


<main class="site-main">
    <?php shiftr_flexi_blocks_builder( 'main' ) ?>
</main>
    

<?php get_footer(); ?>
