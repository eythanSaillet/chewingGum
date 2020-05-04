// Set cursor target
let target = []
for (const _element of document.querySelectorAll('.headerContainer a')) {
	target.push(_element)
}
target.push(document.querySelector('.menuContainer .strokeNameContainer span'))
cursor.setTarget(target)

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

	actualName: null,
	stepBlocSize: document.querySelector('.contentContainer .imagesContainer .stepBloc').getBoundingClientRect().height,

	setup() {
		// Display the correct name on the loading of the page
		this.displayCorrectName()

		// On scroll : actualize the name
		window.addEventListener('scroll', () => {
			this.displayCorrectName()
		})

		this.setupRedirectEvent()
	},

	displayCorrectName() {
		// Display the correct name according to the scroll and from the config and
		let name = Math.ceil(window.scrollY / (menuImageHeight + this.stepBlocSize) - 0.5)
		if (name != this.actualName) {
			this.actualName = name
			this.$fillName.innerHTML = config[this.actualName].name
			this.$strokeName.innerHTML = config[this.actualName].name
		}
	},

	setupRedirectEvent() {
		// Redirect to the correct director page when clicking on the name
		this.$strokeName.addEventListener('click', () => {
			console.log(config[this.actualName], this.actualName)
			window.location.href = `pages/director.html#${config[this.actualName].index}`
		})
	},
}
