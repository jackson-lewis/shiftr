<?php 
/**
 * Default page template
 */
get_header();
?>

<main class="site-main">

    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
    <section class="site-section">
        <article class="container content">
            <?php

            the_title( '<h1>', '</h1>' );
            the_content();

            ?>
        </article>
    </section>
    <?php endwhile; endif; ?>

</main>
    

<?php get_footer(); ?>
