<?php
/**
 * Nagigation menus
 */

/**  
 *  Register all navigation locations
 *
 *  @since 1.0
 */
function shiftr_register_navigation_locations() {

    register_nav_menus(
        array(
        'header-primary'    => 'Header',
        'footer-1'          => 'Footer 1',
        'footer-2'          => 'Footer 2'
        )
    );
}
add_action( 'init', 'shiftr_register_navigation_locations' );


/**
 * Main site menu
 */
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


/**
 * Main site menu, mobile version
 */
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


/**
 * Footer menu 1
 */
function shiftr_nav_footer_1() {

    wp_nav_menu( 
        array(
            'container'         => 'nav',
            'container_class'   => 'nav-footer',
            'menu_class'        => '',
            'menu_id'           => '',
            'theme_location'    => 'footer-1',
            'depth'             => 2,
            'fallback_cb'       => false,
            'walker'            => new Shiftr_Nav_Footer_Walker()
        )
    );
}

/**
 * Footer menu 2
 */
function shiftr_nav_footer_2() {

    wp_nav_menu( 
        array(
            'container'         => 'nav',
            'container_class'   => 'nav-footer',
            'menu_class'        => '',
            'menu_id'           => '',
            'theme_location'    => 'footer-2',
            'depth'             => 2,
            'fallback_cb'       => false,
            'walker'            => new Shiftr_Nav_Footer_Walker()
        )
    );
}
