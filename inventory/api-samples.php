<?php
/**
 * Inventory / API Sample
 * 
 * This file contains examples of working with some popular API's.
 * The examples may or may not be written to be completely ready
 * for integration, as the idea here is to provide the core functionality
 * for handling the request.
 */
?>


<?php
/**
 * Connect to the Instagram API and retrieve recent
 * post data.
 * 
 * @todo Cache the API response, refresh every 6 or 12 hours?
 * 
 * @return array|bool The recent post data, or false if no posts found.
 */
function get_instagram_recent_posts() {
    $token = get_field( 'instagram__api_access_token', 'option' );

    if ( ! $token ) {
        return false;
    }

    $post_count = 6;

    $remote_wp = wp_remote_get( "https://api.instagram.com/v1/users/self/media/recent/?count=${post_count}&access_token=${token}" );

    $instagram_response = json_decode( $remote_wp['body'] );

    if ( isset( $instagram_response->data ) && is_array( $instagram_response->data ) ) {
        return $instagram_response->data;
    } else {
        return false;
    }
}
?>


<?php
/**
 * Add a new subscriber to a Mailchimp Audience via a Shiftr Form
 * 
 * @param object $form The Shiftr Form instance
 * @param integer $data_id The post ID of the captured data 
 */
function mailchimp_integration( $form, $data_ID ) {

    /**
     * May need to target a specific form
     */
    if ( $form != 'signup' ) return;
  
    $form_data = get_post_meta( $data_ID, '_shiftr_form_data_content', true );
    $form_data = unserialize( base64_decode( $form_data ) );
    
    /**
     * Store Mailchimp data in ACF group
     */
    $acf_mailchimp = get_field( 'mailchimp', 'option' );
  
    $api_key = $acf_mailchimp['api_key'];
    $list_id = $acf_mailchimp['list_id'];
    
    /**
     * This value can vary by Mailchimp account.
     */
    $mailchimp_host = '4';
  
    $url = "https://us{$mailchimp_host}.api.mailchimp.com/3.0/lists/{$list_id}/members";
  
    $args = array(
        'method' => 'POST',
        'headers' => array(
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode( "site:{$api_key}" )
        ),
        'timeout' => 20,
        'sslverify' => true,
        'body' => json_encode(
            array(
                'email_address' => $form_data['email'],
                'status' => 'subscribed',
                'merge_fields' => array(
                    'FNAME' => $form_data['name']
                )
            )
        )
    );
  
    $response = wp_remote_request( $url, $args );
  
    $response_body = json_decode( $response['body'] );
  
  
    $return = false;
    
    if ( $response_body->title == 'Member Exists' ) {
        $return = 'already_subscribed';
    }
  
    if ( $response['response']['code'] == 200 && $response['response']['message'] == 'OK' ) {
        $return = '1';
    }
  
    // Optional depending on desired functionality
    wp_die( $return );
}

add_action( 'shiftr_form_handler_capture_after', 'mailchimp_integration', 10, 2 );
?>
