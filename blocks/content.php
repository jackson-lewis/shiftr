<?php
/**
 * Block: Content
 * 
 * The most basic block available, uses a standard wysiwyg editor with media enabled.
 * 
 * @var array $settings The block settings.
 */
?>
<div class="container">
    <div class="content">
        <?php the_flexi_field( 'content' ); ?>
    </div>
</div>
