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
        'header-primary'    => 'Header',
        'footer-primary'    => 'Footer'
        )
    );
}

add_action( 'init', 'shiftr_register_navigation_locations' );


// Primary Navigation

function shiftr_nav_primary() {

    wp_nav_menu( 
        array(
            'container'         => 'nav',
            'container_class'   => 'nav-primary',
            'menu_class'        => '',
            'menu_id'           => 'nav-primary',
            'theme_location'    => 'header-primary',
            'depth'             => 3,
            'fallback_cb'       => false,
            'walker'            => new Shiftr_Nav_Primary_Walker()
        )
    );
}

function shiftr_nav_primary_mobile() {

    wp_nav_menu( 
        array(
            'container'         => 'nav',
            'container_class'   => 'nav-primary-mobile',
            'menu_class'        => '',
            'menu_id'           => 'nav-primary-mobile',
            'theme_location'    => 'header-primary',
            'depth'             => 3,
            'fallback_cb'       => false,
            'walker'            => new Shiftr_Nav_Primary_Mobile_Walker()
        )
    );
}


// Footer Navigation

function shiftr_nav_footer() {

    wp_nav_menu( 
        array(
            'container'         => 'nav',
            'container_class'   => 'nav-footer',
            'menu_class'        => '',
            'menu_id'           => '',
            'theme_location'    => 'footer-primary',
            'depth'             => 2,
            'fallback_cb'       => false,
            'walker'            => new Shiftr_Nav_Footer_Walker()
        )
    );
}

