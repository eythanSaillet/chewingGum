class Name
{
    constructor(name, yOrigin)
    {
        this.name = name

        this.strokeSpanList = document.querySelectorAll('.strokeNamesContainer .nameSpanContainer span')
        this.fillSpanList = document.querySelectorAll('.fillNamesContainer .nameSpanContainer span')
        console.log(this.strokeSpanList, this.fillSpanList)

        this.yOrigin = yOrigin
        this.randomGapList = []
        this.vanishDistance = smoothScroll.$img.getBoundingClientRect().height / 3

        this.setScrollEvent()
    }

    createDom()
    {

    }

    setScrollEvent()
    {
        // CREATE RANDOM GAP FOR EACH LETTERS
        for (let i = 0; i < this.name.length; i++)
        {
            this.randomGapList.push(Math.random() + 1)
        }


        window.addEventListener('scroll', () =>
        {
            for (let i = 0; i < this.strokeSpanList.length; i++)
            {
                this.strokeSpanList[i].style.transform = `translateY(${(window.pageYOffset - this.yOrigin) * this.randomGapList[i] / smoothScroll.scrollSpeedRatio}px)`
                console.log(this.vanishDistance / (window.pageYOffset - this.yOrigin))
                this.strokeSpanList[i].style.opacity = Math.abs(this.vanishDistance / (window.pageYOffset - this.yOrigin))
            }
            for (let i = 0; i < this.fillSpanList.length; i++)
            {
                this.fillSpanList[i].style.transform = `translateY(${(window.pageYOffset - this.yOrigin) * this.randomGapList[i] / smoothScroll.scrollSpeedRatio}px)`
            }
        })
    }
}