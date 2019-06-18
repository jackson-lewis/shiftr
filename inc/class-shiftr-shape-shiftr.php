<?php


/**  
 *  Shape_Shiftr
 *
 *  The core theme class
 *
 *  @since 1.0
 */

class Shape_Shiftr {

    // Core theme details
    protected $shiftr_name = 'Shape Shiftr';
    protected $shiftr_url = 'https://shapeshiftr.co.uk';

    private $version = '1.5.4.1';
    private $version_date = '30/04/19'; 


    // Contact Details
    public $email;
    public $phone;
    public $address;
    public $address_link;


    /**  
     *  __construct
     *
     *  Assign values to the properties
     *
     *  @since 1.0
     */

    function __construct() {

        $this->email        = $this->get_acf_value( 'the_email' );
        $this->phone        = $this->get_acf_value( 'the_phone' );
        $this->address      = $this->get_acf_value( 'the_address' );
        $this->address_link = $this->get_acf_value( 'the_address_link' );
    }


    // --|  Dev Settings

    // Is a cookie notice required
    public $cookie_notice = true;

    // Set the project primary colour
    public $primary_color = '#F73771';

    // Should jQuery be used on front-end
    public $use_jquery = false;

    // Show Posts in Admin menu, default false
    public $admin_show_posts = false;

    // Show Comments in Admin menu, default false
    public $admin_show_comments = false;

    // Remove editor for specified post types
    public $remove_editor_by_post_type = array();


    /**  
     *  get_acf_value
     *
     *  Get the value from an ACF option field
     *
     *  @since 1.0
     *
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
     *  acf_value
     *
     *  Echo the value from an ACF option field
     *
     *  @since 1.0
     *
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
     *  the
     *
     *  Echo a property value
     *
     *  @since 1.0
     *
     *  @param $value str The name of the property
     */

    public function the( $value ) {
        echo $this->$value;
    }


    /**  
     *  get
     *
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


    /**  
     *  form_default_settings
     *
     *  Get the default settings of the Shiftr Forms
     *
     *  @since 1.0
     *
     *  @return array The settings of the Shiftr Form default settings
     */

    public function form_default_settings() {
        
        $args = array(
            'recepients' => get_option( 'shiftr_form_default_recepients' ),
            'subject' => get_option( 'shiftr_form_default_subject' )
        );

        return (object) $args;
    }

}

$shiftr = new Shape_Shiftr();

