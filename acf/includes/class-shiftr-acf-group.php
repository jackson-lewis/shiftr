<?php

namespace Shiftr_ACF;

/**
 * This class makes it easier to manage the ACF groups, similar to how the 
 * blocks are managed. 
 */
class Group {

    /** @var string $key The group key */
    var $key = '';

    /** @var array $acf_group_data Stores the final array used for ACF group data */
    var $acf_group_data = '';


    function __construct( $key = '', $args = array() ) {
        
        if ( $this->check_group_key_available( $key ) ) {
            $this->key = $key;

            $this->init( $args );
            
        } else {
            trigger_error( 'A group with the key "'. $key .'" has already been registered to the Flex ACF Groups Library.', E_USER_NOTICE );
        }
    }

    /**
     * Where the bulk of the work happens
     */
    function init( $args ) {
        $args['key'] = $this->key;

        $this->acf_group_data = wp_parse_args( $args, $this->default_args() );

        $this->add_group_to_library();
    }


    /**
     * Returns the default group args
     */
    function default_args() {
        return array(
            'key' => '',
            'title' => '',
            'fields' => array(),
            'location' => array(),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen' => ''
        );
    }

    /**
     * Returns the acf_add_local_field_group() with $args set.
     */
    function acf_add_local_field_group() {
        return acf_add_local_field_group( $this->acf_group_data );
    }

    /**
     * Checks the key provided is not already used
     * 
     * @param string $key The ACF group key
     * @return bool
     */
    function check_group_key_available( $key ) {
        global $shiftr_groups_library;

        return ! isset( $shiftr_groups_library[ $key ] );
    }


    /**
     * Adds the group instance to the global Groups Library
     */
    public function add_group_to_library() {
        global $shiftr_groups_library;

        $shiftr_groups_library[ $this->key ] = $this;
    }
}
