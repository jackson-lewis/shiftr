<?php


class Shiftr_Form {

    /* str The form name */
    var $form = '';

    /* int The form ID */
    var $form_ID = 0;

    /* str The nicename of the form */
    var $nicename = '';

    /* str Setting for displaying labels */
    var $use_labels = true;

    /* obj The fields of the form */
    var $fields = array();

    /* array The default form set-up */
    var $defaults;


    /**  
     *  Set-up the class ready for handling the request
     *
     *  @since 1.0
     *
     *  @param $form str The name of the form
     *  @param $args array The form settings and defined fields
     */
    function __construct( $form = '', $args = [] ) {

        $this->defaults = array(
            'settings' => array(
                'nicename' => shiftr_to_nicename( $form ),
                'labels' => true
            ),
            'fields' => array()
        );

        $args = (object) wp_parse_args( $args, $this->defaults );

        $this->form = $form;
        $this->nicename = $args->settings['nicename'];
        $this->use_labels = $args->settings['labels'];
        $this->form_ID = $this->get_form_ID();

        $this->fields = $args->fields;
    }


    /**  
     *  This does nothing
     *
     *  @since 1.0
     */
    function init() {}


    /**  
     *  ...
     *
     *  @since 1.0
     */
    function get_form_ID() {
        $form_post_id = 0;

        $form_post = get_posts( array(
            'post_type' => 'shiftr_form',
            'name' => $this->form,
            'numberposts' => 1,
            'fields' => 'ids'
        ));

        if ( ! empty( $form_post ) ) {
            $form_post_id = array_shift( $form_post );
        }

        // Create post if one does not exist
        if ( $form_post_id <= 0 ) {

            $form_post_id = wp_insert_post( array(
                'post_author' => 1,
                'post_title' => $this->nicename,
                'post_name' => $this->form,
                'post_status' => 'publish',
                'post_type' => 'shiftr_form'
            ));
        }

        return $form_post_id;
    }


    /**  
     *  ...
     *
     *  @since 1.0
     * @param bool $is_shortcode Used if form is being built from a shortcode.
     */
    function build( $is_shortcode ) {

        $form_base_atts = array();

        $form_base_atts['method']           = 'post';
        $form_base_atts['id']               = 'shiftr_form_' . $this->form_ID;
        $form_base_atts['class']            = 'shiftr-form shiftr-form--' . $this->form . ( $this->use_labels ? ' with-labels' : '' );
        $form_base_atts['data-shiftr-form'] = $this->form;

        foreach( $this->fields as $field ) {

            if ( $field['type'] == 'file' ) {
                $form_base_atts['enctype'] = 'multipart/form-data';
                break;
            }
        }

        if ( $is_shortcode ) {
            $form_base_atts['class'] .= ' from-shortcode';
        }

        $form_base_atts = apply_filters( 'shiftr_form_build_form_atts', $form_base_atts, $this->form );

        echo '<form ' . shiftr_output_attr( $form_base_atts ) . '>';

        // Required form fields        
        $hidden_fields = apply_filters( 'shiftr_form_build_hidden_fields', array(), $this->form );

        // Verify hidden fields var is array before continuing
        $hidden_fields = ( ! is_array( $hidden_fields ) ) ? [] : $hidden_fields;

        // Default hidden fields
        $hidden_fields[] = '<input type="hidden" name="action" value="shiftr_form_handler">';
        $hidden_fields[] = '<input type="hidden" name="shiftr_form_id" value="' . esc_attr( $this->form_ID ) . '">';

        echo '<div style="display:none;">';

        foreach ( $hidden_fields as $field ) {
            echo $field;
        }

        echo '</div>';


        // Check if form HTML override exists
        $form_override = SHIFTR_PARTS . '/forms/' . $this->form . '.php';

        if ( file_exists( $form_override ) ) {

            if ( empty( $this->fields ) ) {
                trigger_error( 'Fields must be defined!!!', E_USER_WARNING );

            } else {

                include( $form_override );
            }

        } else {

            $submit = array(
                array(
                    'type'      => 'submit',
                    'name'      => 'send',
                    'value'     => 'send'
                )
            );

            $fields = array_merge( (array) $this->fields, $submit );

            $fields = apply_filters( 'shiftr_form_build_fields', $fields, $this->form );

            foreach( $fields as $field ) {

                $this->create_field( $field );
            }
        }

        echo '</form>';
    }


