<?php 
	
	/*  Displaying the Posts Page

    */

	get_header();

	global $wp_query;

?>


	<div class="hero-standard">
		<div class="background">
			<?php shiftr_featured_image(); ?>
		</div>
		<div class="content">
			<div>

				<?php

				if ( get_search_query() != '' ) { ?>
					
					<span class="searched">You searched for...</span>
					<h1><?= get_search_query(); ?></h1>

					<?php

					$result = ' result';
					$is_were = ' was';

					if ( $wp_query->found_posts > 1 ) {
						$result .= 's';
						$is_were = ' were';
					}

					?>
					<p><?= $wp_query->found_posts . $result . $is_were . ' found'; ?></p>

				<?php } else { ?>

					<h1>Posts page</h1>
					<p>Display the archive of posts</p>

				<?php } ?>

			</div>
		</div>
	</div>


	<main>

		<section class="contain blog-layout">
			<div>
				
				<div class="blog-list">

					<?php

					if ( have_posts() ) :
						while( have_posts() ) :
							the_post();

					?>

					<div class="single">

						<div class="image">
							<?php shiftr_featured_image(); ?>
						</div>

						<div class="details">
							<h3><?php the_title(); ?></h3>
							<span class="date"><?php the_time( 'd/m/y' ); ?></span>
							<p><?php the_excerpt(); ?></p>
							<a href="<?php the_permalink(); ?>" class="button">read more</a>
						</div>

						
					</div>

					<?php endwhile; ?>

					<?php else : ?>

					<p>Oops! It looks like nothing could be found...</p>

					<?php endif; ?>
					
				</div>

				<div class="blog-sidebar">
					<?php dynamic_sidebar( 'the_blog_sidebar' ); ?>
				</div>

			</div>
		</section>

	</main>
    

<?php get_footer(); ?>
