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
        this.mousePosRatio = {x: cursor.mousePosWithLerp.x / window.innerWidth - 0.5, y: cursor.mousePosWithLerp.y / window.innerHeight - 0.5}
        this.$flashLight.style.backgroundPosition = `${this.mousePosRatio.x * this.windowSizes.width}px ${this.mousePosRatio.y * this.windowSizes.height}px`
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
