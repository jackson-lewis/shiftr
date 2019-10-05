<?php 
	
	/*  Display the default page template

    */

	get_header();

?>


	<div class="hero-standard">
		<div class="background">
			<?php shiftr_featured_image(); ?>
		</div>
		<header class="content">
			<div>
				
				<h1><?php the_title(); ?></h1>
				<p><?php the_time( 'd F Y' ); ?></p>

			</div>
		</header>
	</div>


	<main clsas="site-main">

		<section class="contain">
			<div>

				<article>
					
					<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
		
				    	
				    	<?php the_content(); ?>


				    <?php endwhile; endif; ?>

				</article>

			</div>
		</section>

	</main>
    

<?php get_footer(); ?>
