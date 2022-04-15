<?php
/**
 * Block: Accordion
 * 
 * Display an accordion component.
 * 
 * @var array $settings The Block settings.
 */
$items = get_flexi_field( 'items' );

?>
<div class="container">
    <?php shiftr_block_heading(); ?>
    <?php if ( $items ) : ?>
        <div class="shiftr-accordion" data-shiftr-accordion data-accordion-defaultOpen="<?php echo $settings['default_open'] == 1 ? '0' : 'false'; ?>" data-accordion-allowMultiOpen="<?php echo $settings['allow_multi_open']; ?>">
            <?php foreach ( $items as $item ) : ?>
                <div class="shiftr-accordion__item">
                    <div class="shiftr-accordion__tab">
                        <?php echo $item['title']; ?>
                    </div>
                    <div class="shiftr-accordion__panel">
                        <?php echo $item['content']; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
    <?php shiftr_block_after(); ?>
</div>
