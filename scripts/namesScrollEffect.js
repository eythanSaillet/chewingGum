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

function setNamesScrollEvent()
{
	window.addEventListener('scroll', () =>
	{
		for (const _name of names)
		{
			if(_name.yOrigin < window.pageYOffset + window.innerHeight * 1.3 && _name.yOrigin > window.pageYOffset - window.innerHeight * 1.3)
			{
				// TRANSLATE EACH LETTER ACCORDING TO THE SCROLL BUT WITH OUR LITTLE RANDOM GAP

				// STROKE LETTERS
				for (let i = 0; i < _name.strokeSpanList.length; i++)
				{
					_name.strokeSpanList[i].style.transform = `translateY(${(window.pageYOffset - _name.yOrigin) * _name.randomGapList[i] / smoothScroll.scrollSpeedRatio}px)`
					_name.strokeSpanList[i].style.opacity = Math.pow(Math.abs(_name.vanishDistance / (window.pageYOffset - _name.yOrigin)), 1.7)
				}
				// FILLED LETTERS
				for (let i = 0; i < _name.fillSpanList.length; i++)
				{
					let translateValue = (window.pageYOffset - _name.yOrigin) * _name.randomGapList[i] / smoothScroll.scrollSpeedRatio
					_name.fillSpanList[i].style.transform = `translateY(${translateValue}px)`
					if(translateValue > smoothScroll.imgHeight / 2 - smoothScroll.scrollValue + _name.yOrigin + _name.letterReferenceHeight + _name.randomGapList[i] * _name.letterReferenceHeight * 0.2 || translateValue < - smoothScroll.imgHeight / 2 - smoothScroll.scrollValue + _name.yOrigin - _name.letterReferenceHeight - _name.randomGapList[i] * _name.letterReferenceHeight * 0.2)
					{
						_name.fillSpanList[i].style.opacity = 0
					}
					else
					{
						_name.fillSpanList[i].style.opacity = 1
					}
				}
			}
		}
	})
}