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

    $images : null,
    $links : null,
    $vanishOnHover : [],

    // VALUES
    position : {x: -150, y: -150},
    positionWithLerp : {x: -150, y: -150},

    // ANIMATIONS TIMELINES
    imagesHoverTimeLine : gsap.timeline({paused: true}),
    linksHoverTimeLine : gsap.timeline({paused: true}),

    setup()
    {
        this.setGlobalMouseEvent()
    },

    setTarget(_image, _link)
    {
        this.$images = _image
        this.$links = _link

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
            // gsap.to(this.$cursor, 0.5, {opacity: 0})
        })
        window.addEventListener('mouseover', () =>
        {
            gsap.to(this.$cursor, 0.5, {opacity: 1})
        })
    },

    setTargetMouseEvent()
    {

        // ADD EVENT ON IMAGES TO TRIGGER THE CURSOR ANIMATION
        for (const _image of this.$images)
        {
            _image.addEventListener('mouseover', () =>
            {
                this.imagesHoverTimeLine.restart()
            })
            _image.addEventListener('mouseleave', () =>
            {
                this.imagesHoverTimeLine.reverse()
            })
        }

        // ADD EVENT ON LINKS TO TRIGGER THE CURSOR ANIMATION
        for (const _link of this.$links)
        {
            _link.addEventListener('mouseover', () =>
            {
                this.linksHoverTimeLine.restart()
            })
            _link.addEventListener('mouseleave', () =>
            {
                this.linksHoverTimeLine.reverse()
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

    // DEFINE THE GSAP CURSOR ANIMATION
    setHoverEffect()
    {
        // ON IMAGES
        this.imagesHoverTimeLine.to(this.$dot, 0.3, { width: 30, height: 30})
        // ON LINKS
        this.linksHoverTimeLine.to(this.$dot, 0.3, { width: 30, height: 30, backgroundColor: 'rgba(255, 255, 255, 0)'})
    },

    setupCursorEffectOnVideo()
    {
        let cursorIsAfk = false
        let cursorTempPos = {x: null, y: null}

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

        window.addEventListener('mousemove', () =>
        {
            // Make appear the time bar and the cursor if it is moving
            if (cursorIsAfk == true)
            {
                cursorIsAfk = false
                gsap.to(videoSupport.$timeBar, 0.7, {opacity: 1})
                gsap.to(this.$cursor, 0.7, {opacity: 1})
            }

            // Update cross cursor position
            this.$cross.style.transform = `translate(calc(${this.position.x}px), calc(${this.position.y}px))`
        })
    },

    displayCross()
    {
        gsap.to(this.$crossA, 0.4, {scaleX: 1})
        gsap.to(this.$crossB, 0.4, {scaleX: 1})
    },

    vanishCross()
    {
        gsap.to(this.$crossA, 0.2, {scaleX: 0.01, ease: Power2.easeIn})
        gsap.to(this.$crossB, 0.2, {scaleX: 0.01, ease: Power2.easeIn})
    }
}
cursor.setup()