    /**  
     *  Create an input element to include within the shiftr_register_form call
     *
     *  @since 1.0
     *
     *  @param $field array The settings of the field
     */
    function create_field( $settings = [] ) {

        $defaults = array(
            'type'              => '',
            'name'              => '',
            'required'          => true,
            'label'             => '',
            'include_in_send'   => true,
            'rows'              => 4
        );

        $args = (object) wp_parse_args( $settings, $defaults );


        // Hold the attributes
        $wrap_atts = array();
        $field_atts = array();
        $label_atts = array();

        $field_tag = 'input';

        $input_tag_types = array( 'text', 'name', 'email', 'date', 'password', 'search', 'checkbox', 'radio' );
        $input_grouped_types = array( 'text', 'name', 'email', 'tel', 'date', 'password', 'search' );

        // Wrap attributes
        $wrap_atts['class'] = 'field';

        if ( in_array( $args->type, $input_grouped_types ) ) {
            $wrap_atts['class'] .= ' field-type--input';
            $field_atts['class'] = 'form-input';

        } else {
            $wrap_atts['class'] .= ' field-type--' . $args->type ;

            if ( in_array( $args->type, $input_grouped_types ) ) {
                $field_tag = $args->type;

            } else if ( $args->type == 'select' ) {
                $field_tag = 'select';

            } else if ( $args->type == 'textarea' ) {
                $field_tag = 'textarea';
            }
        }

        // Add field name class
        $wrap_atts['class'] .= ' field-' . $args->name;

        if ( $args->label == '' ) {
            $args->label = shiftr_to_nicename( $args->name );
        }
        

        // The input identifier, used to connect the label and input via for/id attributes
        $the_id = 'shiftr_form_' . $this->form_ID . '_' . $args->name;


        // Label attributes
        $label_atts['for'] = $the_id;


        // Input attributes
        if ( $args->type != 'textarea' && $args->type != 'select' ) {
            $field_atts['type'] = $args->type;
        }
        $field_atts['name'] = '_' . $this->form_ID . '_' . $args->name;
        $field_atts['id'] = $the_id;

        // Ensure required attribute is added with no value
        if ( $args->required && $args->type != 'submit' ) {
            $field_atts['required'] = '';
        }

        $wrap_atts = apply_filters( 'shiftr_form_build_field_wrap_atts', $wrap_atts, $this->form );

        // After the field wrap closes
        do_action( "shiftr_form_{$this->form}_field_{$args->name}_before" );


        // Field container open
        echo '<div ' . shiftr_output_attr( $wrap_atts ) . '>';

        // Label
        if( $this->use_labels || $args->type == 'radio' ) {

            $confirm_labels = apply_filters( 'shiftr_form_build_field_confirm_labels', true, $this->form, $args->type );

            if ( $args->type != 'checkbox' && $args->type != 'submit' && $confirm_labels ) {
                echo '<label ' . shiftr_output_attr( $label_atts ) . '>';

                echo $args->label;

                if ( $args->required ) {
                    echo '<span class="required">*</span>';
                }

                echo '</label>';
            }

        } else {

            if ( $args->type != 'submit' ) {

                if ( $args->type != 'checkbox' && $args->type != 'radio' ) {
                    $field_atts['aria-label'] = $args->label;
                }
                
                if ( $args->type != 'checkbox' && $args->type != 'radio' && $args->type != 'select' ) {
    
                    $field_atts['placeholder'] = $args->label;
    
                    if ( $args->required ) {
                        $field_atts['placeholder'] .= '*';
                    }
                }
            }
        }

        // Add rows attribute if field is textarea
        if ( $args->type == 'textarea' ) {
            $field_atts['rows'] = $args->rows;
            $field_atts['class'] = 'form-textarea';
        }

        if ( $args->type == 'select' ) {
            $field_atts['class'] = 'form-select';
        }

        if ( $args->type == 'file' ) {
            
            if ( isset( $args->file_types ) ) {
                $field_atts['accept'] = shiftr_form_get_file_types( (array) $args, 'attr' );
            }

            if ( isset( $args->allow_multiple ) && $args->allow_multiple ) {
                $field_atts['multiple'] = '';
            }
        }

        // Add valueto submit button
        if ( $args->type == 'submit' ) {
            $field_atts['type'] = 'submit';
            $field_atts['value'] = $args->value;
            $field_atts['class'] = 'button-fill';
        }

        if ( $args->type == 'radio' ) {

            foreach ( $args->radio_fields as $subfield ) {

                if ( ! isset( $subfield['label'] ) ) {
                    $subfield['label'] = shiftr_to_nicename( $subfield['name'] );
                }
                echo '<div class="' . esc_attr( 'sub-field--radio radio-' . $args->name . '-' . $subfield['name'] ) . '">';

                $subfield_atts = array(
                    'type' => 'radio',
                    'name' => $field_atts['name'],
                    'id' => $field_atts['id'] . '_' . $subfield['name']
                );

                echo '<input ' . shiftr_output_attr( $subfield_atts, true ) . '>';

                echo '<label for="' . esc_attr( $subfield_atts['id'] ) . '">';

                $label_innerHTML = '<span class="' . esc_attr( 'custom-' . $args->type ) . '"></span>' . $subfield['label'];

                echo apply_filters( 'shiftr_form_build_field_radio_label', $label_innerHTML, $this->form, $args->name, $subfield['name'] );

                echo '</label>';
                echo '</div>';
            }

        } elseif ( $args->type == 'submit' ) {

            echo '<button ' . shiftr_output_attr( $field_atts, true ) . '>' . $args->label . '</button>';

            echo '<div class="form-submit-output"></div>';

        } else {

            echo '<' . $field_tag . ' ' . shiftr_output_attr( $field_atts, true ) . '>';
        }


        // Output select contents
        if ( $args->type == 'select' ) {

            if ( isset( $args->options ) ) {

                if ( ! $this->use_labels ) {
                    echo '<option disabled selected>' . esc_html( $args->label . ( $args->required ? '*' : '' ) ) .'</option>';
                }

                foreach ( $args->options as $value => $label ) {
                    echo '<option value="' . esc_attr( $value ) . '">' . esc_html( $label ) .'</option>';
                }
            }

            echo '</select>';
        }

        // Output closing textarea tag
        if ( $args->type == 'textarea' ) {
            echo '</textarea>';
        }   

        // Output label for checkbox and radio
        if ( $args->type == 'checkbox' ) {

            echo '<label ' . shiftr_output_attr( $label_atts ) . '>';

            $label_innerHTML = '<span class="' . esc_attr( 'custom-' . $args->type ) . '"></span>' . $args->label;

            echo apply_filters( 'shiftr_form_build_field_checkbox_label', $label_innerHTML, $this->form, $args->name );

            echo '</label>';
        }

        // Field container close
        echo '</div>';

        // After the field wrap closes
        do_action( "shiftr_form_{$this->form}_field_{$args->name}_after" );
    }
}
