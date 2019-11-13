<?php 
	
	/*  Display the default page template

    */

	get_header();

?>


	<div class="hero-standard">
		<div class="container contain-line-width">
			<header class="hero--content">
				<h1><?php the_title(); ?></h1>
				<p><?php the_time( 'd F Y' ); ?></p>
			</header>

			<div class="hero--featured-image">
				<?php shiftr_featured_image(); ?>
			</div>
		</div>
	</div>


	<main class="site-main">

		<section class="site-section">
			<div class="container contain-line-width">

				<article>
					
					<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
		
				    	
				    	<?php the_content(); ?>


				    <?php endwhile; endif; ?>

				</article>

			</div>
		</section>

	</main>
    

<?php get_footer(); ?>
