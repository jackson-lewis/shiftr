<?php
/**
 * Block: CTA banner (small)
 * 
 * The 'small' variant of the CTA Banner blocks, the only variant of the 
 * CTA Banners to not include an image.
 */
?>
<div class="container">
    <p><?php the_flexi_field( 'label' ); ?></p>
    <a href="<?php the_flexi_field( 'link' ); ?>" class="button"><?php the_flexi_field( 'link-label' ); ?></a>
</div>
