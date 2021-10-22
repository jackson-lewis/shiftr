<?php
/**
 * Block: Content
 * 
 * The most basic block available, uses a standard wysiwyg editor with media enabled.
 */
?>
<div class="container">
    <div class="content" rianimate="fade-in">
        <?php the_flexi_field( 'content' ); ?>
    </div>
</div>
