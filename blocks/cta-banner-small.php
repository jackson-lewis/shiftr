<?php
/**
 * Block: CTA banner (small)
 * 
 * The 'small' variant of the CTA Banner blocks, the only variant of the 
 * CTA Banners to not include an image.
 */
$settings = shiftr_get_block_settings();
/**
 * Define the data array structure
 */
$data = array(
    'label' => '',
    'link' => '',
    'link-label' => ''
);

if ( empty( $settings ) || $settings['use_global'] ) {
    /**
     * Get global data
     */
    $global_field_data = shiftr_get_global_block_data( 'cta-banner-small' );

    if ( $global_field_data ) {
        $data = $global_field_data;
    }

} else {
    /**
     * Get instance data
     */
    $data = array(
        'label' => get_sub_field( 'label' ),
        'link' => get_sub_field( 'link' ),
        'link-label' => get_sub_field( 'link-label' )
    );
}

if ( ! $data['label'] ) {
    return;
}
?>
<div class="container">
    <p><?php echo $data['label']; ?></p>
    <a href="<?php echo $data['link']; ?>" class="button"><?php echo $data['link-label']; ?></a>
</div>