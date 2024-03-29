<?php

/**
 * Display the social links set via Yoast SEO.
 * 
 * @param array $socials Get only specified socials.
 * @param string $format Possible values: icon, array
 */
function shiftr_social_media_links( array $socials = [], string $format = 'icon' ) {

    $allowed_socials = [
        'facebook'  => [
            'yoast_key' => 'facebook_site',
            'prepend'   => '',
            'svg'       => '<svg xmlns="http://www.w3.org/2000/svg" width="11.44" height="22.187" viewBox="0 0 11.44 22.187"><path d="M3.324,22.186V12.263H0V8.32H3.324V5.213C3.324,1.837,5.386,0,8.4,0A27.9,27.9,0,0,1,11.44.156V3.683H9.351c-1.638,0-1.954.78-1.954,1.92V8.32h3.7l-.507,3.943H7.4v9.923" /></svg>'
        ],
        'instagram' => [
            'yoast_key' => 'instagram_url',
            'prepend'   => '',
            'svg'       => '<svg xmlns="http://www.w3.org/2000/svg" width="16.471" height="16.468" viewBox="0 0 16.471 16.468"><path d="M8.163,35.837a4.222,4.222,0,1,0,4.222,4.222A4.215,4.215,0,0,0,8.163,35.837Zm0,6.967a2.745,2.745,0,1,1,2.745-2.745A2.75,2.75,0,0,1,8.163,42.8Zm5.38-7.14a.985.985,0,1,1-.985-.985A.983.983,0,0,1,13.542,35.664Zm2.8,1a4.873,4.873,0,0,0-1.33-3.45,4.906,4.906,0,0,0-3.45-1.33c-1.36-.077-5.435-.077-6.794,0a4.9,4.9,0,0,0-3.45,1.327,4.889,4.889,0,0,0-1.33,3.45c-.077,1.36-.077,5.435,0,6.794a4.874,4.874,0,0,0,1.33,3.45,4.912,4.912,0,0,0,3.45,1.33c1.36.077,5.435.077,6.794,0a4.874,4.874,0,0,0,3.45-1.33,4.906,4.906,0,0,0,1.33-3.45C16.416,42.095,16.416,38.023,16.339,36.664Zm-1.756,8.25a2.779,2.779,0,0,1-1.565,1.565c-1.084.43-3.656.331-4.854.331s-3.774.1-4.854-.331a2.779,2.779,0,0,1-1.565-1.565c-.43-1.084-.331-3.656-.331-4.854s-.1-3.774.331-4.854a2.779,2.779,0,0,1,1.565-1.565c1.084-.43,3.656-.331,4.854-.331s3.774-.1,4.854.331A2.779,2.779,0,0,1,14.582,35.2c.43,1.084.331,3.656.331,4.854S15.012,43.833,14.582,44.913Z" transform="translate(0.075 -31.825)" /></svg>'
        ],
        'twitter'   => [
            'yoast_key' => 'twitter_site',
            'prepend'   => 'https://twitter.com/',
            'svg'       => '<svg xmlns="http://www.w3.org/2000/svg" width="27.946" height="22.697" viewBox="0 0 27.946 22.697"><path d="M25.073,53.738c.018.248.018.5.018.745,0,7.572-5.763,16.3-16.3,16.3A16.185,16.185,0,0,1,0,68.208a11.847,11.847,0,0,0,1.383.071,11.47,11.47,0,0,0,7.111-2.447A5.738,5.738,0,0,1,3.139,61.86a7.223,7.223,0,0,0,1.082.089,6.057,6.057,0,0,0,1.507-.2,5.728,5.728,0,0,1-4.593-5.621v-.071a5.768,5.768,0,0,0,2.589.727,5.736,5.736,0,0,1-1.773-7.66A16.28,16.28,0,0,0,13.76,55.122a6.466,6.466,0,0,1-.142-1.312,5.733,5.733,0,0,1,9.912-3.919,11.276,11.276,0,0,0,3.635-1.383,5.712,5.712,0,0,1-2.518,3.156,11.482,11.482,0,0,0,3.3-.887,12.312,12.312,0,0,1-2.873,2.961Z" transform="translate(0 -48.082)" /></svg>'
        ],
        'youtube'   => [
            'yoast_key' => 'youtube_url',
            'prepend'   => '',
            'svg'       => ''
        ],
        'linkedin'  => [
            'yoast_key' => 'linkedin_url',
            'prepend'   => '',
            'svg'       => '<svg xmlns="http://www.w3.org/2000/svg" width="21.653" height="21.648" viewBox="0 0 21.653 21.648"><path d="M4.847,53.648H.358V39.2H4.847ZM2.6,37.224A2.612,2.612,0,1,1,5.2,34.6,2.621,2.621,0,0,1,2.6,37.224ZM21.648,53.648H17.169V46.612c0-1.677-.034-3.827-2.334-3.827-2.334,0-2.692,1.822-2.692,3.706v7.156H7.659V39.2h4.305v1.972h.063a4.717,4.717,0,0,1,4.247-2.334c4.542,0,5.378,2.991,5.378,6.876v7.939Z" transform="translate(0 -32)" /></svg>'
        ]
    ];

    $social_links = [];

    /**
     * Ckeck if using Yoast SEO.
     */
    $using_yoast = is_plugin_active( 'wordpress-seo/wp-seo.php' );

    if ( $using_yoast ) {
        $socials = get_option( 'wpseo_social' );
    } else {
        $socials = get_field( 'social_media', 'option' );
    }
    
    foreach ( $allowed_socials as $social => $options ) {
        $url = ! empty( $socials[ $social ] ) ? $socials[ $social ] : false;
        
        if ( $using_yoast ) {
            $url = ! empty( $socials[ $options['yoast_key'] ] ) ? $socials[ $options['yoast_key'] ] : false;
        }

        if ( $url ) {
            if ( ! empty( $options['prepend'] ) ) {
                $url = $options['prepend'] . $url;
            }

            $label = 'See us on ' . $social;

            if ( $format == 'array' ) {
                $social_links[ $social ] = $url;

            } else {
                $social_links[] = sprintf( '<a href="%s" class="social-link %s" aria-label="%s">%s</a>', $url, $social, $label, $options['svg'] );
            }
        }
    }

    if ( $format == 'array' ) {
        return $social_links;
    }

    printf( '<div class="social-media-links">%s</div>', implode( '', $social_links ) );
}
