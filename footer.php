		<footer>
			<div>

				<?php

					global $shiftr;

				?>
				
				<div class="footer-info">
					<small class="creator">Built with passion by <a href="https://jacksonlewis.co.uk" target="_blank" rel="noopener">jacksonlewis.co.uk</a></small>
					<small><a href="<?php $shiftr->the( 'shiftr_url' ); ?>" <?php shiftr_ext_link_attr(); ?>>Shape Shiftr</a> v<?php $shiftr->the( 'version' ); ?></small>
				</div>
				
			</div>
		</footer>

		<?php wp_footer(); ?>
        
	</body>
    
</html>