<?php 

    /*  ////  --|    Register Shiftr Forms

    */


    // Sample of using shiftr_register_form()
    shiftr_register_form(
     'general',
     array(
         'settings' => array(
             'nicename'  => 'General',
             'labels' => false
         ),
         'fields' => array(
             array(
                 'type'      => 'text',
                 'name'      => 'name'
             ),
             array(
                 'type'      => 'email',
                 'name'      => 'email'
             ),
             array(
                 'type'      => 'file',
                 'name'      => 'cv',
                 'required'  => false,
                 'file_types' => 'pdf,docx'
             ),
             array(
                 'type'      => 'textarea',
                 'name'      => 'message',
                 'rows'      => 6
             ),
             array(
                 'type'      => 'checkbox',
                 'name'      => 'accept',
                 'label'     => 'I agree to the Terms & Conditions.',
                 'include_in_send' => false
             )
         )
     )
    );


    // Sample of creating a function to call a forms HTML to be output
    function shiftr_form_general() {

     shiftr_build_form( 'general' );
    }

