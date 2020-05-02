let director = null

// Get config.json
window
	.fetch('../scripts/config.json')
	.then((_response) => _response.json())
	.then((_config) => {
		// Get url index
		const splitUrl = window.location.href.split('#')
		const urlIndex = splitUrl[splitUrl.length - 1]

		// Get the object in the config that correspond to the index
		for (const _director of _config) {
			if (_director.index == urlIndex) {
				// Define the director from the config
				director = _director

				// Setup flashlight effect with the director's name
				flashLightEffect.setup()

				// Setup film display
				filmsDisplay.setup()

				// Setup cursor style event on video thumbnails and header
				cursor.setTarget([
					...document.querySelectorAll('.works .videoThumbnail img'),
					...document.querySelectorAll('.headerContainer a'),
				])

				// Setup video support
				videoSupport.setup()

				// Setup cursor effect on video
				cursor.setupCursorEffectOnVideo()
			}
		}
	})

// Object that contains sizes of the window and actualize on window resize
let windowSizes = {
	width: window.innerWidth,
	height: window.innerHeight,

	setResizeEvent() {
		window.addEventListener('resize', () => {
			;(this.width = window.innerWidth), (this.height = window.innerHeight)
		})
	},
}
windowSizes.setResizeEvent()

let flashLightEffect = {
	$flashLight: document.querySelector('.nameContainer h1'),

	positionRatio: {},

	setup() {
		cursor.setFlashLightLerpInterval()

		this.setupName()
	},

	setupName() {
		document.querySelector('.nameContainer h1').innerHTML = director.name.toUpperCase()
	},

	posUpdate() {
		// Update flashlight only if it his in the viewport
		if (window.pageYOffset < windowSizes.height) {
			this.positionRatio = {
				x: cursor.positionWithLerp.x / window.innerWidth - 0.5,
				y: (cursor.positionWithLerp.y + window.pageYOffset) / window.innerHeight - 0.5,
			}
			this.$flashLight.style.backgroundPosition = `${this.positionRatio.x * windowSizes.width}px ${
				this.positionRatio.y * windowSizes.height
			}px`
		}
	},
}

let filmsDisplay = {
	sections: [],

	setup() {
		this.setupSectionDom()
		this.setupSectionsArray()
		this.setupScrollEvent()
	},

	setupSectionDom() {
		function creatingInfo(div, i) {
			// Creating title div
			const $title = document.createElement('div')
			$title.classList.add('title')
			$title.innerHTML = director.films[i].title

			// Create artistName div
			const $artistName = document.createElement('div')
			$artistName.classList.add('artistName')
			$artistName.innerHTML = director.films[i].artistName

			div.appendChild($title)
			div.appendChild($artistName)
		}

		for (let i = 0; i < director.films.length; i++) {
			// Creating section and add align class
			const $section = document.createElement('section')
			$section.classList.add(i % 2 > 0 ? 'alignRight' : 'alignLeft')

			// Creating stroke info div then fill it with title and artistName
			const $strokeInfo = document.createElement('div')
			$strokeInfo.classList.add('info', 'infoStroke')

			creatingInfo($strokeInfo, i)

			// Creating fill info div then fill it with title and artistName
			const $fillInfo = document.createElement('div')
			$fillInfo.classList.add('info', 'infoFill')

			creatingInfo($fillInfo, i)

			// Add infos to the section
			$section.appendChild($fillInfo)
			$section.appendChild($strokeInfo)

			// Create blackbloc then adding it to the scene
			let $blackBloc = document.createElement('div')
			$blackBloc.classList.add('blackBloc')

			$section.appendChild($blackBloc)

			// Creating video thumbnail and fill it with the corresponding image
			const $videoThumbnail = document.createElement('div')
			$videoThumbnail.classList.add('videoThumbnail')
			const $image = document.createElement('img')
			$image.setAttribute('src', director.films[i].imageUrl)
			$image.setAttribute('data', i)
			$videoThumbnail.appendChild($image)

			$section.appendChild($videoThumbnail)

			// Fill works with the section
			document.querySelector('.works').appendChild($section)
		}
	},

	setupSectionsArray() {
		let $sections = document.querySelectorAll('.works section')
		for (const _$section of $sections) {
			let section = {}
			section.dom = _$section
			section.state = false
			this.sections.push(section)
		}
	},

	setupScrollEvent() {
		window.addEventListener('scroll', () => {
			for (_section of this.sections) {
				// Test if the section is in view and if this is the first time
				if (
					_section.dom.getBoundingClientRect().top - window.innerHeight * 0.7 < 0 &&
					_section.state == false
				) {
					// Update its state
					_section.state = true

					// Animate opacity and translate of the video
					gsap.to(_section.dom.querySelector('.videoThumbnail'), 0.7, { x: '0vw', opacity: 1 })

					// Animate opacity of infos
					gsap.from(
						[
							_section.dom.querySelector('.infoStroke .title'),
							_section.dom.querySelector('.infoFill .title'),
						],
						0.2,
						{ opacity: 0, delay: 0.5 }
					)
					gsap.from(
						[
							_section.dom.querySelector('.infoStroke .artistName'),
							_section.dom.querySelector('.infoStroke .artistName'),
						],
						0.2,
						{ opacity: 0, delay: 0.7 }
					)

					// Animate translate of the infos according to alignement
					if (_section.dom.classList.contains('alignRight')) {
						gsap.from(
							[
								_section.dom.querySelector('.infoStroke .title'),
								_section.dom.querySelector('.infoFill .title'),
							],
							0.5,
							{ x: '10vw', delay: 0.5 }
						)
						gsap.from(
							[
								_section.dom.querySelector('.infoStroke .artistName'),
								_section.dom.querySelector('.infoFill .artistName'),
							],
							0.5,
							{ x: '10vw', delay: 0.7 }
						)
					} else if (_section.dom.classList.contains('alignLeft')) {
						gsap.from(
							[
								_section.dom.querySelector('.infoStroke .title'),
								_section.dom.querySelector('.infoFill .title'),
							],
							0.5,
							{ x: '-10vw', delay: 0.5 }
						)
						gsap.from(
							[
								_section.dom.querySelector('.infoStroke .artistName'),
								_section.dom.querySelector('.infoFill .artistName'),
							],
							0.5,
							{ x: '-10vw', delay: 0.7 }
						)
					}
				}
			}
		})
	},
}

