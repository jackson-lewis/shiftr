<?php 
/**
 * Default archive
 */
get_header();

global $wp_query;
?>

<main class="site-main">

    <div class="hero--archive-post">
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
            
            <?php if ( have_posts() ) : ?>
            <ul class="posts loop">
            <?php
                while( have_posts() ) :
                    the_post();

                    ?>
                    <li class="post">
                        <a href="<?php the_permalink(); ?>">
                            <div class="post-thumbnail">
                                <?php shiftr_featured_image( get_the_ID(), 'medium' ); ?>
                            </div>
                            <div class="post-summary">
                                <h3 id="post-<?php echo get_the_ID(); ?>"><?php the_title(); ?></h3>
                                <time datetime="<?php the_time( 'Y-m-d' ); ?>"><?php the_time( 'd F Y' ); ?></time>
                            </div>
                        </a>
                    </li>
                    <?php
                    
                endwhile;

                wp_reset_postdata();
            ?>
            </ul>
            <?php endif; ?>

        </div>
    </section>

</main>
    

<?php get_footer(); ?>
