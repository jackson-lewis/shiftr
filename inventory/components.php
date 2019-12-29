<?php

// This file should not be executed,
// it is simply to find pre-built components

	exit;
?>


<?php
	// --|    Accordion / ACF Repeater
	
	// 'accordion' as repeater
	// 'tab' as wysiwyg
	// 'panel' as wysiwyg
?>

<?php if ( have_rows( 'accordion' ) ) : ?>
<div class="shiftr-accordion" data-shiftr-accordion>
	
    <?php while ( have_rows( 'accordion' ) ) : the_row(); ?>
					
	<div class="accordion--item">
		<div class="accordion--tab">
			<?php the_sub_field( 'tab' ); ?>
		</div>
		<div class="accordion--panel">
			<?php the_sub_field( 'content' ); ?>
		</div>
	</div>

	<?php endwhile; ?>

</div>
<?php endif; ?>

