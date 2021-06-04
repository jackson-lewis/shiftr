<?php
/**
 * Block: Content & Image
 * 
 * A popular block, where an image can be displayed alongside content.
 */
$settings = shiftr_get_block_settings();
/**
 * Define the data array structure
 */
$data = array(
    'content' => '',
    'image' => 0
);

if ( $settings['use_global'] ) {
    /**
     * Get global data
     */
    $global_field_data = shiftr_get_global_block_data( 'content-image' );

    if ( $global_field_data ) {
        $data = $global_field_data;
    }

} else {
    /**
     * Get instance data
     */
    $data = array(
        'content' => get_sub_field( 'content' ),
        'image' => get_sub_field( 'image' )
    );
}

if ( ! $data['content'] ) {
    return;
}
?>
<div class="container">
    <div class="content"><?php echo $data['content']; ?></div>
    <div class="image"><?php shiftr_image( $data['image'] ); ?></div>
</div>