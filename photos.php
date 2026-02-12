<?php 
    include 'header.php';
?>

		<main id="photos">
			<section class="mt-3 mx-5 pt-3 photos">
				<div class="container">
					<h2 class="text-center mb-4 text-uppercase">Photos</h2>
					<div class="row flex-lg-nowrap flex-md-wrap align-items-center justify-content-center">
						<!-- Image 1 -->
						<article class="col-lg-4 col-12 img-container mr-4 mb-5">
							<a href="#lightbox1">
								<img class="img-fluid" src="src/media/img/antoine.jpg" alt="Antoine" />
								<span class="overlay">Antoine</span>
							</a>
						</article>
						<!-- Image 2 -->
						<article class="col-lg-4 col-12 img-container mx-4 mb-5">
							<a href="#lightbox2">
								<img class="img-fluid" src="src/media/img/sunset.jpg" alt="Sunset" />
								<span class="overlay">Coucher de soleil</span>
							</a>
						</article>
						<!-- Image 3 -->
						<article class="col-lg-4 col-12 img-container ml-4">
							<a href="#lightbox3">
								<img class="img-fluid" src="src/media/img/shazli.jpg" alt="Shazli" />
								<span class="overlay">Shazli</span>
							</a>
						</article>
					</div>
				</div>
			</section>

			<!-- Lightbox 1 -->
			<div id="lightbox1" class="lightbox">
				<div class="lightbox-content">
					<a href="#" class="close">&times;</a>
					<img src="src/media/img/antoine.jpg" alt="Antoine" class="lightbox-image" />
					<div class="lightbox-info">
						<h2>Antoine</h2>
						<p>Portrait d'Antoine pris en lumière naturelle.</p>
						<small>Date : 01/12/2024</small>
					</div>
				</div>
			</div>

			<!-- Lightbox 2 -->
			<div id="lightbox2" class="lightbox">
				<div class="lightbox-content">
					<a href="#" class="close">&times;</a>
					<img src="src/media/img/sunset.jpg" alt="Sunset" class="lightbox-image" />
					<div class="lightbox-info">
						<h2>Coucher de soleil</h2>
						<p>Magnifique coucher de soleil sur l'océan.</p>
						<small>Date : 15/11/2024</small>
					</div>
				</div>
			</div>

			<!-- Lightbox 3 -->
			<div id="lightbox3" class="lightbox">
				<div class="lightbox-content">
					<a href="#" class="close">&times;</a>
					<img src="src/media/img/shazli.jpg" alt="Shazli" class="lightbox-image" />
					<div class="lightbox-info">
						<h2>Shazli</h2>
						<p>Portrait de Shazli dans un style urbain.</p>
						<small>Date : 21/10/2024</small>
					</div>
				</div>
			</div>

			<div class="row d-flex align-items-center justify-content-center">
				<a
					href="https://drive.google.com/drive/folders/1MnEIwDKYP8W73JMpLILNega6q6oYZOi2?usp=sharing"
					target="_blank" rel="noopener noreferrer"
					class="btn btn-custom mb-5 py-3">
					Voir plus
				</a>
			</div>
		</main>

<?php 
    include 'footer.php';
?>
