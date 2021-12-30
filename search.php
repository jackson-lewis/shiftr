<?php 
/**
 * Search results page
 */
get_header();

global $wp_query;
?>

<main class="site-main">
    <div class="hero--basic">
        <header class="container hero-content">
            <h1><?php echo get_search_query() ?></h1>
            <?php if  ( get_search_query() != '' ) : $count = $wp_query->found_posts; ?>
            <span class="search-result-count"><?php printf( _n( '%s result was', '%s results were', $count ) . ' found', number_format_i18n( $count ) ); ?></span>
            <?php endif; ?>
        </header>
    </div>

    <section class="site-section posts-loop">
        <div class="container">
            
            <?php if ( have_posts() ) : ?>
                <ul class="posts loop">
                    <?php
                        while( have_posts() ) {
                            the_post();

                            shiftr_get_template( 'content-post.php' );
                        }

                        wp_reset_postdata();
                    ?>
                </ul>

                <?php shiftr_pagination(); ?>
            <?php endif; ?>

        </div>
    </section>
</main>
    

<?php get_footer(); ?>
