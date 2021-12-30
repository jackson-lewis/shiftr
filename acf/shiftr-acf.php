<?php
/**
 * Shiftr ACF
 * 
 * The Advanced Custom Fields in Shiftr is controlled via PHP: https://www.advancedcustomfields.com/resources/register-fields-via-php/
 * 
 * While this may seem like more effort, it actually makes working with the Flexi Blocks Builder incredibly easier.
 * Shiftr_ACF is a framework of sorts which makes working with ACF via PHP simpler and takes much of the effort
 * off the developers hands.
 * 
 * Another key reason for using PHP is that a Flexi Block, described below, will share settings across multiple 
 * types of Blocks, which is a massive pain to control over the GUI or JSON and can only be done manually. Working 
 * over PHP means settings only need to be setup once, and can be instantly shared across any Block.
 * 
 * Blocks:
 * A `Block` is a layout which belongs within the context of a Flexible Content field.
 * Blocks are registered in blocks/blocks.php by calling a new instance of the Flexi_Block class. Whereby
 * a new Flexi_Block instance is added to the `shiftr_blocks_library` global. A Block exists independantly of 
 * a Flexi_Builder (Flexible Content field) and can be added to multiple Builders.
 * 
 * Builders:
 * A Flexi Blocks Builder, or Builder for short, is a Flexible Content field which makes it very easy to add
 * Blocks to it. By default, all available Blocks are added to a Builder, however it is possible to assign
 * only a selection of Blocks. A Builder exists independantly of an ACF group, as it is only a field.
 * 
 * Groups:
 * A group is just that, it's an ACF group. It simply makes it easier to create a new group.
 */
namespace Shiftr_ACF;

/**
 * The Shiftr Blocks Library stores instances of all blocks 
 * available to the Shiftr/ACF Flexi eco-system. This library makes it
 * simple to add blocks to multiple ACf field groups without redeclaring 
 * any block or its settings.
 */
$GLOBALS['shiftr_blocks_library'] = array();
$GLOBALS['shiftr_builder_library'] = array();
$GLOBALS['shiftr_groups_library'] = array();


require( SHIFTR_ACF . '/includes/blocks-library.php' );
require( SHIFTR_ACF . '/includes/field-types.php' );
require( SHIFTR_ACF . '/includes/class-flexi-block.php' );
require( SHIFTR_ACF . '/includes/class-flexi-builder.php' );
require( SHIFTR_ACF . '/includes/class-shiftr-acf-group.php' );
require( SHIFTR_ACF . '/includes/helper-functions.php' );

/**
 * Blocks & Builders
 */
require( SHIFTR_ACF . '/blocks/blocks.php' );
require( SHIFTR_ACF . '/builders/builders.php' );

/**
 * Groups
 */
require( SHIFTR_ACF . '/groups/site-options.php' );
require( SHIFTR_ACF . '/groups/global-blocks.php' );
require( SHIFTR_ACF . '/groups/flexi.php' );


/**
 * Init all the groups
 */
add_action( 'acf/init', function() {
    global $shiftr_groups_library;

    foreach ( $shiftr_groups_library as $key => $group ) {
        $group->acf_add_local_field_group();
    }

    /**
     * Set Google Maps API key
     */
    if ( defined( 'GOOGLE_API_KEY' ) ) {
        acf_update_setting( 'google_api_key', GOOGLE_API_KEY );
    }
});


/**
 * Setup ACF options pages
 */
if ( function_exists( 'acf_add_options_page' ) ) {
    
    acf_add_options_page( array(
        'page_title'    => 'Site Options',
        'menu_title'    => 'Site Options',
        'menu_slug'     => 'site-options',
        'capability'    => 'edit_posts',
        'redirect'      => false
    ));

    acf_add_options_page( array(
        'page_title'    => 'Flexi Blocks Builder: Global Blocks',
        'menu_title'    => 'Global Blocks',
        'menu_slug'     => 'global-blocks',
        'capability'    => 'edit_posts',
        'redirect'      => false,
        'icon_url'      => 'dashicons-block-default'
    ));
}


/**  
 * Disable the ACF admin for all users.
 */
add_filter( 'acf/settings/show_admin', '__return_false' );
