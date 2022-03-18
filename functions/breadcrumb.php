<?php

/**
 * Global wrapper function to breadcrumbs from any provider.
 * 
 * @param bool $echo Should function echo or return output
 * @return string
 */
function shiftr_breadcrumb( bool $echo = true ) {
    $found_provider = false;

    ob_start();
    echo '<div class="site-breadcrumb"><div class="container">';

    // Yoast
    if ( function_exists( 'yoast_breadcrumb' ) ) {
        yoast_breadcrumb();

        $found_provider = true;
    }

    // Rank Math
    if ( function_exists('rank_math_the_breadcrumbs') ) {
        rank_math_the_breadcrumbs();

        $found_provider = true;
    }

    echo '</div></div>';

    $output = ob_get_clean();

    if ( $found_provider && $echo ) {
        echo $output;
    }

    return $output;
}
