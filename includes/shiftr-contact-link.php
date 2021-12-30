<?php
/**  
 *  Take the contact type and assign the corresponding value
 *
 *  @since 1.0
 *
 *  @param $target str The contact type
 *  @param $email_value str The email value
 *  @param $phone_value str The phone value
 *  @param $address_value str The address value
 *  @return string
 */
function shiftr_contact_type( $target, $email_value, $phone_value, $address_value ) {

    if ( $target == 'email' ) {
        $variable_to_assign = $email_value;

    } elseif ( $target == 'phone'  ) {
        $variable_to_assign = $phone_value;

    } else {
        $variable_to_assign = $address_value;
    }

    return $variable_to_assign;
}


/**  
 *  Build the anchor element
 *
 *  @since 1.0
 *
 *  @param $args array Assign contact details and type to use
 *  @param $direct bool Has function been called directly or not
 *  @return string|bool
 */
function shiftr_contact_link( $args = array(), $direct = true ) {

    // Do not allow this function to be called directly
    if ( $direct ) return false;

    // Get $shiftr
    global $shiftr;

    // The default values for the function to process
    $defaults = array(
        'type'              => 'email',
        'show_as'           => 'inline',
        'class'             => '',
        'id'                => '',
        'content'           => '',
        'email'             => $shiftr->email,
        'phone'             => $shiftr->phone,
        'address'           => $shiftr->address,
        'address_link'      => $shiftr->address_link,
        'address_format'    => 'inline'
    );

    $args = (object) wp_parse_args( $args, $defaults );

    // The content found inbetween the anchor tags, defaults to just email or phone
    if ( empty( $args->content ) ) {
        $args->content = $defaults['content'];

        $args->content = shiftr_contact_type( $args->type, $args->email, $args->phone, $args->address );
    }

    // The function can only accept email or phone types
    if ( $args->type == 'email' || $args->type == 'phone' || $args->type == 'address' ) {
        // Do nothing

    } else {
        return false;
    }

    // Setup for attributes
    $attr = array();


    $attr['href'] = shiftr_contact_type( $args->type, 'mailto:' . $args->email, 'tel:' . str_replace( ' ', '', $args->phone ), $args->address_link );

    // Accessibility feature for users who's default mail client is in-browser
    $attr['target'] = shiftr_contact_type( $args->type, '_blank', '', '_blank' );

    if ( $args->type == 'address' ) {

        $attr['rel'] = 'noopener';
    }

    $attr['id'] = $args->id;

    $attr['class'] = ( $args->show_as == 'button' ) ? 'button' : '';

    if ( $args->class != '' ) {

        if ( $attr['class'] != '' ) {
            $attr['class'] .= ' ';
        }
        
        $attr['class'] .= $args->class;
    }

    if ( $args->type == 'address' && $args->address == $args->content ) {

        if ( $args->address_format == 'inline' ) {
            $formatted = $args->content;

        } elseif ( $args->address_format == 'line_breaks' ) {
            $address_content = explode( ', ', $args->content );

            $formatted = '';

            $i = 1;

            foreach ( $address_content as $line ) {
                $formatted .= $line;

                if ( $i != count( $address_content ) ) {
                    $formatted .= ',<br>';
                }

                $i++;
            }
        }

        $link = '<a ' . shiftr_output_attr( $attr ) . '>' . $formatted . '</a>';

    } else {

        $link = '<a ' . shiftr_output_attr( $attr ) . '>' . str_replace( ' ', '&nbsp;', $args->content ) . '</a>';
    }

    return $link;
}


/**  
 *  Output the contact link within PHP
 *
 *  @since 1.0
 *
 *  @param $args array Assign contact details and type to use
 */
function shiftr_add_contact_link( $args = [] ) {
    echo shiftr_contact_link( $args, false );
}


/**  
 *  Function to run on call to shortcode [email_link] - output email link
 *
 *  @since 1.0
 *
 *  @param $atts array Arguments supported by shiftr_contact_link()
 */
function shiftr_add_inline_email( $atts = [] ) {
    $atts = array_change_key_case( (array)$atts, CASE_LOWER );

    return shiftr_contact_link( $atts, false );
}
add_shortcode( 'email_link', 'shiftr_add_inline_email' );


/**  
 *  Function to run on call to shortcode [phone_link] - output phone link
 *
 *  @since 1.0
 *
 *  @param $atts array Arguments supported by shiftr_contact_link()
 */
function shiftr_add_inline_phone( $atts = [] ) {
    $atts = array_change_key_case( (array)$atts, CASE_LOWER );

    $as_phone = array( 'type' => 'phone' );

    return shiftr_contact_link( array_merge( $as_phone, $atts ), false );
}
add_shortcode( 'phone_link', 'shiftr_add_inline_phone' );
