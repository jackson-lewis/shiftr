<?php
/**  
 *  Output the HTML of an admin notice, the filename prefix 'notice-' and file extension
 *  should be excluded on function call
 *
 *  @since 1.0
 *
 *  @param $file str The suffix of the file name
 *  @return mixed|bool The HTML output on success, or false if file not found
 */
function shiftr_get_admin_notice_html( $file = '' ) {

    // Build full path and filename
    $file_path = SHIFTR_INC . '/admin/html/notice-' . $file . '.php';

    // Check file exists and include
    if ( file_exists( $file_path ) ) {

        include( $file_path );
    } else {
        
        return false;
    }
}


/**  
 *  Output HTML from any file within the /inc/html directory
 *
 *  @since 1.0
 *
 *  @param $file str The file name to include
 *  @return mixed|bool The HTML output on success, or false if file not found
 */
function shiftr_get_html( $file = '' ) {

    // Build full path and filename
    $file_path = SHIFTR_INC . '/admin/html/' . $file . '.php';

    // Check file exists and include
    if ( file_exists( $file_path ) ) {

        include_once $file_path;
    } else {
        
        return false;
    }
}
