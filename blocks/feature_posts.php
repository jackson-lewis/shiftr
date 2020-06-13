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
<div class="draggable--post-loop">
    <div class="container"></div>
    <div class="draggable-row">
    <?php

        while( $posts->have_posts() ) :
            $posts->the_post();

            shiftr_get_template( 'card--post.php' );
            
        endwhile;
        
    ?>
    </div>
    <?php endif; ?>
</div>

<div class="container">
    <?php shiftr_block_after(); ?>
</div>
