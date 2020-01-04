<?php

    /*  ////  --|    Pagination

        With thanks to JointsWP for the pagination in this version of Shiftr

    */


/**  
 *  shiftr_pagination
 *
 *  Pagination wherever it is needed
 *
 *  @since 1.0
 */

function shiftr_pagination() {
    global $wp_query;

    $big = 999999999; // This needs to be an unlikely integer
    // For more options and info view the docs for paginate_links()
    // http://codex.wordpress.org/Function_Reference/paginate_links

    $links = paginate_links( array(
        'base' => str_replace( $big, '%#%', html_entity_decode( get_pagenum_link( $big ) ) ),
        'current' => max( 1, get_query_var( 'paged' ) ),
        'total' => $wp_query->max_num_pages,
        'mid_size' => 5,
        'prev_next' => true,
        'prev_text' => '&laquo;',
        'next_text' => '&raquo;',
        'type' => 'array',
    ) );

    if ( $links ) {
        echo '<div class="pagination">';
        //echo $paginate_links;
        //print_r( $paginate_links );

        echo '<ul>';

        foreach ( $links as $single ) {
            echo '<li>' . str_replace( '/page/1', '', $single ) . '</li>';
        }

        echo '</ul>';

        echo '</div>';
    }
}

