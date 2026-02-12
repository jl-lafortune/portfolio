<?php 
    include 'header.php';
?>

		<main id="design">
			<section class="mt-3 mx-5 pt-3 photos">
				<div class="container">
					<h2 class="text-center mb-4 text-uppercase">Design</h2>
					<div class="row flex-lg-nowrap flex-md-wrap align-items-center justify-content-center">
						<!-- Image 1 -->
						<article class="col-lg-4 col-12 img-container mr-4 mb-5">
							<a href="#lightbox1">
								<img
									class="img-fluid"
									src="src/media/img/gradient-sunset.png"
									alt="gradient-sunset" />
								<span class="overlay">Gradient Sunset</span>
							</a>
						</article>
						<!-- Image 2 -->
						<article class="col-lg-4 col-12 img-container mx-4 mb-5">
							<a href="#lightbox2">
								<img class="img-fluid" src="src/media/img/swoosh.png" alt="swoosh" />
								<span class="overlay">Swoosh</span>
							</a>
						</article>
						<!-- Image 3 -->
						<article class="col-lg-4 col-12 img-container ml-4">
							<a href="#lightbox3">
								<img class="img-fluid" src="src/media/img/tikita.png" alt="tikita" />
								<span class="overlay">Tikita</span>
							</a>
						</article>
					</div>
				</div>
			</section>

			<!-- Lightbox 1 -->
			<div id="lightbox1" class="lightbox">
				<div class="lightbox-content">
					<a href="#" class="close">&times;</a>
					<img
						src="src/media/img/gradient-sunset.png"
						alt="gradient-sunset"
						class="lightbox-image" />
					<div class="lightbox-info">
						<h2>Gradient Sunset</h2>
						<p></p>
						<small>Date : 03/05/2022</small>
					</div>
				</div>
			</div>

			<!-- Lightbox 2 -->
			<div id="lightbox2" class="lightbox">
				<div class="lightbox-content">
					<a href="#" class="close">&times;</a>
					<img src="src/media/img/swoosh.png" alt="swoosh" class="lightbox-image" />
					<div class="lightbox-info">
						<h2>Swoosh</h2>
						<p>
							Affiche réalisé lors d'un challenge où il fallait mettre en avant des chaussures
						</p>
						<small>Date : 09/05/2024</small>
					</div>
				</div>
			</div>

			<!-- Lightbox 3 -->
			<div id="lightbox3" class="lightbox">
				<div class="lightbox-content">
					<a href="#" class="close">&times;</a>
					<img src="src/media/img/tikita.png" alt="tikita" class="lightbox-image" />
					<div class="lightbox-info">
						<h2>Tikita</h2>
						<p>
							Logo represente un bar/karaoké. Il a été réalisé lors du cours de création
							Digitale.
						</p>
						<small>Date : 19/04/2024</small>
					</div>
				</div>
			</div>

			<div class="row d-flex align-items-center justify-content-center">
				<a
					href="https://drive.google.com/drive/folders/1CZw9UfAhzo43ocOlmuR_4DrAlIXuDdGa?usp=sharing"
					target="_blank" rel="noopener noreferrer"
					class="btn btn-custom mb-5 py-3">
					Voir plus
				</a>
			</div>
		</main>

<?php
    include 'footer.php';
?>