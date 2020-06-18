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
<div class="loop--post">
<?php

    while( $posts->have_posts() ) :
        $posts->the_post();

        ?>
        <div class="card--post">
            <div class="image">
                <?php shiftr_featured_image( get_the_ID(), 'thumbnail' ); ?>
            </div>
            <div class="details">
                <?php

                $categories = get_the_category();

                // We are force disabling this for now
                if ( ! empty( $categories ) && false ) :
                ?>
                <div class="post-categories">
                    <?php foreach ( $categories as $category ) : ?>
                        <span class="category"><?= $category->name; ?></span>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
                <h3 id="post--<?= get_the_ID(); ?>"><?php the_title(); ?></h3>
                <a href="<?php the_permalink(); ?>" class="link-inline-arrow">Read article <span class="screen-reader-text">on <span aria-labelledby="post--<?= get_the_ID(); ?>"></span></span></a>
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
