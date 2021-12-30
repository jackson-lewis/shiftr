<?php 
/**
 * Default page template
 */
get_header();
?>

<main class="site-main">
    <div class="hero--standard<?php echo has_post_thumbnail() ? ' with-post-thumbnail' : ''; ?>">
        <?php if ( has_post_thumbnail() ) : ?>
        <div class="hero-feature-image">
            <?php shiftr_featured_image( get_the_ID(), 'full', array( 'loading' => false ) ); ?>
        </div>
        <?php endif; ?>
        <div class="hero-content">
            <div class="container">
                <?php 
                    if ( have_posts() ) {
                        while ( have_posts() ) {
                            the_post();

                            the_title( '<h1>', '</h1>' );
                        }
                    }
                ?>
            </div>
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
