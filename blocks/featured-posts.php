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

} elseif ( get_flexi_field( 'by-post' ) ) {
    $args['cat'] = get_flexi_field( 'by-post' );
}

$posts = new WP_Query( $args );

// Notice the block will never not render...
?>
<div class="container">
    <?php shiftr_block_heading(); ?>

    <?php if ( $posts->have_posts() ) : ?>
    <ul class="posts loop">
    <?php
        while( $posts->have_posts() ) :
            $posts->the_post();

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

    <?php shiftr_block_after(); ?>
</div>
