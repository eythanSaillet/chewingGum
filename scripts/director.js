let director = null

// Get config.sjon
window
    .fetch('../scripts/config.json')
    .then(_response => _response.json()) 
    .then(_config => 
    {
        console.log(_config)

        // Get url index
        const splitUrl = window.location.href.split('#')
        const urlIndex = splitUrl[splitUrl.length - 1]
        console.log(urlIndex)

        // Get the object in the config that correspond to the index
        for (const _director of _config)
        {
            if (_director.index == urlIndex)
            {
                // Define the director from the config
                director = _director
                console.log(director)

                // Setup flashlight effect with the director's name
                flashLightEffect.setup()
            }
        }
    })


let flashLightEffect =
{
    $flashLight : document.querySelector('.nameContainer h1'),

    windowSizes : {},
    mousePosRatio : {},

    setup()
    {
        cursor.setFlashLightLerpInterval()

        this.setupName()
        this.windowSizes = {width: window.innerWidth, height: window.innerHeight}
        this.resizeEvent()
    },

    setupName()
    {
        console.log(director.name.toUpperCase())
        document.querySelector('.nameContainer h1').innerHTML = director.name.toUpperCase()
    },

    posUpdate()
    {
        // Update flashlight only if it his in the viewport
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