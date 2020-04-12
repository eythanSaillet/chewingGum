let director = null

// Get config.sjon
window
    .fetch('../scripts/config.json')
    .then(_response => _response.json()) 
    .then(_config => 
    {
        // Get url index
        const splitUrl = window.location.href.split('#')
        const urlIndex = splitUrl[splitUrl.length - 1]

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

// Object that contains sizes of the window and actualize on window resize
let windowSizes =
{
    width: window.innerWidth,
    height: window.innerHeight,

    setResizeEvent()
    {
        window.addEventListener('resize', () =>
        {
            this.width = window.innerWidth,
            this.height = window.innerHeight
        })
    }
}
windowSizes.setResizeEvent()


let flashLightEffect =
{
    $flashLight : document.querySelector('.nameContainer h1'),

    mousePosRatio : {},

    setup()
    {
        cursor.setFlashLightLerpInterval()

        this.setupName()
    },

    setupName()
    {
        document.querySelector('.nameContainer h1').innerHTML = director.name.toUpperCase()
    },

    posUpdate()
    {
        // Update flashlight only if it his in the viewport
        if (window.pageYOffset < windowSizes.height)
        {
            this.mousePosRatio = {x: cursor.mousePosWithLerp.x / window.innerWidth - 0.5, y: (cursor.mousePosWithLerp.y + window.pageYOffset) / window.innerHeight - 0.5}
            this.$flashLight.style.backgroundPosition = `${this.mousePosRatio.x * windowSizes.width}px ${this.mousePosRatio.y * windowSizes.height}px`
        }
    }
}

let scrollDisplay =
{
    sections: [],

    setup()
    {
        this.setupSectionsArray()
        this.setupScrollEvent()
    },

    setupSectionsArray()
    {
        let $sections = document.querySelectorAll('.works section')
        for (const _$section of $sections)
        {
            let section = {}
            section.dom = _$section
            section.state = false
            this.sections.push(section)
        }
    },

    setupScrollEvent()
    {
        window.addEventListener('scroll', () =>
        {
            for (_section of this.sections)
            {
                // Test if the section is in view and if this is the first time
                if (_section.dom.getBoundingClientRect().top - window.innerHeight * 0.70 < 0 && _section.state == false)
                {
                    // Update its state
                    _section.state = true

                    // Animate opacity and translate of the video
                    gsap.to(_section.dom.querySelector('.video'), 0.7, {x: '0vw', opacity: 1})

                    // Animate opacity of infos
                    gsap.from([_section.dom.querySelector('.infoStroke .title'), _section.dom.querySelector('.infoFill .title')], 0.2, {opacity: 0, delay: 0.5})
                    gsap.from([_section.dom.querySelector('.infoStroke .artistName'), _section.dom.querySelector('.infoStroke .artistName')], 0.2, {opacity: 0, delay: 0.7})

                    // Animate translate of the infos according to alignement
                    if (_section.dom.classList.contains('alignRight'))
                    {
                        gsap.from([_section.dom.querySelector('.infoStroke .title'), _section.dom.querySelector('.infoFill .title')], 0.5, {x:'10vw', delay: 0.5})
                        gsap.from([_section.dom.querySelector('.infoStroke .artistName'), _section.dom.querySelector('.infoFill .artistName')], 0.5, {x:'10vw', delay: 0.7})
                    }
                    else if(_section.dom.classList.contains('alignLeft'))
                    {
                        gsap.from([_section.dom.querySelector('.infoStroke .title'), _section.dom.querySelector('.infoFill .title')], 0.5, {x:'-10vw', delay: 0.5})
                        gsap.from([_section.dom.querySelector('.infoStroke .artistName'), _section.dom.querySelector('.infoFill .artistName')], 0.5, {x:'-10vw', delay: 0.7})
                    }
                }
            }
        })
    }
}
scrollDisplay.setup()

let scroller =
{
    $scrollerContainer : document.querySelector('.nameContainer .scrollerContainer'),
    $scrollerBar : document.querySelector('.nameContainer .scrollerContainer .scroller .scrollerBar'),

    setup()
    {
        this.setupAnimation()
        this.setupVanishEffect()
    },

    setupAnimation()
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