<?php
/**
 * Block: Columns
 * 
 * Display a series of columns along a grid.
 */
$columns = get_flexi_field( 'columns' );

?>
<div class="container">
    <?php shiftr_block_heading(); ?>
    <?php if ( $columns ) : ?>
        <div class="columns columns-<?php echo count( $columns ); ?>">
            <?php foreach ( $columns as $column ) : ?>
                <div class="column">
                    <?php
                    if ( $column['image'] ) {
                        printf( '<div class="image">%s</div>', get_shiftr_image( $column['image'], 'medium' ) );
                    }

                    echo $column['content'];
                    ?>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
    <?php shiftr_block_after(); ?>
</div>
