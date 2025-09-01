import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'

const initializeEmbla = () => {
	const viewport = document.querySelector('.embla__viewport') as HTMLElement | null
	if (!viewport) return
	EmblaCarousel(
		viewport,
		{ loop: true, align: 'start', slidesToScroll: 1, containScroll: 'trimSnaps' },
		[
			Autoplay({ delay: 800, stopOnInteraction: false, stopOnMouseEnter: true })
		]
	)
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeEmbla)
} else {
	initializeEmbla()
}