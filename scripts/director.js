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
					document.querySelector('.videoOverlay .video .exitButton'),
					document.querySelector('.videoOverlay .controls .timeBarContainer'),
					document.querySelector('.videoOverlay .controls .volumeBarContainer .volumeBar'),
				])

				// Setup video support
				videoSupport.setup()

				// Setup cursor effect on video
				cursor.setupCursorAfkEffectOnVideo()
			}
		}
	})

// Object that contains sizes of the window and actualize on window resize
let windowSizes = {
	width: window.innerWidth,
	height: window.innerHeight,

	setResizeEvent() {
		window.addEventListener('resize', () => {
			this.width = window.innerWidth
			this.height = window.innerHeight
			videoSupport.calculateDomSize()
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
		document.querySelector('.nameContainer h1').innerHTML = director.name
	},

	posUpdate() {
		// Update flashlight only if it his in the viewport
		if (window.pageYOffset < windowSizes.height) {
			this.positionRatio = {
				x: cursor.positionWithLerp.x / window.innerWidth - 0.5,
				y: (cursor.positionWithLerp.y + window.pageYOffset) / window.innerHeight - 0.5,
			}
			this.$flashLight.style.backgroundPosition = `${this.positionRatio.x * windowSizes.width}px ${this.positionRatio.y * windowSizes.height}px`
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
			$image.setAttribute('alt', 'Video thumbnail')
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
				if (_section.dom.getBoundingClientRect().top - window.innerHeight * 0.7 < 0 && _section.state == false) {
					// Update its state
					_section.state = true

					// Animate opacity and translate of the video
					gsap.to(_section.dom.querySelector('.videoThumbnail'), 0.7, { x: '0vw', opacity: 1 })

					// Animate opacity of infos
					gsap.from([_section.dom.querySelector('.infoStroke .title'), _section.dom.querySelector('.infoFill .title')], 0.2, {
						opacity: 0,
						delay: 0.5,
					})
					gsap.from([_section.dom.querySelector('.infoStroke .artistName'), _section.dom.querySelector('.infoStroke .artistName')], 0.2, { opacity: 0, delay: 0.7 })

					// Animate translate of the infos according to alignement
					if (_section.dom.classList.contains('alignRight')) {
						gsap.from([_section.dom.querySelector('.infoStroke .title'), _section.dom.querySelector('.infoFill .title')], 0.5, {
							x: '10vw',
							delay: 0.5,
						})
						gsap.from([_section.dom.querySelector('.infoStroke .artistName'), _section.dom.querySelector('.infoFill .artistName')], 0.5, { x: '10vw', delay: 0.7 })
					} else if (_section.dom.classList.contains('alignLeft')) {
						gsap.from([_section.dom.querySelector('.infoStroke .title'), _section.dom.querySelector('.infoFill .title')], 0.5, {
							x: '-10vw',
							delay: 0.5,
						})
						gsap.from([_section.dom.querySelector('.infoStroke .artistName'), _section.dom.querySelector('.infoFill .artistName')], 0.5, { x: '-10vw', delay: 0.7 })
					}
				}
			}
		})
	},
}

let scroller = {
	$scrollerContainer: document.querySelector('.nameContainer .scrollerContainer'),
	$scrollerBar: document.querySelector('.nameContainer .scrollerContainer .scroller .scrollerBar'),

	scrollBlockValue: null,
	scrollBlockEvent: null,

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
			window.pageYOffset == 0 ? gsap.to(this.$scrollerContainer, 0.5, { opacity: 1 }) : gsap.to(this.$scrollerContainer, 0.5, { opacity: 0 })
		})
	},

	scrollTo() {
		window.scrollTo(0, scroller.scrollBlockValue)
	},

	blockScroll() {
		this.scrollBlockValue = window.pageYOffset
		this.scrollBlockEvent = window.addEventListener('scroll', this.scrollTo)
	},

	unblockScroll() {
		this.scrollBlockEvent = window.removeEventListener('scroll', this.scrollTo)
	},
}
scroller.setup()

