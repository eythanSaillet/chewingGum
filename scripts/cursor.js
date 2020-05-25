function lerp(start, end, ratio) {
	return start * (1 - ratio) + ratio * end
}

let cursor = {
	// DOM
	$cursor: document.querySelector('.cursorContainer'),
	$dot: document.querySelector('.cursorContainer .dot'),
	$cross: document.querySelector('.cursorContainer .cross'),
	$crossA: document.querySelector('.cursorContainer .cross .a'),
	$crossB: document.querySelector('.cursorContainer .cross .b'),
	$leftArrow: document.querySelector('.cursorContainer .leftArrow'),
	$leftArrowA: document.querySelector('.cursorContainer .leftArrow .a'),
	$leftArrowB: document.querySelector('.cursorContainer .leftArrow .b'),
	$rightArrow: document.querySelector('.cursorContainer .rightArrow'),
	$rightArrowA: document.querySelector('.cursorContainer .rightArrow .a'),
	$rightArrowB: document.querySelector('.cursorContainer .rightArrow .b'),

	$target: null,

	// VALUES
	position: { x: -150, y: -150 },
	positionWithLerp: { x: -150, y: -150 },

	// ANIMATIONS TIMELINES
	targetHoverTimeLine: gsap.timeline({ paused: true }),

	setup() {
		this.setGlobalMouseEvent()
	},

	setTarget(_target) {
		this.$target = _target

		this.setTargetMouseEvent()
		this.setHoverEffect()
	},

	setGlobalMouseEvent() {
		window.addEventListener('mouseenter', (_event) => {
			console.log(_event.clientX)
		})
		window.addEventListener('mousemove', (_event) => {
			// UPDATE MOUSE POS VALUE
			this.position = { x: _event.clientX, y: _event.clientY }

			// UPDATE DOT CURSOR POS
			this.$cursor.style.transform = `translate(calc(-50% + ${this.position.x}px), calc(-50% + ${this.position.y}px))`
		})

		// MAKE CURSOR INVISIBLE WHEN HE LEAVE THE WINDOW
		window.addEventListener('mouseout', () => {
			gsap.to(this.$cursor, 0.5, { opacity: 0 })
		})
		window.addEventListener('mouseover', () => {
			gsap.to(this.$cursor, 0.5, { opacity: 1 })
		})
	},

	setTargetMouseEvent() {
		// ADD EVENT ON IMAGES TO TRIGGER THE CURSOR ANIMATION
		for (const _target of this.$target) {
			_target.addEventListener('mouseover', () => {
				this.targetHoverTimeLine.restart()
			})
			_target.addEventListener('mouseleave', () => {
				this.targetHoverTimeLine.reverse()
			})
		}
	},

	setFlashLightLerpInterval() {
		window.setInterval(() => {
			// APPLY LERP ON CURSOR POS
			this.positionWithLerp.x = lerp(this.positionWithLerp.x, this.position.x, 0.15)
			this.positionWithLerp.y = lerp(this.positionWithLerp.y, this.position.y, 0.15)

			// UPDATE FLASHLIGHT EFFECT ON DIRECTORS PAGES
			flashLightEffect.posUpdate()
		}, 1000 / 60)
	},

	// DEFINE THE GSAP CURSOR ANIMATION ON TARGET
	setHoverEffect() {
		this.targetHoverTimeLine.to(this.$dot, 0.3, { width: 30, height: 30 })
	},

	setupCursorAfkEffectOnVideo() {
		let cursorIsAfk = false
		let cursorTempPos = { x: null, y: null }

		// Test with an interval if the user move the cursor
		window.setInterval(() => {
			// Make time bar and the cursor disappear if the cusor is afk
			if (cursorTempPos.x == this.position.x && cursorTempPos.y == this.position.y && cursorIsAfk == false && videoSupport.overlayIsOpen == true) {
				cursorIsAfk = true
				gsap.to(videoSupport.$controls, 0.7, { opacity: 0 })
				gsap.to(this.$cursor, 0.7, { opacity: 0 })
				gsap.to(videoSupport.$exitButton, 0.7, { opacity: 0 })
			}
			cursorTempPos.x = this.position.x
			cursorTempPos.y = this.position.y
		}, 1000)

		window.addEventListener('mousemove', (_event) => {
			// Make appear the time bar and the cursor if it is moving
			if (cursorIsAfk == true) {
				cursorIsAfk = false
				gsap.to(videoSupport.$controls, 0.7, { opacity: 1 })
				gsap.to(this.$cursor, 0.7, { opacity: 1 })
				gsap.to(videoSupport.$exitButton, 0.7, { opacity: 1 })
			}
		})
	},
}
cursor.setup()
