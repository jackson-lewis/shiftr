<?php


/**  
 *  shiftr_goodbye_emoji
 *
 *  Remove all uses of emoji as they most likely won't be needed
 *
 *  @since 1.0
 */

function shiftr_goodbye_emoji() {

    remove_action( 'admin_print_styles', 'print_emoji_styles' );
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
    remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
    remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
}

add_action( 'init', 'shiftr_goodbye_emoji' );

