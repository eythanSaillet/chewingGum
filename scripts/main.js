function lerp (start, end, ratio){
    return start * (1 - ratio) + ratio * end
  }

let smoothScroll = 
{
    $body : document.querySelector('body'),
    $content : document.querySelector('.imagesContainer .centerContainer'),
    $img : document.querySelector('.centerContainer img'),
    $blackBlocs : document.querySelectorAll('.blackBloc'),

    contentHeight : null,
    scrollValue : null,
    scrollValueWithLerp : null,

    setup()
    {
        // this.contentHeight = this.$content.getBoundingClientRect().height
        // this.$body.style.height = `${this.contentHeight}px`


        // SETTING MARGINS AND SIZES OF BLACKBLOCS TO PUT IMAGES AT THE CENTER OF THE VIEW
        this.$content.style.marginTop = `${(window.innerHeight - this.$img.getBoundingClientRect().height) * 0.5}px`
        this.$content.style.marginBottom = `${(window.innerHeight - this.$img.getBoundingClientRect().height) * 0.5}px`

        for (const _element of this.$blackBlocs)
        {
            _element.style.height = `${window.innerHeight - this.$img.getBoundingClientRect().height}px`
        }

        // this.setScrollEvent()
        // this.setLerpInterval()
        // this.setResizeEvent()
    },

    setScrollEvent()
    {
        window.addEventListener('scroll', (_mouse) =>
        {
            // console.log(_mouse)
            this.scrollValue = window.pageYOffset
        })
    },

    setLerpInterval()
    {
        setInterval(() =>
        {
            this.scrollValueWithLerp = lerp(this.scrollValueWithLerp, this.scrollValue, 0.2)
            this.$content.style.transform = `translateY(${-this.scrollValueWithLerp}px)`
        }, 1000 / 60)
    },

    setResizeEvent()
    {
        window.addEventListener('resize', () =>
        {
            // this.contentHeight = this.$content.getBoundingClientRect().height
            // this.$body.style.height = `${this.contentHeight}px`

            // SETTING MARGINS AND SIZES OF BLACKBLOCS TO PUT IMAGES AT THE CENTER OF THE VIEW
            this.$content.style.marginTop = `${(window.innerHeight - this.$img.getBoundingClientRect().height) * 0.5}px`
            this.$content.style.marginBottom = `${(window.innerHeight - this.$img.getBoundingClientRect().height) * 0.5}px`

            for (const _element of this.$blackBlocs)
            {
                _element.style.height = `${window.innerHeight - this.$img.getBoundingClientRect().height}px`
            }
        })
    }
}
smoothScroll.setup()