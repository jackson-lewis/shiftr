<?php


class Shiftr_Settings {

    // Core theme details
    protected $shiftr_name = 'Shape Shiftr';
    protected $shiftr_url = 'https://shapeshiftr.co.uk';

    private $version = '1.5.1-alpha';
    private $version_date = '26/07/21'; 


    // Contact Details
    public $email;
    public $phone;
    public $address;
    public $address_link;


    /**  
     *  Assign values to the properties
     *
     *  @since 1.0
     */
    function __construct() {
        $contact_details = $this->get_acf_value( 'contact-details' );

        $this->email        = $contact_details['email-address'];
        $this->phone        = $contact_details['phone-number'];
        $this->address      = $contact_details['address'];
    }


    // --|  Dev Settings

    // Fonts
    public $fonts = array();

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
    public $remove_editor_by_post_type = array();

    // Define public post types, safety net for incorrectly set post types
    public $forms = array();

    // Set the array for the Shiftr JS Object
    public $js_object = array();

    /**  
     *  Get the value from an ACF option field
     *
     *  @since 1.0
     *  @param $value str The name of the ACF option field
     *  @return mixed|bool The value of the field if found, or false
     */
    public function get_acf_value( $value ) {

        if ( function_exists( 'get_field' ) ) {

            if ( get_field( $value, 'option' ) ) {
                return get_field( $value, 'option' );
            } else {
                return false;
            }
        } else {

            return false;
        }
    }


    /**  
     *  Echo the value from an ACF option field
     *
     *  @since 1.0
     *  @param $value str The name of the ACF option field
     *  @return mixed|bool The value of the field if found, or false
     */
    public function acf_value( $value ) {

        if ( function_exists( 'get_field' ) ) {

            if ( get_field( $value, 'option' ) ) {
                echo get_field( $value, 'option' );
            } else {
                return false;
            }
        } else {
            
            return false;
        }
    }

    /**  
     *  Echo a property value
     *
     *  @since 1.0
     *  @param $value str The name of the property
     */
    public function the( $value ) {
        echo $this->$value;
    }


    /**  
     *  Return a property value
     *
     *  @since 1.0
     *
     *  @param $value str The name of the property
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
