function lerp(start, end, ratio) {
	return start * (1 - ratio) + ratio * end
}

// Set cursor target
cursor.setTarget([
	...document.querySelectorAll('.menuContainer .imagesContainer .image'),
	...document.querySelectorAll('.headerContainer a'),
])

// Get config.json
let config = null
window
	.fetch('../scripts/config.json')
	.then((_response) => _response.json())
	.then((_config) => {
		config = _config
		menu.setup()
	})

// Set resize event
let windowSize = { width: window.innerWidth, height: window.innerHeight }
let menuImageHeight = windowSize.width / 2 / 1.78
function getDomSizeOnResize() {
	// Window
	windowSize.width = window.innerWidth
	windowSize.height = window.innerHeight
	// Menu image height
	menuImageHeight = windowSize.width / 2 / 1.78
}
window.addEventListener('resize', () => {
	getDomSizeOnResize()
})

// Names menu
let menu = {
	$fillName: document.querySelector('.menuContainer .fillNameContainer span'),
	$strokeName: document.querySelector('.menuContainer .strokeNameContainer span'),

	actualName: Math.ceil(window.scrollY / (menuImageHeight + this.stepBlocSize) - 0.5),
	stepBlocSize: document.querySelector('.contentContainer .imagesContainer .stepBloc').getBoundingClientRect().height,

	setup() {
		// On scroll : choose the correct name from config and display it
		window.addEventListener('scroll', () => {
			let name = Math.ceil(window.scrollY / (menuImageHeight + this.stepBlocSize) - 0.5)
			if (name != this.actualName) {
				this.actualName = name
				this.$fillName.innerHTML = config[this.actualName].name.toUpperCase()
				this.$strokeName.innerHTML = config[this.actualName].name.toUpperCase()
			}
		})
	},
}
