<?php
/**
 * Single post
 */
?>
<li class="post post-<?php echo get_the_ID(); ?>">
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
