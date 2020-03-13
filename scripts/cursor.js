let cursor =
{
    // DOM
    $cursor : document.querySelector('.cursorContainer'),
    $dot : document.querySelector('.cursorContainer .dot'),
    $circle : document.querySelector('.cursorContainer .circle'),
    $text : document.querySelector('.cursorContainer .text'),
    $images : document.querySelectorAll('.centerContainer img'),

    // VALUES
    mousePos : {x: -150, y: -150},
    mousePosWithLerp : {x: -150, y: -150},

    // TIMELINE ANIMATION
    linkHoverTimeLine : gsap.timeline({paused: true}),

    setup()
    {
        this.setMouseEvent()
        this.setLinkHoverTimeline()
    },

    setMouseEvent()
    {
        window.addEventListener('mousemove', (_event) =>
        {
            // UPDATE MOUSE POS VALUE
            this.mousePos = {x: _event.clientX, y: _event.clientY}

            // UPDATE DOT CURSOR POS
            this.$dot.style.left = `${this.mousePos.x}px`
            this.$dot.style.top = `${this.mousePos.y}px`

            // UPDATE TEXT CURSOR POS
            this.$text.style.left = `${this.mousePos.x}px`
            this.$text.style.top = `${this.mousePos.y}px`
        })

        for (const _image of this.$images)
        {
            _image.addEventListener('mouseover', () =>
            {
                console.log('on')
                this.linkHoverTimeLine.restart()
            })
            _image.addEventListener('mouseleave', () =>
            {
                console.log('leave')
                this.linkHoverTimeLine.reverse(0.3)
            })
        }

        window.addEventListener('mouseout', () =>
        {
            gsap.to(this.$cursor, 0.5, {opacity: 0})
        })
        window.addEventListener('mouseover', () =>
        {
            gsap.to(this.$cursor, 0.5, {opacity: 1})
        })
    },

    setLinkHoverTimeline()
    {
        this.linkHoverTimeLine.to(this.$circle, 0.3, {opacity: 0, width: 100, height: 100})
            .to(this.$dot, 0.3, { width: 80, height: 80, backgroundColor: 'rgba(255, 255, 255, 0)', delay: -0.3})
            .to(this.$text, 0.3, { opacity: 1, delay: -0.2})
    }
}
cursor.setup()