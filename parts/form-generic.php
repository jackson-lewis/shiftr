<?php

if ( ! defined( 'ABSPATH' ) && ! isset( $within_registration ) ) exit;

?>


<input type="hidden" name="action" value="shiftr_form_handler">
<input type="hidden" name="shiftr_form_id" value="<?php shiftr_form_id( $form->ID ); ?>">

<div class="input">
	<label for="shiftr_form_<?php shiftr_form_id( $form->ID ); ?>_name">name*</label>
	<input type="text" name="_<?php shiftr_form_id( $form->ID ); ?>_name" id="shiftr_form_<?php shiftr_form_id( $form->ID ); ?>_name" required>
</div>

<div class="input">
	<label for="shiftr_form_<?php shiftr_form_id( $form->ID ); ?>_email">email*</label>
	<input type="email" name="_<?php shiftr_form_id( $form->ID ); ?>_email" id="shiftr_form_<?php shiftr_form_id( $form->ID ); ?>_email" required>
</div>

<div class="textarea">
	<label for="shiftr_form_<?php shiftr_form_id( $form->ID ); ?>_message">message*</label>
	<textarea name="_<?php shiftr_form_id( $form->ID ); ?>_message" id="shiftr_form_<?php shiftr_form_id( $form->ID ); ?>_message" required></textarea>
</div>

<div class="checkbox">
	<input type="checkbox" name="_<?php shiftr_form_id( $form->ID ); ?>_confirm" id="shiftr_form_<?php shiftr_form_id( $form->ID ); ?>_confirm" required>
	<label for="shiftr_form_<?php shiftr_form_id( $form->ID ); ?>_confirm">Tick if you’d like to receive exclusive offers</label>
</div>

<div class="submit">
	<input type="submit" name="submit" value="send">
</div>

