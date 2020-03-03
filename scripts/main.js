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
menu.setup()