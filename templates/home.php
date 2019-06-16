<?php 

	/*  Template Name: Home

    */

	get_header();

?>


	<div class="hero-carousel" data-shiftr-carousel>
		<div class="stage">

			<?php

			$props = get_field( 'hero_carousel' );

			foreach ( $props as $prop ) {

			?>

			<div class="prop">
				<img src="<?php echo $prop['url']; ?>" alt="<?php echo $prop['alt']; ?>">
			</div>

			<?php } ?>

		</div>
		<div class="overlay"></div>
		<div class="content">
			<div>
				
				<h1>Shifting just got a new meaning</h1>
				<p>Shifting just got a new meaning</p>

			</div>
		</div>
	</div>


	<main>

		<section class="contain">
			<div>

				<?php shiftr_form_generic(); ?>

			</div>
		</section>


		<section class="free">
			


		</section>

	</main>
    

<?php get_footer(); ?>
