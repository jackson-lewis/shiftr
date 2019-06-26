<?php 
	
	/*  Display the default page template

    */

	get_header();

?>


	<div class="hero-standard">
		<div class="background">
			<?php shiftr_featured_image(); ?>
		</div>
		<div class="content">
			<div>
				
				<h1><?php the_title(); ?></h1>
				<p>The default page template</p>

			</div>
		</div>
	</div>


	<main>

		<section class="contain">
			<div>
				<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
		
				    	
			    	<?php the_content(); ?>


			    <?php endwhile; endif; ?>


			    <?php shiftr_do_acf_image(); ?>

			    <?php

			    $group = get_field( 'group' );

			    //shiftr_do_acf_image( $group['image'] );


			    ?>
			</div>
		</section>

	</main>
    

<?php get_footer(); ?>

