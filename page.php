 <?php 
	
	/*  Display the default page template

    */

	get_header();

?>


	<div class="hero--standard">
		<div class="background">
			<?php shiftr_featured_image(); ?>
		</div>
		<div class="content">
			<div>
				
				<h1><?php the_title(); ?></h1>

			</div>
		</div>
	</div>


	<main class="site-main">

		<section class="contain">
			<div>
				<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
		
			    	<?php the_content(); ?>

			    <?php endwhile; endif; ?>
			</div>
		</section>

	</main>
    

<?php get_footer(); ?>

