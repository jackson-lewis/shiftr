<?php

/**
 * Set up security headers.
 * 
 * @param array $headers
 */
function shiftr_security_headers( $headers ) {
    if ( 'development' == wp_get_environment_type() ) {
        return;
    }

    header_remove( "X-Powered-By" );

    $headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
    $headers['X-Frame-Options'] = 'SAMEORIGIN';
    $headers['Content-Security-Policy'] = 'upgrade-insecure-requests';
    $headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    $headers['Permissions-Policy'] = 'geolocation=(self), microphone=(), camera=()';
    $headers['X-Content-Type-Options'] = 'nosniff';

    return $headers;
}
add_filter( 'wp_headers', 'shiftr_security_headers' );
