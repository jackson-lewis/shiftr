<?php
/**
 * Block: Content
 * 
 * The most basic block available, uses a standard wysiwyg editor with media enabled.
 */
$settings = shiftr_get_block_settings();
/**
 * Define the data array structure
 */
$data = array(
    'content' => ''
);

if ( $settings['use_global'] ) {
    /**
     * Get global instance data is available
     */
    $global_field_data = shiftr_get_global_block_data( 'content' );

    if ( $global_field_data ) {
        $data = $global_field_data;
    }

} else {
    /**
     * Get instance data
     */
    $data = array(
        'content' => get_sub_field( 'content' )
    );
}

if ( ! $data['content'] ) {
    return;
}
?>
<div class="container">
    <div class="content"><?php echo $data['content']; ?></div>
</div>