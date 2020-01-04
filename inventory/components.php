<?php

// This file should not be executed,
// it is simply to find pre-built components

    exit;
?>


<?php
    // --|    Accordion / ACF Repeater
    
    // 'accordion' as repeater
    // 'tab' as wysiwyg
    // 'panel' as wysiwyg
?>

<?php if ( have_rows( 'accordion' ) ) : ?>
<div class="shiftr-accordion" data-shiftr-accordion>
    
    <?php while ( have_rows( 'accordion' ) ) : the_row(); ?>
                    
    <div class="accordion--item">
        <div class="accordion--tab">
            <?php the_sub_field( 'tab' ); ?>
        </div>
        <div class="accordion--panel">
            <?php the_sub_field( 'content' ); ?>
        </div>
    </div>

    <?php endwhile; ?>

</div>
<?php endif; ?>




<?php
    // --|    Carousel / ACF Repeater
    
    // 'carousel' as repeater
    // 'image' as image (return ID)
?>

<?php if ( have_rows( 'carousel' ) ) : ?>
<div id="sample-carousel" class="shiftr-carousel" data-shiftr-carousel>
                        
    <div class="carousel-stage">

        <?php while ( have_rows( 'carousel' ) ) : the_row(); ?>

        <div class="carousel-item">
            <?php shiftr_image( get_sub_field( 'image' ) ); ?>
        </div>

        <?php endwhile; ?>

    </div>

    <button id="sample-carousel--button-prev" class="carousel-button" aria-label="Previous slide"></button>
    <button id="sample-carousel--button-next" class="carousel-button" aria-label="Next slide"></button> 

</div>
<?php endif; ?>




<?php
    // --|    Carousel / Post Loop
?>

<?php

$posts = get_posts( array(
    'post_type' => 'post',
    'numberposts' => 10
));

if ( ! empty( $posts ) ) :

?>
<div id="sample-carousel" class="shiftr-carousel" data-shiftr-carousel>
                        
    <div class="carousel-stage">

        <?php foreach ( $posts as $post ) : setup_postdata( $post ); ?>

        <div class="carousel-item">
            <?php shiftr_featured_image(); ?>
        </div>

        <?php endforeach; wp_reset_postdata(); ?>

    </div>

    <button id="sample-carousel--button-prev" class="carousel-button" aria-label="Previous slide"></button>
    <button id="sample-carousel--button-next" class="carousel-button" aria-label="Next slide"></button> 

</div>
<?php endif; ?>

