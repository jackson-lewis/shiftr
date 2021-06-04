<?php 
/**
 * 404 page
 */
get_header();
?>


<main class="site-main">
    <div class="error404-content content">
        <?php
        $_404_post_id = get_page_by_title( '404' ) ?: 0;

        if ( $_404_post_id > 0 ) {
            echo apply_filters( 'the_content', get_the_content( null, false, $_404_post_id ) );
            
        } else if ( is_user_logged_in() && current_user_can( 'administrator' ) ) {
            printf( '<h1 style="text-align:center;">%s</h1>', '404 - Page not found' );
            printf( '<p style="text-align:center;">%s</p>', 'To set the content for this page, create a page called "404" and set it to private. Add the content you want to appear here in the standard WordPress editor.' );
            printf( '<p style="text-align:center;"><a href="%s">%s</a></p>', admin_url( 'post-new.php?post_type=page' ), 'New page' );
        }
        ?>
    </div>
</main>
    

<?php get_footer(); ?>
