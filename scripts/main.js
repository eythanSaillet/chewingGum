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
	firstDisplay: true,

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
			// For the actual name, put each letter in a span then display it
			let nameInSpan = ''
			// If it is the first time we display a name, stay at opacity 0 to permit opening animation
			for (let i = 0; i < config[this.actualName].name.length; i++) {
				if (this.firstDisplay) {
					nameInSpan += `<span>${config[this.actualName].name[i]}</span>`
				} else {
					nameInSpan += `<span style="opacity:1" >${config[this.actualName].name[i]}</span>`
				}
			}
			this.$fillName.innerHTML = nameInSpan
			this.$strokeName.innerHTML = nameInSpan
		}
		this.firstDisplay = false
	},

	setupRedirectEvent() {
		// Redirect to the correct director page when clicking on the name
		this.$strokeName.addEventListener('click', () => {
			window.location.href = `pages/director.html#${config[this.actualName].index}`
		})
	},
}

let scroller = {
	scrollBlockValue: null,
	isBlocked: false,

	setup() {
		window.addEventListener('scroll', this.scrollTo)
	},

	scrollTo() {
		if (scroller.isBlocked) {
			window.scrollTo(0, scroller.scrollBlockValue)
		}
	},

	blockScroll() {
		this.scrollBlockValue = window.pageYOffset
		this.isBlocked = true
	},

	unblockScroll() {
		scroller.isBlocked = false
	},
}
scroller.setup()

let loader = {
	images: document.querySelectorAll('.contentContainer .imagesContainer .image img'),
	imagesSources: ['5', '2', '4'],
	numberOfImagesLoaded: 0,

	fontsAreLoaded: false,

	setup() {
		window.scrollTo(0, 0)
		scroller.blockScroll()

		// Fonts loader promise
		document.fonts.ready.then(() => {
			this.fontsAreLoaded = true
			this.testIfLaunchIsReady(0)
		})

		// Images loader promises
		for (let i = 0; i < this.images.length; i++) {
			this.images[i].addEventListener('load', () => {
				this.testIfLaunchIsReady(1)
			})
			this.images[i].setAttribute('src', `assets/images/thumbnail${this.imagesSources[i]}.jpeg`)
		}
	},

	// Each time something is loaded, test if everything is loaded then launch
	testIfLaunchIsReady(sum) {
		this.numberOfImagesLoaded += sum
		if (this.fontsAreLoaded && this.numberOfImagesLoaded === this.images.length) {
			this.displayInterface()
		}
	},

	displayInterface() {
		// Display header and menu content
		document.querySelector('.fillNameContainer').style.background = 'none'
		document.querySelector('.menuContainer').style.opacity = 1
		gsap.to('.headerContainer', 0.5, { opacity: 1, ease: Power3.easeIn })
		gsap.to('.contentContainer', 1.2, { y: 0, ease: Power2.easeInOut })
		gsap.to('.blackBlocs', 1.2, {
			y: 0,
			ease: Power2.easeInOut,
			onComplete: scroller.unblockScroll,
		})
		setTimeout(displayName, 500)

		function displayName() {
			// Display name with stagger effet
			let fillNameSpans = document.querySelectorAll('.menuContainer .fillNameContainer span span')
			let strokeNameSpans = document.querySelectorAll('.menuContainer .strokeNameContainer span span')

			// Creating a random display order
			function shuffle(array) {
				array.sort(() => Math.random() - 0.5)
			}
			let displayOrder = []
			for (let i = 0; i < fillNameSpans.length; i++) {
				displayOrder.push(i)
			}
			shuffle(displayOrder)

			// Creating random steps
			let effectFactors = []
			for (let i = 0; i < fillNameSpans.length; i++) {
				effectFactors.push((Math.random() - 0.5) * 200)
			}

			// Setting initial spans positions
			for (let i = 0; i < strokeNameSpans.length; i++) {
				gsap.to(strokeNameSpans[i], 0, { y: effectFactors[i] })
				gsap.to(fillNameSpans[i], 0, { y: effectFactors[i] })
			}

			// Display spans with an interval
			let i = 0
			let displayIntervalID = setInterval(() => {
				gsap.to(strokeNameSpans[displayOrder[i]], 0.7, { y: 0, opacity: 1 })
				gsap.to(fillNameSpans[displayOrder[i]], 0.7, { y: 0, opacity: 1 })
				i++
				if (i === displayOrder.length) {
					clearInterval(displayIntervalID)
					// setTimeout(() => {
					// 	for (let i = 0; i < strokeNameSpans.length; i++) {
					// 		strokeNameSpans[i].style.opacity = 1
					// 		fillNameSpans[i].style.opacity = 1
					// 	}
					// }, 700)
				}
			}, 20)
		}
	},
}

loader.setup()
