<?php 
/**
 * Default post template
 */
get_header();
?>

<main class="site-main">

    <div class="hero--post_single">
        <div class="container">
            <div class="post-featured-image">
                <?php shiftr_featured_image( get_the_ID(), 'large', array( 'loading' => false ) ); ?>
            </div>
            <header class="post-header">
                <div class="container">
                    <?php the_title( '<h1>', '</h1>' ); ?>
                    <time datetime="<?php the_time( 'Y-m-d' ); ?>"><?php the_time( 'd F Y' ); ?></time>
                </div>
            </header>
        </div>
    </div>

    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
    <section class="site-section">
        <article class="container content">
            <?php

            the_content();

            ?>
        </article>
    </section>
    <?php endwhile; endif; ?>

    <?php
    /**
     * Display related posts after the main post content.
     */
    $related_posts = new WP_Query([
        'posts_per_page' => 3,
        'post__not_in' => [ get_the_ID() ]
    ]);

    if ( $related_posts->have_posts() ) :
    
    ?>
        <section class="site-section related-posts">
            <div class="container">
                <h2>Related posts</h2>

                <ul class="posts loop">
                    <?php
                        while( $related_posts->have_posts() ) {
                            $related_posts->the_post();

                            shiftr_get_template( 'content-post.php' );
                        }

                        wp_reset_postdata();
                    ?>
                </ul>

            </div>
        </section>
    <?php endif; ?>

</main>
    

<?php get_footer(); ?>
