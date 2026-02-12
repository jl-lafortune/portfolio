<!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<title>Portfolio BluNay</title>
		<link rel="icon" type="image/x-icon" href="src/media/img/b_icon.ico" />
		<!-- Lien vers Bootstrap -->
		<link
			href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
			rel="stylesheet" />
		<!-- Lien vers les icônes Bootstrap -->
		<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
		<!-- <link rel="stylesheet" href="src/css/style.css" /> -->
		<link rel="stylesheet" href="src/css/style.css" />
	</head>
	<body>
		<header>
			<nav class="navbar navbar-expand-lg mx-4">
				<div class="container">
					<!-- Logo -->
					<a class="navbar-brand mx-3" href="index.html">
						<img src="src/media/img/B_white.svg" alt="Logo BluNay" class="logo" />
					</a>

					<!-- Bouton hamburger -->
					<button
						class="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<!-- Contenu de la navbar -->
					<div class="collapse navbar-collapse justify-content-between" id="navbarNav">
						<!-- Menus centrés -->
						<ul class="navbar-nav mx-auto align-items-center">
							<li class="nav-item">
								<a class="nav-link" href="a-propos.html">À Propos</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="design.html">Design</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="photos.html">Photos</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="contact.html">Contact</a>
							</li>
						</ul>
						<!-- Icônes des réseaux sociaux -->
						<div class="d-flex justify-content-center social-icon">
							<a href="https://www.instagram.com/_blunay/" class="text-white" target="_blank">
								<i class="bi bi-instagram"></i>
							</a>
							<a
								href="https://www.linkedin.com/in/jean-luc-lafortune/"
								class="text-white"
								target="_blank">
								<i class="bi bi-linkedin"></i>
							</a>
							<a href="https://github.com/BluNay" class="text-white" target="_blank">
								<i class="bi bi-github"></i>
							</a>
						</div>
					</div>
				</div>
			</nav>
		</header>