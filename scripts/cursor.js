function lerp (start, end, ratio)
{
	return start * (1 - ratio) + ratio * end
}

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
        this.setLerpInterval()
        this.setLinkHoverEffect()
    },

    setMouseEvent()
    {
        window.addEventListener('mousemove', (_event) =>
        {
            // UPDATE MOUSE POS VALUE
            this.mousePos = {x: _event.clientX, y: _event.clientY}

            // UPDATE DOT CURSOR POS
            this.$dot.style.transform = `translate(calc(-50% + ${this.mousePos.x}px), calc(-50% + ${this.mousePos.y}px))`

            // UPDATE TEXT CURSOR POS
            this.$text.style.transform = `translate(calc(-50% + ${this.mousePos.x}px), calc(-50% + ${this.mousePos.y}px))`
        })

        // ADD EVENT ON IMAGES TO TRIGGER THE CURSOR ANIMATION
        for (const _image of this.$images)
        {
            _image.addEventListener('mouseover', () =>
            {
                this.linkHoverTimeLine.restart()
            })
            _image.addEventListener('mouseleave', () =>
            {
                this.linkHoverTimeLine.reverse(0.3)
            })
        }

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

    setLerpInterval()
    {
        window.setInterval(() =>
        {
            // APPLY LERP ON CURSOR POS
            this.mousePosWithLerp.x = lerp(this.mousePosWithLerp.x, this.mousePos.x, 0.15)
            this.mousePosWithLerp.y = lerp(this.mousePosWithLerp.y, this.mousePos.y, 0.15)
            // UPDATE CIRCLE CURSOR POS
            this.$circle.style.transform = `translate(calc(-50% + ${this.mousePosWithLerp.x}px), calc(-50% + ${this.mousePosWithLerp.y}px))`
        }, 1000 / 60)
    },

    // DEFINE THE GSAP CURSOR ANIMATION
    setLinkHoverEffect()
    {
        this.linkHoverTimeLine.to(this.$circle, 0.3, {opacity: 0, width: 100, height: 100})
            .to(this.$dot, 0.3, { width: 80, height: 80, backgroundColor: 'rgba(255, 255, 255, 0)', delay: -0.3})
            .to(this.$text, 0.3, { opacity: 1, delay: -0.2})
    }
}
cursor.setup()
