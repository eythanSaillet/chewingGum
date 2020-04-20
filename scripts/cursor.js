function lerp (start, end, ratio)
{
	return start * (1 - ratio) + ratio * end
}

let cursor =
{
    // DOM
    $cursor : document.querySelector('.cursorContainer'),
    $dot : document.querySelector('.cursorContainer .dot'),
    $cross : document.querySelector('.cursorContainer .cross'),
    $crossA : document.querySelector('.cursorContainer .cross .a'),
    $crossB : document.querySelector('.cursorContainer .cross .b'),

    $target : null,
    $vanishOnHover : [],

    // VALUES
    position : {x: -150, y: -150},
    positionWithLerp : {x: -150, y: -150},

    // ANIMATIONS TIMELINES
    targetHoverTimeLine : gsap.timeline({paused: true}),

    setup()
    {
        this.setGlobalMouseEvent()
    },

    setTarget(_target)
    {
        this.$target = _target

        this.setTargetMouseEvent()
        this.setHoverEffect()
    },

    setGlobalMouseEvent()
    {
        window.addEventListener('mousemove', (_event) =>
        {
            // UPDATE MOUSE POS VALUE
            this.position = {x: _event.clientX, y: _event.clientY}

            // UPDATE DOT CURSOR POS
            this.$dot.style.transform = `translate(calc(-50% + ${this.position.x}px), calc(-50% + ${this.position.y}px))`
        })

        // MAKE CURSOR INVISIBLE WHEN HE LEAVE THE WINDOW
        window.addEventListener('mouseout', () =>
        {
            gsap.to(this.$cursor, 0.5, {opacity: 0})
        })
        window.addEventListener('mouseover', () =>
        {
            gsap.to(this.$cursor, 0.5, {opacity: 1})
        })
    },

    setTargetMouseEvent()
    {

        // ADD EVENT ON IMAGES TO TRIGGER THE CURSOR ANIMATION
        for (const _target of this.$target)
        {
            _target.addEventListener('mouseover', () =>
            {
                this.targetHoverTimeLine.restart()
            })
            _target.addEventListener('mouseleave', () =>
            {
                this.targetHoverTimeLine.reverse()
            })
        }
    },

    setFlashLightLerpInterval()
    {
        window.setInterval(() =>
        {
            // APPLY LERP ON CURSOR POS
            this.positionWithLerp.x = lerp(this.positionWithLerp.x, this.position.x, 0.15)
            this.positionWithLerp.y = lerp(this.positionWithLerp.y, this.position.y, 0.15)

            // UPDATE FLASHLIGHT EFFECT ON DIRECTORS PAGES
            flashLightEffect.posUpdate()
        }, 1000 / 60)
    },

    // DEFINE THE GSAP CURSOR ANIMATION ON TARGET
    setHoverEffect()
    {
        this.targetHoverTimeLine.to(this.$dot, 0.3, { width: 30, height: 30})
    },

    setupCursorEffectOnVideo()
    {
        let cursorIsAfk = false
        let cursorTempPos = {x: null, y: null}
        let cursorIsOnTimeBar = false

        const $quitZone = document.querySelector('.videoOverlay .controls .quit')
        const $timeBarContainerZone = document.querySelector('.videoOverlay .controls .timeBarContainer')
        const $timeBarCircleIndex = document.querySelector('.videoOverlay .controls .timeBarContainer .indexCircle')

        // Test with an interval if the user move the cursor
        window.setInterval(() =>
        {
            // Make time bar and the cursor disappear if the cusor is afk
            if (cursorTempPos.x == this.position.x && cursorTempPos.y == this.position.y && cursorIsAfk == false && videoSupport.overlayIsOpen == true)
            {
                cursorIsAfk = true
                gsap.to(videoSupport.$timeBar, 0.7, {opacity: 0})
                gsap.to(this.$cursor, 0.7, {opacity: 0})
            }
            cursorTempPos.x = this.position.x
            cursorTempPos.y = this.position.y
        }, 1000)

        window.addEventListener('mousemove', (_event) =>
        {
            // Make appear the time bar and the cursor if it is moving
            if (cursorIsAfk == true)
            {
                cursorIsAfk = false
                gsap.to(videoSupport.$timeBar, 0.7, {opacity: 1})
                gsap.to(this.$cursor, 0.7, {opacity: 1})
            }

            // Update cross cursor position
            this.$cross.style.transform = `translate(calc(-50% + ${this.position.x}px), calc(-50% + ${this.position.y}px))`

            if (cursorIsOnTimeBar)
            {
                // $timeBarCircleIndex.style.transform = `translate(-50%, calc(1px - 50% + ${this.position.x}px))`
                $timeBarCircleIndex.style.left = `calc(${this.position.x}px - 10vw)`
            }
        })

        $quitZone.addEventListener('mouseenter', () =>
        {
            this.displayCross()
            gsap.to($timeBarCircleIndex, 0.4, {scale: 0.01, opacity: 0})
            cursorIsOnTimeBar = false
        })

        $timeBarContainerZone.addEventListener('mouseenter', () =>
        {
            this.vanishCross()
            gsap.to($timeBarCircleIndex, 0.4, {scale: 1, opacity: 1})
            cursorIsOnTimeBar = true
        })

        console.log(document.querySelector('.videoOverlay .controls .timeBarContainer .timeBar').getBoundingClientRect())
    },

    displayCross()
    {
        gsap.to(this.$cross, 0, {opacity: 1})
        gsap.to(this.$crossA, 0.4, {scaleX: 1})
        gsap.to(this.$crossB, 0.4, {scaleX: 1})
    },

    vanishCross()
    {
        gsap.to(this.$crossA, 0.4, {scaleX: 0.01, ease: Power2.easeIn})
        gsap.to(this.$crossB, 0.4, {scaleX: 0.01, ease: Power2.easeIn})
        gsap.to(this.$cross, 0, {opacity: 0, delay: 0.4})
    }
}
cursor.setup()
