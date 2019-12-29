<?php 
	
	/*  Displaying the Posts Page

    */

	get_header();

	global $wp_query;

?>


	<div class="hero--standard">
		<div class="hero-featured-image">
			<?php shiftr_featured_image(); ?>
		</div>
		<div class="hero-content site-padding">
			<div class="container">

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
					<p><?= esc_html( $wp_query->found_posts . $result . $is_were . ' found' ); ?></p>

				<?php } else { ?>

					<h1>Posts</h1>
					<p>Display the archive of posts</p>

				<?php } ?>

			</div>
		</div>
	</div>


	<main class="site-main">

		<section class="site-section blog-layout">
			<div class="container">
				
				<div class="blog-loop">

					<?php

					if ( have_posts() ) :
						while( have_posts() ) :
							the_post();

					?>

					<div class="blog-loop--item">

						<div class="image">
							<?php shiftr_featured_image(); ?>
						</div>

						<div class="details">
							<h3><?php the_title(); ?></h3>
							<span class="date"><?php the_time( 'd/m/y' ); ?></span>
							<p><?php the_excerpt(); ?></p>
							<a href="<?php the_permalink(); ?>" class="button-fill">read more</a>
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
