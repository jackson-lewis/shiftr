<?php 
	
	/*  Archive to Posts

    */

	get_header();

?>


	<main>


		<section class="contained">
			<div>

				<h1>Blog</h1>

				<div class="blog-list">

					<?php

					if ( have_posts() ) :
						while( have_posts() ) :
							the_post();

					?>

					<div>
						<div class="image">
							<img src="" alt="">
						</div>

						<h3><?php the_title(); ?></h3>
						<span class="date"><?php the_time( 'd/m/y' ); ?></span>
						<p><?php the_excerpt(); ?></p>
						<a href="<?php the_permalink(); ?>" class="button">read more</a>
					</div>

					<?php endwhile; ?>

					<?php else : ?>

					<p>Oops! It looks like there aren't any posts right now, sorry about that...</p>

					<?php endif; ?>
					
				</div>

				<div class="blog-sidebar">
					<?php get_sidebar(); ?>
				</div>
				
			</div>
		</section>


	</main>
    

<?php get_footer(); ?>
