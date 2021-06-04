<?php
/**
 * Block: Featured posts
 * 
 * Display a selection of posts.
 */
$settings = shiftr_get_block_settings();

$block_before = '';
$block_after = '';
$shortcode = '';
/**
 * Define the data array structure
 */
$data = array(
    'by-post' => array(),
    'by-category' => (object) array()
);

if ( $settings['use_global'] ) {
    /**
     * Get global data
     */
    $global_field_data = shiftr_get_global_block_data( 'featured-posts' );

    if ( $global_field_data ) {
        $block_before = $global_field_data['block-before'];
        $block_after = $global_field_data['block-after'];
    
        $data = array(
            'by-post' => $global_field_data['by-post'],
            'by-category' => $global_field_data['by-category']
        );
    }

} else {
    /**
     * Get instance data
     */
    $data = array(
        'by-post' => get_sub_field( 'by-post' ),
        'by-category' => get_sub_field( 'by-category' )
    );
}
/**
 * Setup WP_Query args.
 */
$args = array(
    'posts_per_page' => 3
);

if ( $data['by-post'] ) {
    $args['post__in'] = $data['by-post'];

} elseif ( $data['by-category'] ) {
    $args['tax_query'] = array();
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
