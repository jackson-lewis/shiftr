<?php 
/**
 * Default archive
 */
get_header();

global $wp_query;
?>

<main class="site-main">

    <div class="hero--post_archive">
        <div class="container">
            <header class="hero-archive-content">
                <h1><?php echo get_search_query() != '' ? 'Searched: ' . get_search_query() : 'Posts'; ?></h1>
                <?php if  ( get_search_query() != '' ) : $count = $wp_query->found_posts; ?>
                <span class="search-result-count"><?php printf( _n( '%s result was', '%s results were', $count ) . ' found', number_format_i18n( $count ) ); ?></span>
                <?php endif; ?>
            </header>
        </div>
    </div>

    <section class="site-section blog-layout">
        <div class="container">
            
            <div class="loop--posts">

                <?php

                if ( have_posts() ) :
                    while( have_posts() ) :
                        the_post();

                ?>

                <div class="card--post">

                    <div class="image">
                        <?php shiftr_featured_image(); ?>
                    </div>

                    <div class="details">
                        <h3 id="card--post-<?php echo get_the_ID(); ?>"><?php the_title(); ?></h3>
                        <span class="date"><?php the_time( 'd F Y' ); ?></span>
                        <p><?php the_excerpt(); ?></p>
                        <a href="<?php the_permalink(); ?>" class="button-fill">Read <span class="screen-reader-text" aria-labelledby="card--post-<?php echo get_the_ID(); ?>"></span></a>
                    </div>

                    
                </div>

                <?php endwhile; ?>

                <?php else : ?>

                <p>Oops! It looks like nothing could be found...</p>

                <?php endif; ?>
                
            </div>

        </div>
    </section>

</main>
    

<?php get_footer(); ?>
