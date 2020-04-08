cursor.setFlashLightLerpInterval()

let flashLightEffect =
{
    $flashLight : document.querySelector('.nameContainer h1'),

    windowSizes : {},
    mousePosRatio : {},

    setup()
    {
        this.windowSizes = {width: window.innerWidth, height: window.innerHeight}
        this.resizeEvent()
    },

    posUpdate()
    {
        // Update flashlight only if it his in the view
        if (window.pageYOffset < this.windowSizes.height)
        {
            this.mousePosRatio = {x: cursor.mousePosWithLerp.x / window.innerWidth - 0.5, y: (cursor.mousePosWithLerp.y + window.pageYOffset) / window.innerHeight - 0.5}
            this.$flashLight.style.backgroundPosition = `${this.mousePosRatio.x * this.windowSizes.width}px ${this.mousePosRatio.y * this.windowSizes.height}px`
        }
    },

    resizeEvent()
    {
        window.addEventListener('resize', () =>
        {
            this.windowSizes = {width: window.innerWidth, height: window.innerHeight}
        })
    },
}
flashLightEffect.setup()

let scroller =
{
    $scrollerContainer : document.querySelector('.nameContainer .scrollerContainer'),
    $scrollerBar : document.querySelector('.nameContainer .scrollerContainer .scroller .scrollerBar'),

    setup()
    {
        this.setupTimeline()
        this.setupVanishEffect()
    },

    setupTimeline()
    {
        let timeline = new gsap.timeline({repeat: -1, repeatDelay: 0.5})
        timeline.to(this.$scrollerBar, 0.5, {y: '-100%', ease: Power2.easeIn})
        timeline.to(this.$scrollerBar, 0, {y: '100%', delay: 0.1})
        timeline.to(this.$scrollerBar, 0.5, {y: '0%', ease: Power2.easeOut})
    },

    setupVanishEffect()
    {
        window.addEventListener('scroll', () =>
        {
            window.pageYOffset == 0 ? gsap.to(this.$scrollerContainer, 0.5, {opacity: 1}) : gsap.to(this.$scrollerContainer, 0.5, {opacity: 0})
        })
    }
}
scroller.setup()