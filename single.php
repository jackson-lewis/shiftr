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
                <?php shiftr_featured_image( get_the_ID(), 'large', false ); ?>
            </div>
            <header class="post-header">
                <div class="container">
                    <?php the_title( '<h1>', '</h1>' ); ?>
                    <span class="post-date"><?php the_time( 'd F Y' ); ?></span>
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

</main>
    

<?php get_footer(); ?>
