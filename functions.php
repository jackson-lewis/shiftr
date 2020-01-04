<?php

/*  ////  --|    Functions ~ The Dark Horse

*/


// Shiftr directory constants
define( 'SHIFTR_ASSETS', get_template_directory() . '/assets' );
define( 'SHIFTR_FUNC', get_template_directory() . '/functions' );
define( 'SHIFTR_INC', get_template_directory() . '/inc' );
define( 'SHIFTR_PARTS', get_template_directory() . '/parts' );


require_once( SHIFTR_INC . '/shiftr-util.php' );
require_once( SHIFTR_INC . '/admin/shiftr-install.php' );


if ( $shiftr_has_acf ) {

    /**
     *  Get theme inc files
     *
     *  @since 1.0
     */

    require_once( SHIFTR_INC . '/class-shiftr-settings.php' );
    require_once( SHIFTR_INC . '/class-shiftr-custom-post-type.php' );
    require_once( SHIFTR_INC . '/class-shiftr-form.php' );
    require_once( SHIFTR_INC . '/class-shiftr-form-handler.php' );
    require_once( SHIFTR_INC . '/class-shiftr-walker.php' );
    require_once( SHIFTR_INC . '/shiftr-helpers.php' );
    require_once( SHIFTR_INC . '/shiftr-core.php' );
    require_once( SHIFTR_INC . '/shiftr-form.php' );
    require_once( SHIFTR_INC . '/shiftr-contact-link.php' );
    require_once( SHIFTR_INC . '/shiftr-components.php' );


    /** 
     *  Get all theme function files
     *
     *  @since 1.0
     */

    require_once( SHIFTR_FUNC . '/_shiftr-settings.php' );
    require_once( SHIFTR_FUNC . '/_shiftr-filters.php' );
    require_once( SHIFTR_FUNC . '/theme-support.php' );
    require_once( SHIFTR_FUNC . '/login.php' );
    require_once( SHIFTR_FUNC . '/admin.php' );
    require_once( SHIFTR_FUNC . '/editor.php' );
    require_once( SHIFTR_FUNC . '/clear-out.php' );
    require_once( SHIFTR_FUNC . '/enqueue-scripts.php' );
    require_once( SHIFTR_FUNC . '/custom-post-types.php' );
    require_once( SHIFTR_FUNC . '/navigation.php' );
    require_once( SHIFTR_FUNC . '/forms.php' );
    require_once( SHIFTR_FUNC . '/sidebar.php' );
    require_once( SHIFTR_FUNC . '/goodbye-emoji.php' );

    if ( function_exists( 'is_woocommerce' ) ) {
        require_once( SHIFTR_FUNC . '/woocommerce.php' );
    }
    
    require_once( SHIFTR_FUNC . '/_shiftr-custom.php' );


    /** 
     *  Go to /functions/_shiftr.php if you wish to add any custom code
     *
     *  Thank you!
     */
}

