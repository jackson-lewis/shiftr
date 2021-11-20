<?php 
/**
 * Home - posts page
 */
get_header();

?>

<main class="site-main">
    <div class="hero--basic">
        <header class="container hero-content">
            <h1><?php single_post_title(); ?></h1>
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
