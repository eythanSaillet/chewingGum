let menu =
{
    $blackBlocs : document.querySelectorAll('.blackBloc'),
    $referenceImg : document.querySelector('.centerContainer img'),

    setup()
    {
        this.setContentSize()
        this.setResizeEvent()
    },

    setContentSize()
    {
        for (const _element of this.$blackBlocs)
        {
            _element.style.height = `${(window.innerHeight - this.$referenceImg.getBoundingClientRect().height) * 0.5}px`
        }
    },

    setResizeEvent()
    {
        window.addEventListener('resize', () =>
        {
            this.setContentSize()
        })
    },
}
menu.setup()






// function lerp (start, end, ratio){
//     return start * (1 - ratio) + ratio * end
//   }

// let smoothScroll = 
// {
//     $body : document.querySelector('body'),
//     $content : document.querySelector('.menuContainer'),
//     $img : document.querySelector('.centerContainer img'),
//     $blackBlocs : document.querySelectorAll('.blackBloc'),

//     contentHeight : null,
//     scrollValue : null,
//     scrollValueWithLerp : null,
//     actualImage : 0,
//     isAttracted : false,
//     lerpRatio : 0.2,

//     setup()
//     {
//         this.setContentSize()
//         this.setScrollEvent()
//         this.setLerpInterval()
//         this.setResizeEvent()
//         this.setScrollMagnetInterval()
//     },

//     setContentSize()
//     {
//         // SETTING MARGINS AND SIZES OF BLACKBLOCS TO PUT IMAGES AT THE CENTER OF THE VIEW
//         this.$content.style.marginTop = `${(window.innerHeight - this.$img.getBoundingClientRect().height) * 0.5}px`
//         this.$content.style.marginBottom = `${(window.innerHeight - this.$img.getBoundingClientRect().height) * 0.5}px`
        
//         for (const _element of this.$blackBlocs)
//         {
//             _element.style.height = `${window.innerHeight - this.$img.getBoundingClientRect().height}px`
//         }


//         // MAKE THE BODY AS LONG AS THE CONTENT TO PERMIT THE SCROLL
//         this.contentHeight = this.$content.getBoundingClientRect().height
//         this.$body.style.height = `${this.contentHeight + this.$blackBlocs[0].getBoundingClientRect().height}px`
//     },

//     setScrollEvent()
//     {
//         // GET THE VALUE OF THE SCROLL
//         window.addEventListener('scroll', (_mouse) =>
//         {
//             if(window.pageYOffset != this.scrollValue)
//             {
//                 this.isAttracted = false
//                 this.lerpRatio = 0.2
//             }
//             this.scrollValue = window.pageYOffset

//             this.actualImage = Math.ceil(this.scrollValue / window.innerHeight - 0.5)
//         })
//     },

//     setScrollMagnetInterval()
//     {
//         let lastScrollValue
//         setInterval(() =>
//         {
//             this.lerpRatio = 0.05
//             if(lastScrollValue == this.scrollValue && this.isAttracted == false)
//             {
//                 this.isAttracted = true
//                 this.scrollValue = this.actualImage * window.innerHeight
//                 window.scroll(0, this.scrollValue)
//             }
//             lastScrollValue = this.scrollValue
//         }, 100)
//     },

//     setLerpInterval()
//     {
//         setInterval(() =>
//         {
//             // TRANSLATING BY THE SCROLL VALUE AFTER APPLY A LERP EFFECT
//             this.scrollValueWithLerp = lerp(this.scrollValueWithLerp, this.scrollValue, this.lerpRatio)
//             this.$content.style.transform = `translateY(${-this.scrollValueWithLerp}px)`
//         }, 1000 / 60)
//     },

//     setResizeEvent()
//     {
//         window.addEventListener('resize', () =>
//         {
//             this.setContentSize()
//         })
//     }
// }
// // smoothScroll.setup()