class Name
{
    constructor(name, rank)
    {
        this.name = name
        this.yOrigin = (smoothScroll.$img.getBoundingClientRect().height + smoothScroll.$blackBlocs[0].getBoundingClientRect().height * 2) * smoothScroll.scrollSpeedRatio * rank

        // DOM
        this.$strokeNamesContainer = document.querySelector('.strokeNamesContainer .names')
        this.$fillNamesContainer = document.querySelector('.fillNamesContainer .names')
        this.$correspondingImage = document.querySelectorAll('.centerContainer img')[rank]
        
        this.strokeSpanList = []
        this.fillSpanList = []
        this.letterReferenceHeight = null,

        this.randomGapList = []
        this.vanishDistance = smoothScroll.$img.getBoundingClientRect().height / 4

        this.createDom()
        this.createRandomGap()
        this.initPosition()
    }

    createDom()
    {
        // STROKE
        let $strokeDiv = document.createElement('div')
        $strokeDiv.classList.add(this.name.replace(/\s+/g, ''))
        let $strokeSpanContainer = document.createElement('span')
        $strokeSpanContainer.classList.add('stroke')
        $strokeSpanContainer.classList.add('nameSpanContainer')
        for (const _letter of this.name)
        {
            let $spanLetter = document.createElement('span')
            $spanLetter.innerHTML = _letter.toUpperCase()
            $strokeSpanContainer.appendChild($spanLetter)
            this.strokeSpanList.push($spanLetter)
        }
        $strokeDiv.appendChild($strokeSpanContainer)
        this.$strokeNamesContainer.appendChild($strokeDiv)


        // FILL
        let $fillDiv = document.createElement('div')
        $fillDiv.classList.add(this.name.replace(/\s+/g, ''))
        let $fillSpanContainer = document.createElement('span')
        $fillSpanContainer.classList.add('fill')
        $fillSpanContainer.classList.add('nameSpanContainer')
        for (const _letter of this.name)
        {
            let $spanLetter = document.createElement('span')
            $spanLetter.innerHTML = _letter.toUpperCase()
            $fillSpanContainer.appendChild($spanLetter)
            this.fillSpanList.push($spanLetter)
        }
        $fillDiv.appendChild($fillSpanContainer)
        this.$fillNamesContainer.appendChild($fillDiv)

        this.letterReferenceHeight = this.fillSpanList[0].getBoundingClientRect().height
    }

    initPosition()
    {
        for (let i = 0; i < this.strokeSpanList.length; i++)
        {
            this.strokeSpanList[i].style.transform = `translateY(${this.yOrigin}px)`
        }
        for (let i = 0; i < this.fillSpanList.length; i++)
        {
            this.fillSpanList[i].style.transform = `translateY(${this.yOrigin}px)`
        }
    }

    createRandomGap()
    {
        // CREATE RANDOM GAP FOR EACH LETTERS
        for (let i = 0; i < this.name.length; i++)
        {
            this.randomGapList.push(Math.random() + 1)
        }
    }
}