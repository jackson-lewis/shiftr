<?php

// This file should not be executed,
// it is simply to find pre-built components

	exit;
?>

<?php

	// FORM

?>


<form method="post" id="shiftr_the_form" class="shiftr_form">
	<input type="hidden" name="type" value="generic">
				
	<div class="input">
		<label for="ss_name">name*</label>
		<input type="name" name="ss_name" id="ss_name" required>
	</div>

	<div class="input">
		<label for="ss_email">email*</label>
		<input type="email" name="ss_email" id="ss_email" required>
	</div>

	<div class="textarea">
		<label for="ss_message">message*</label>
		<textarea name="ss_message" id="ss_message" required></textarea>
	</div>

	<div class="checkbox">
		<input type="checkbox" name="ss_confirm" id="ss_confirm" required>
		<label for="ss_confirm">Tick if you’d like to receive exclusive offers</label>
	</div>

	<input type="submit" name="submit" value="send">

</form>




<?php

	// LISTED GRID

?>


<ul class="listed">
	<?php

	for ( $i = 0; $i < 12; $i++ ) { ?>

		<li>
			<h4>Item</h4>
			<img src="assets/images/yellow_car.jpg">
		</li>
		
	<?php } ?>
</ul>