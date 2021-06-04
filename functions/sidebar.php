<?php
/**
 * WordPress sidebar
 */

/**  
 *  Register the sidebar for Posts
 *
 *  @since 1.0
 */
function shiftr_posts_sidebar() {

    register_sidebar( array(
        'id' => 'the_blog_sidebar',
        'name' => 'The Blog Sidebar',
        'description' => 'The primary Sidebar for the blog',
        'before_widget' => '<div class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h4>',
        'after_title' => '</h4>',
    ));
}
add_action( 'widgets_init', 'shiftr_posts_sidebar' );


/**  
 *  Filter the search form for Posts
 *
 *  @since 1.0
 *
 *  @param $form str The search form HTML
 *  @return string The search form HTML
 */
function shiftr_posts_search( $form ) {

    $form = '<form method="get" role="search" action="'. get_post_type_archive_link( 'post' ) . '" class="search">
                <input type="text" name="s" value="' . esc_attr( get_search_query() ) . '" placeholder="Search...">
            </form>';

    return $form;
}
add_filter( 'get_search_form', 'shiftr_posts_search', 100 );
