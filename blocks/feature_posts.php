<?php
/**
 * Feature Posts block
 * 
 * Display feature posts, this is configurable to meet any requirements.
 * Be it recent posts, most read, specific taxonomy or manually chosen
 * via Post Object field.
 * 
 * Configure the query in the template file.
 * 
 * @var object $posts The WP_Query object
 */
?>
<div class="container">
    <?php shiftr_block_heading(); ?>
</div>

<?php if ( $posts->have_posts() ) : ?>
<div class="loop--posts">
<?php

    while( $posts->have_posts() ) :
        $posts->the_post();

        ?>
        <div class="card--post">

            <div class="image">
                <?php shiftr_featured_image( get_the_ID(), 'small' ); ?>
            </div>

            <div class="details">
                <h3 id="card--post-<?php echo get_the_ID(); ?>"><?php the_title(); ?></h3>
                <span class="date"><?php the_time( 'd F Y' ); ?></span>
                <p><?php the_excerpt(); ?></p>
                <a href="<?php the_permalink(); ?>" class="button-fill">Read <span class="screen-reader-text" aria-labelledby="card--post-<?php echo get_the_ID(); ?>"></span></a>
            </div>

        </div>
        <?php
        
    endwhile;
    
?>
</div>
<?php endif; ?>

<div class="container">
    <?php shiftr_block_after(); ?>
</div>
