<?php
/**
 * Block: Tabs
 * 
 * Display a tabs component.
 * 
 * @var array $settings The Block settings.
 */
$items = get_flexi_field( 'items' );

?>
<div class="container">
    <?php shiftr_block_heading(); ?>
    <?php if ( $items ) : ?>
        <div class="shiftr-tabs" data-shiftr-tabs>
            <div class="shiftr-tabs__list">
                <?php foreach ( $items as $item ) : ?>
                    <button class="shiftr-tabs__tab">
                    <?php echo $item['title']; ?>
                    </button>
                <?php endforeach; ?>
            </div>
            <div class="shiftr-tabs__panels">
                <?php foreach ( $items as $item ) : ?>
                    <div class="shiftr-tabs__panel">
                    <?php echo $item['content']; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endif; ?>
    <?php shiftr_block_after(); ?>
</div>
