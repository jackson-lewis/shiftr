<?php
/**
 * Block: Content & Image
 * 
 * A popular block, where an image can be displayed alongside content.
 */
?>
<div class="container">
    <div class="content">
        <?php the_flexi_field( 'content' ); ?>
    </div>
    <div class="image">
        <?php shiftr_image( get_flexi_field( 'image' ) ); ?>
    </div>
</div>
