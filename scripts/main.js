let menu =
{
    $blackBlocs : document.querySelectorAll('.blackBloc'),
    $referenceImg : null,
    $images : document.querySelectorAll('.centerContainer img'),

    setup()
    {
        this.setContentSize()
        this.setResizeEvent()
    },

    setContentSize()
    {
        for (const _element of this.$blackBlocs)
        {
            _element.style.height = `${(window.innerHeight * 0.60 - this.$referenceImg.getBoundingClientRect().height) * 0.5}px`
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

// menu.$referenceImg.addEventListener('load', () =>
// {
//     menu.setup()
//     console.log('hey')
// })

// Question BIZARRE
for (const _image of menu.$images)
{
    let counter = 0
    _image.onload = function()
    {
        if(counter == 0)
        {
            menu.$referenceImg = _image
            menu.setup()
            console.log('counter')
            counter++
        }
    }
}