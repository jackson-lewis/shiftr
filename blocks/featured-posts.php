<?php
/**
 * Block: Featured posts
 * 
 * Display a selection of posts.
 */
$args = array(
    'posts_per_page' => 3
);

if ( get_flexi_field( 'by-post' ) ) {
    $args['post__in'] = get_flexi_field( 'by-post' );
    $args['orderby'] = 'post__in';

} elseif ( get_flexi_field( 'by-category' ) ) {
    $args['cat'] = get_flexi_field( 'by-category' );
}

$posts = new WP_Query( $args );

// Notice the block will never not render...
?>
<div class="container">
    <?php shiftr_block_heading(); ?>

    <?php if ( $posts->have_posts() ) : ?>
        <ul class="posts loop">
            <?php
                while( $posts->have_posts() ) {
                    $posts->the_post();

                    shiftr_get_template( 'content-post.php' );
                }

                wp_reset_postdata();
            ?>
        </ul>
    <?php endif; ?>

    <?php shiftr_block_after(); ?>
</div>