let videoSupport = {
	$videoOverlay: document.querySelector('.videoOverlay'),
	$video: document.querySelector('.videoOverlay video'),
	$videoThumbnails: null,

	$controls: document.querySelector('.videoOverlay .controls'),

	$timeBarContainer: document.querySelector('.videoOverlay .timeBarContainer'),
	timeBarContainerWidth: null,
	$timeBarIndexLine: document.querySelector('.videoOverlay .timeBar .timeBarLine .indexLine'),
	timeBarWidth: null,
	$timeBarIndexCircle: document.querySelector('.videoOverlay .timeBar .indexCircle'),

	$volumeBar: document.querySelector('.videoOverlay .controls .volumeBarContainer .volumeBar'),
	$volumeBarIndexLine: document.querySelector('.videoOverlay .controls .volumeBarContainer .volumeBar .volumeBarLine .indexLine'),
	volumeBarWidth: null,
	$volumeBarIndexCircle: document.querySelector('.videoOverlay .controls .volumeBarContainer .volumeBar .indexCircle'),
	$volumeIcon: document.querySelector('.videoOverlay .controls .volumeBarContainer .volumeIcon'),
	$volumeIconSVG: document.querySelector('.videoOverlay .controls .volumeBarContainer .volumeIcon img'),

	$crossCursor: document.querySelector('.cursorContainer .cross'),

	$exitButton: document.querySelector('.videoOverlay .video .exitButton'),
	controlZones: [document.querySelector('.videoOverlay .controls .zones .left'), document.querySelector('.videoOverlay .controls .zones .right')],

	volume: 0.5,

	overlayIsOpen: false,
	timeBarIndexUpdateInterval: null,

	setup() {
		// Get video thumbnails after there creations
		this.$videoThumbnails = document.querySelectorAll('.works .videoThumbnail img')
		this.calculateDomSize()
		this.setupEnterEvent()
		this.setupQuitEvent()
		this.setVolume(this.volume)
		this.setupVolumeControl()
		this.setupKeyboardControls()
	},

	setupEnterEvent() {
		// For each video thumbnail lauch the corresponding video
		for (const _image of this.$videoThumbnails) {
			_image.addEventListener('click', () => {
				// Block the scroll on main page
				scroller.blockScroll()

				// Set the correct film's src
				this.$video.src = director.films[_image.getAttribute('data')].filmUrl

				// Display the overlay
				this.overlayIsOpen = true
				gsap.to(this.$videoOverlay, 0.5, { opacity: 1, pointerEvents: 'auto' })
				this.setupControlBarUpdate()

				// Play the video
				this.$video.volume = 0
				this.$video.play()
				gsap.to(this.$video, 1, { volume: this.volume })
			})
		}
	},

	setupQuitEvent() {
		this.$exitButton.addEventListener('click', () => {
			// Unblock the scroll on main page
			scroller.unblockScroll()

			// Remove the overlay then clear the time bar
			this.overlayIsOpen = false
			gsap.to(this.$videoOverlay, 0.5, {
				opacity: 0,
				pointerEvents: 'none',
				onComplete: () => {
					this.$timeBarIndexLine.style.transform = `translateX(-100%)`
					this.$timeBarIndexCircle.style.transform = `translate(calc(-50% - 1.5px), calc(-50% - 1.5px))`
				},
			})
			this.clearControlBarUpdate()

			// Pause the video
			gsap.to(this.$video, 0.5, {
				volume: 0,
				onComplete: () => {
					this.$video.pause()
				},
			})
		})
	},

	setupControlBarUpdate() {
		let isClicking = false

		// Setup an interval that update the time bar
		this.timeBarIndexUpdateInterval = setInterval(() => {
			// Update line index
			let videoState = (this.$video.currentTime / this.$video.duration) * 100
			this.$timeBarIndexLine.style.transform = `translateX(${-100 + videoState}%)`
			// Update circle index
			this.$timeBarIndexCircle.style.transform = `translate(calc(-50% - 1.5px + ${(this.timeBarWidth / 100) * videoState}px), calc(-50% - 1.5px))`
		}, 100)

		// On mouse move update time bar if the mouse is down
		this.$timeBarContainer.addEventListener('mousedown', (_event) => {
			isClicking = true
			this.updateTimeBar(_event)
		})
		this.$timeBarContainer.addEventListener('mouseup', () => {
			isClicking = false
		})
		this.$timeBarContainer.addEventListener('mouseleave', () => {
			isClicking = false
		})
		this.$timeBarContainer.addEventListener('mousemove', (_event) => {
			if (isClicking) {
				this.updateTimeBar(_event)
			}
		})
	},

	// Update time bar according to mouse position on the bar
	updateTimeBar(_event) {
		// Calculate new time
		let newTime = _event.offsetX / this.timeBarContainerWidth

		// Apply it on video and timeBar
		this.$video.currentTime = this.$video.duration * newTime
		// Line
		this.$timeBarIndexLine.style.transform = `translateX(${-100 + newTime * 100}%)`
		// Circle
		this.$timeBarIndexCircle.style.transform = `translate(calc(-50% + ${(this.timeBarWidth / 100) * newTime * 100}px), calc(-50% - 1.5px))`
	},

	// Clear the interval when the user quit the video overlay
	clearControlBarUpdate() {
		clearInterval(this.timeBarIndexUpdateInterval)
	},

	setupVolumeControl() {
		let isClicking = false

		// Update volume bar on move when the mouse is down
		this.$volumeBar.addEventListener('mousedown', (_event) => {
			isClicking = true
			this.updateVolumeBar(_event)
		})
		this.$volumeBar.addEventListener('mouseup', () => {
			isClicking = false
		})
		this.$volumeBar.addEventListener('mouseleave', () => {
			isClicking = false
		})

		this.$volumeBar.addEventListener('mousemove', (_event) => {
			if (isClicking) {
				this.updateVolumeBar(_event)
			}
		})
	},

	// Update volume bar according to mouse position on the bar
	updateVolumeBar(_event) {
		this.volume = _event.offsetX / this.volumeBarWidth

		// Update video volume
		if (this.volume <= 1 && this.volume >= 0) {
			this.$video.volume = this.volume
		}

		// Display volume icon with the correct number of bar
		if (this.volume < 0.05) {
			this.$volumeIconSVG.setAttribute('src', '../assets/images/volumeState3.svg')
		} else if (this.volume < 0.3) {
			this.$volumeIconSVG.setAttribute('src', '../assets/images/volumeState2.svg')
		} else if (this.volume < 0.7) {
			this.$volumeIconSVG.setAttribute('src', '../assets/images/volumeState1.svg')
		} else {
			this.$volumeIconSVG.setAttribute('src', '../assets/images/volume.svg')
		}

		// Udpate dom volume bar
		this.$volumeBarIndexLine.style.transform = `translateX(${this.volume * 100 - 100}%)`
		this.$volumeBarIndexCircle.style.transform = `translate(calc(-50% + ${_event.offsetX}px), -50%)`
	},

	setVolume(_volume) {
		// Update video volume
		this.$video.volume = _volume

		// Udpate dom volume bar
		this.$volumeBarIndexLine.style.transform = `translateX(${_volume * 100 - 100}%)`
		this.$volumeBarIndexCircle.style.transform = `translate(calc(-50% + ${this.volumeBarWidth * _volume}px), -50%)`
	},

	calculateDomSize() {
		this.timeBarWidth = this.$timeBarIndexLine.getBoundingClientRect().width
		this.timeBarContainerWidth = this.$timeBarContainer.getBoundingClientRect().width
		this.volumeBarWidth = this.$volumeBarIndexLine.getBoundingClientRect().width
		// Actualize volume bar position
		this.setVolume(this.volume)
	},

	setupKeyboardControls() {
		// Setup keyboard shortcuts to pause and navigate in the video
		window.addEventListener('keydown', (_event) => {
			// Only trigger it if the video overlay is open
			if (this.overlayIsOpen) {
				switch (_event.code) {
					case 'Space':
						if (this.$video.paused) {
							this.$video.play()
						} else {
							this.$video.pause()
						}
						break
					case 'ArrowRight':
						this.$video.currentTime += this.$video.duration / 10
						break
					case 'ArrowLeft':
						this.$video.currentTime -= this.$video.duration / 10
						break
				}
			}
		})
	},
}
