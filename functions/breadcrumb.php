<?php

function shiftr_breadcrumb() {

    if ( function_exists('yoast_breadcrumb') ) {
        echo '<div class="site-breadcrumb"><div class="container">';
        yoast_breadcrumb();
        echo '</div></div>';
    }
}
