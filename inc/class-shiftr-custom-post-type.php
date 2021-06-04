<?php


class Shiftr_Custom_Post_Type {


    // The main options that are typically set for a custom post type
    protected $name;
    protected $label;
    protected $menu_position;
    protected $menu_icon;

    // This will be used for singular of the post name
    protected $singular;
    protected $plural;

    protected $allow_plural = true;


    // The defaults for the above options
    private $settings = array(

        // The name of the post type
        'name' => '',

        // The display name of the post type, also singular
        'label' => '',

        // It's always handy to be able to set the position within the admin menu
        'menu_position' => 21,

        // The all important icon
        'menu_icon' => 'dashicons-marker',

        // Set whether to allow plural
        'plural' => true
    );

    // This will be used for overridding $args to register_post_type
    private $args;


    /**  
     *  __construct
     *
     *  Set the class properties and add action to register post type
     *
     *  @since 1.0
     *
     *  @param $priority_args array The top level settings of the post type
     *  @param $register_args array The arguments accepted by register_post_type()
     */

    function __construct( $settings = [], $args = [] ) {

        // Filter any values set in the instance
        $_settings = wp_parse_args( $settings, $this->settings );

        if ( $_settings['label'] == '' ) {
            $_settings['label'] = ucwords( str_replace( '_', ' ', $_settings['name'] ) );
        }

        // Assign $args values to the class properties
        $this->name             = $_settings['name'];
        $this->label            = $_settings['label'];
        $this->menu_position    = $_settings['menu_position'];
        $this->menu_icon        = $_settings['menu_icon'];

        $this->allow_plural     = $_settings['plural'];

        // Get singular value
        $this->singular = $this->label;
        $this->plural = $this->pluralize( $this->label );;

        // Assign $register_args to class
        $this->args = $args;

        // Check the post type doesn't already exist
        if ( ! post_type_exists( $this->name ) ) {
            add_action( 'init', array( $this, 'register' ) );
        }
    }


    /**  
     *  register
     *
     *  Register the post type with WP
     *
     *  @since 1.0
     */

    function register() {

        // Default values to the top level of WP register_post_type() array
        $defaults = array(
            'description' => 'Just a custom post type',
            'menu_position' => $this->menu_position,
            'menu_icon' => $this->menu_icon,
            'show_ui' => true,
            'rewrite'   => array( 'slug' => $this->name ),
            'has_archive' => str_replace( '_', '-', $this->name ),
            'hierarchical' => false,
            'supports' => array( 'title', 'editor', 'thumbnail', 'author', 'page-attributes', 'revisions' )
        );
        
        // Filter any values set in the instance of Shiftr_Custom_Post_Type
        $defaults = wp_parse_args( $this->args, $defaults );

        // The labels
        $labels = array(
            'labels' => array(
                'name' => $this->plural,
                'singular_name' => $this->singular,
                'all_items' => 'All ' . $this->plural,
                'add_new_item' => 'Add New ' . $this->singular,
                'edit' => 'Edit',
                'edit_item' => 'Edit ' . $this->singular,
                'new_item' => 'New ' . $this->singular,
                'view_item' => 'View ' . $this->singular,
                'view_items' => 'View ' . $this->plural,
                'search_items' => 'Search ' . $this->plural,
                'not_found' =>  'Nothing found in the Database.',
                'not_found_in_trash' => 'Nothing found in Trash',
                'parent_item_colon' => ''
            )
        );

        // Combine arrays to form the main $args array for WP register_post_type()
        $args = array_merge( $labels, $defaults );


        // Apply filters
        $args = apply_filters( 'shiftr_custom_post_type_register_args', $args, $this->name );


        // Register the custom post type
        register_post_type( $this->name, $args );
    }


    /**  
     *  pluralize
     *
     *  Register the post type with WP
     *
     *  @since 1.0
     *
     *  @param $value str Convert the name of the post type to a plural
     *  @return str 
     */

    protected function pluralize( $value ) {

        // If plurals are disabled, return value
        if ( ! $this->allow_plural ) return $value;

        // Get last 3 characters of string
        $ending = substr( $value, -1, strlen( $value ) );

        // Handle y endings
        if ( $ending == 'y' ) {

            // Remove 'ies' and append 'y'
            $plural = substr( $value, 0, -1 ) . 'ies';
        } else {

            // Remove 's'
            $plural = $value . 's';
        }

        // Return the plural counterpart
        return $plural;
    }
}


// Store all custom post types that aren't part of the core theme
global $shiftr_post_types;

// Placeholder value
$shiftr_post_types = array();


/**  
 *  shiftr_register_post_type
 *
 *  Register the post type with WP
 *
 *  @since 1.0
 *
 *  @global $shiftr_post_types
 *  @param $name str The name of the post type to register
 *  @return array $shiftr_post_types
 */

function shiftr_register_post_type( $name = '', $settings = [], $args = [] ) {

    global $shiftr_post_types;

    // Add name to $settings
    $settings['name'] = $name;

    // Create new Shiftr_Custom_Post_Type instance
    $shiftr_post_types[$name] = new Shiftr_Custom_Post_Type( $settings, $args );

    return $shiftr_post_types;
}
