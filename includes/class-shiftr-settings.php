<?php


class Shiftr_Settings {

    // Core theme details
    protected $shiftr_name = 'Shape Shiftr';
    protected $shiftr_url = 'https://shapeshiftr.co.uk';

    private $version = '1.6.5';
    private $version_date = '03/09/22'; 


    // Contact Details
    public $email = '';
    public $phone = '';
    public $address = '';
    public $address_link = '';


    // --|  Dev Settings

    // Fonts
    public $fonts = [];

    // Is a cookie notice required
    public $cookie_notice = true;

    // Set the project primary colour
    public $theme_color = '';

    // Should lazy loading of background-images be enabled
    public $bg_lazy_loading = true;

    // Should jQuery be used on front-end
    public $use_jquery = false;

    // Show Posts in Admin menu, default false
    public $admin_show_posts = false;

    // Show Comments in Admin menu, default false
    public $admin_show_comments = false;

    // Remove editor for specified post types
    public $remove_editor_by_post_type = [];

    // Define public post types, safety net for incorrectly set post types
    public $forms = [];

    // Set the array for the Shiftr JS Object
    public $js_object = [];

    /**  
     *  Assign values to the properties
     *
     *  @since 1.0
     */
    function __construct() {
        add_action( 'acf/init', [ $this, 'init' ], 20 );
    }


    /**
     * Init. This ensures ACF has initiated first.
     */
    function init() {
        $contact_details = $this->get_acf_value( 'contact_details' );

        if ( $contact_details ) {
            $this->email        = isset( $contact_details['email_address'] ) ? $contact_details['email_address'] : '';
            $this->phone        = isset( $contact_details['phone_number'] ) ? $contact_details['phone_number'] : '';
            $this->address      = isset( $contact_details['address'] ) ? $contact_details['address'] : '';
        }

        /**
         * Tracking.
         * 
         * @since v1.6
         */
        $tracking = $this->get_acf_value( 'tracking', false );

        if ( $tracking ) {
            $this->tracking = (object) $tracking;
        }
    }


    /**  
     *  Get the value from an ACF option field
     *
     * @since 1.0
     * @param string $value The name of the ACF option field
     * @param bool $format
     * @return mixed|bool The value of the field if found, or false
     */
    public function get_acf_value( string $value, bool $format = true ) {

        if ( function_exists( 'get_field' ) ) {
            return get_field( $value, 'option', $format );
        }

        return false;
    }


    /**  
     *  Echo the value from an ACF option field
     *
     *  @since 1.0
     *  @param string $value The name of the ACF option field
     *  @return mixed|bool The value of the field if found, or false
     */
    public function acf_value( string $value ) {

        if ( function_exists( 'the_field' ) ) {
            if ( get_field( $value, 'option' ) ) {
                the_field( $value, 'option' );
            }
        }

        return false;
    }

    /**  
     *  Echo a property value
     *
     *  @since 1.0
     *  @param string $value The name of the property
     */
    public function the( $value ) {
        echo $this->$value;
    }


    /**  
     *  Return a property value
     *
     *  @since 1.0
     *  @param string $value The name of the property
     *  @return mixed The property value
     */
    public function get( $value ) {
        return $this->$value;
    }

}


$shiftr = new Shiftr_Settings();

/**
 * For backwards compatability where global is called.
 */
$GLOBALS['shiftr'] = $shiftr;

/**  
 *  Return the $shiftr instance
 *
 *  @since 1.0
 *  @return object The $shiftr instance
 */

function shiftr() {
    global $shiftr;

    if ( ! isset( $shiftr ) ) {
        $shiftr = new Shiftr_Settings();
    }

    return $shiftr;
}
