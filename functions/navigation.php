<?php

    /*  ////  --|    Navigate

    */


/**  
 *  shiftr_register_navigation_locations
 *
 *  Register all navigation locations
 *
 *  @since 1.0
 */

function shiftr_register_navigation_locations() {

    register_nav_menus(
        array(
        'main-nav'      => 'Header',
        'footer-nav'    => 'Footer'
        )
    );
}

add_action( 'init', 'shiftr_register_navigation_locations' );


// Primary Navigation

function shiftr_main_nav() {

    wp_nav_menu( 
        array(
            'container'         => 'nav',
            'container_class'   => 'main-nav',
            'menu_class'        => 'main-nav-inner',
            'menu_id'           => '',
            'theme_location'    => 'main-nav',
            'depth'             => 3,
            'fallback_cb'       => false,
            'walker'            => new Shiftr_Primary_Walker()
        )
    );
}


// Footer Navigation

function shiftr_footer_nav() {

    wp_nav_menu( 
        array(
            'container'         => 'nav',
            'container_class'   => 'footer-nav',
            'menu_class'        => '',
            'menu_id'           => '',
            'theme_location'    => 'footer-nav',
            'depth'             => 2,
            'fallback_cb'       => false,
            'walker'            => new Shiftr_Footer_Walker()
        )
    );
}

