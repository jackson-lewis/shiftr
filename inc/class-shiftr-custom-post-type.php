<?php

/**  
 *  Shiftr_Custom_Post_Type
 *
 *  Used to create new post types using a class instance
 *
 *  @since 1.0
 */

class Shiftr_Custom_Post_Type {


    // The main options that are typically set for a custom post type
    protected $label;
    protected $name;
    protected $menu_position;
    protected $menu_icon;

    // This will be used for singular of the post name
    protected $singular;


    // The defaults for the above options
    private $top_level_defaults = array(

        // The label of the post type, always singular
        'label' => 'shiftr',

        // The nicename of the post type
        'name' => 'Shiftr',

        // It's always handy to be able tos et the position within the admin menu
        'menu_position' => 20,

        // The all important icon
        'menu_icon' => 'dashicons-marker'
    );

    // This will be used for overridding $args to register_post_type
    private $register_args;


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

    function __construct( $priority_args = [], $register_args = [] ) {

        // Filter any values set in the instance
        $args = wp_parse_args( $priority_args, $top_level_defaults );

        // Assign $args values to the class properties
        $this->label            = str_replace( ' ', '_', strtolower( $args['label'] ) );
        $this->name             = ucwords( $args['name'] );
        $this->menu_position    = $args['menu_position'];
        $this->menu_icon        = $args['menu_icon'];

        // Get singular value
        $this->singular = $this->singulize( $this->name );

        // Assign $register_args to class
        $this->register_args = $register_args;

        // Check the post type doesn't already exist via another instance of Shiftr_Custom_Post_Type
        if ( ! post_type_exists( $this->plural ) ) {
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
            'public' => true,
            'publicly_queryable' => true,
            'exclude_from_search' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'query_var' => true,
            'menu_position' => $this->menu_position,
            'menu_icon' => $this->menu_icon,
            'rewrite'   => array( 'slug' => $this->plural ),
            'has_archive' => $this->plural,
            'capability_type' => 'page',
            'capabilities' => array(),
            'hierarchical' => false,
            'supports' => array( 'title', 'editor', 'thumbnail', 'revisions' )
        );
        
        // Filter any values set in the instance of Shiftr_Custom_Post_Type
        $defaults = wp_parse_args( $this->register_args, $defaults );

        // The labels
        $labels = array(
            'labels' => array(
                'name' => $this->name,
                'singular_name' => $this->singular,
                'all_items' => 'All ' . $this->name,
                'add_new' => 'Add ' . $this->singular,
                'add_new_item' => 'Add New ' . $this->singular,
                'edit' => 'Edit',
                'edit_item' => 'Edit ' . $this->singular,
                'new_item' => 'New ' . $this->singular,
                'view_item' => 'View ' . $this->name,
                'search_items' => 'Search ' . $this->name,
                'not_found' =>  'Nothing found in the Database.',
                'not_found_in_trash' => 'Nothing found in Trash',
                'parent_item_colon' => ''
            )
        );

        // Combine arrays to form the main $args array for WP register_post_type()
        $args = array_merge( $labels, $defaults );

        // Register the custom post type
        register_post_type( $this->label, $args );
    }


    /**  
     *  singulize
     *
     *  Register the post type with WP
     *
     *  @since 1.0
     *
     *  @param $value str Convert the name of the post type to a singular
     *  @return str 
     */

    protected function singulize( $value ) {

        // Get last 3 characters of string
        $ending = substr( $value, -3, strlen( $value ) );

        // Handle 'ies' or 's' endings
        if ( $ending == 'ies' ) {

            // Remove 'ies' and append 'y'
            $singular = substr( $value, 0, -3 ) . 'y';
        } else {

            // Remove 's'
            $singular = substr( $value, 0, -1 );
        }

        // Return the singular counterpart
        return $singular;
    }
}

