 <?php 
	
	/*  Display the default page template

    */

	get_header();

?>


	<div class="hero--standard">
		<div class="container contain-line-width">
			<div class="hero-featured-image">
				<?php shiftr_featured_image(); ?>
			</div>

			<div class="hero-content">
				<h1><?php the_title(); ?></h1>
			</div>
		</div>
	</div>


	<main class="site-main">

		<section class="site-section">
			<div class="container contain-line-width">
				<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
		
			    	<?php the_content(); ?>

			    <?php endwhile; endif; ?>
			</div>
		</section>

	</main>
    

<?php get_footer(); ?>