let scroller = {
	$scrollerContainer: document.querySelector('.nameContainer .scrollerContainer'),
	$scrollerBar: document.querySelector('.nameContainer .scrollerContainer .scroller .scrollerBar'),

	setup() {
		this.setupAnimation()
		this.setupVanishEffect()
	},

	setupAnimation() {
		let timeline = new gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
		timeline.to(this.$scrollerBar, 0.5, { y: '-100%', ease: Power2.easeIn })
		timeline.to(this.$scrollerBar, 0, { y: '100%', delay: 0.1 })
		timeline.to(this.$scrollerBar, 0.5, { y: '0%', ease: Power2.easeOut })
	},

	setupVanishEffect() {
		window.addEventListener('scroll', () => {
			window.pageYOffset == 0
				? gsap.to(this.$scrollerContainer, 0.5, { opacity: 1 })
				: gsap.to(this.$scrollerContainer, 0.5, { opacity: 0 })
		})
	},
}
scroller.setup()

let videoSupport = {
	$videoOverlay: document.querySelector('.videoOverlay'),
	$video: document.querySelector('.videoOverlay video'),
	$videoThumbnails: null,
	$timeBar: document.querySelector('.videoOverlay .timeBar'),
	$timeBarIndex: document.querySelector('.videoOverlay .timeBar .indexBar'),
	$crossCursor: document.querySelector('.cursorContainer .cross'),

	$quitZone: document.querySelector('.videoOverlay .controls .zones .center'),
	controlZones: [
		document.querySelector('.videoOverlay .controls .zones .left'),
		document.querySelector('.videoOverlay .controls .zones .right'),
	],
	// $leftControlZone: document.querySelector('.videoOverlay .controls .zones .left'),
	// $righControltZone: document.querySelector('.videoOverlay .controls .zones .right'),

	overlayIsOpen: false,
	timeBarIndexUpdateInterval: null,

	setup() {
		// Get video thumbnails after there creations
		this.$videoThumbnails = document.querySelectorAll('.works .videoThumbnail img')

		this.setupEnterEvent()
		this.setupQuitEvent()
		this.setupControlZonesEvent()
	},

	setupEnterEvent() {
		// For each video thumbnail lauch the corresponding video
		for (const _image of this.$videoThumbnails) {
			_image.addEventListener('click', () => {
				// Set the correct film's src
				this.$video.src = director.films[_image.getAttribute('data')].filmUrl

				// Display the overlay
				this.overlayIsOpen = true
				gsap.to(this.$videoOverlay, 0.5, { opacity: 1, pointerEvents: 'auto' })
				this.setupControlBarUpdate()

				// Display the cross cursor and hide basic cursor
				cursor.displayCross.play()
				gsap.to(cursor.$dot, 0.2, { opacity: 0 })

				// Play the video
				this.$video.volume = 0
				this.$video.play()
				gsap.to(this.$video, 1, { volume: 1 })
			})
		}
	},

	setupQuitEvent() {
		this.$quitZone.addEventListener('click', () => {
			// Remove the overlay then clear the time bar
			this.overlayIsOpen = false
			gsap.to(this.$videoOverlay, 0.5, {
				opacity: 0,
				pointerEvents: 'none',
				onComplete: () => {
					this.$timeBarIndex.style.transform = `translateX(-100%)`
				},
			})
			this.clearControlBarUpdate()

			// Redisplay the dot cursor + the cursor in case it was invisible and hide cross cursor
			gsap.to(cursor.$dot, 0.2, { opacity: 1 })
			// gsap.to(cursor.$cursor, 0.7, { opacity: 1 })
			cursor.displayCross.reverse(0.3)

			// Pause the video
			gsap.to(this.$video, 0.5, {
				volume: 0,
				onComplete: () => {
					this.$video.pause()
				},
			})
		})
	},

	setupControlZonesEvent() {
		// When clicking on left or right control zone move back or forward in the time of the video
		for (const _zone of this.controlZones) {
			_zone.addEventListener('click', () => {
				this.$video.currentTime += 0.1 * this.$video.duration * parseInt(_zone.getAttribute('data'))
			})
		}
	},

	setupControlBarUpdate() {
		// Setup an interval that update the time bar
		this.timeBarIndexUpdateInterval = setInterval(() => {
			let videoState = (this.$video.currentTime / this.$video.duration) * 100
			this.$timeBarIndex.style.transform = `translateX(${-100 + videoState}%)`
		}, 100)
	},

	// Clear the interval when the user quit the video overlay
	clearControlBarUpdate() {
		clearInterval(this.timeBarIndexUpdateInterval)
	},
}
