function lerp (start, end, ratio)
{
	return start * (1 - ratio) + ratio * end
}

let names

let smoothScroll = 
{
	// DOM
	$body : document.querySelector('body'),
	$content : document.querySelector('.menuContainer'),
	$img : document.querySelector('.centerContainer img'),
	$blackBlocs : document.querySelectorAll('.blackBloc'),
	$fillNamesContainer : document.querySelector('.fillNamesContainer'),
	$strokeNamesContainer : document.querySelector('.strokeNamesContainer'),

	contentHeight : null,
	contentMarginTop : null,
	contentMarginBottom : null,
	scrollValue : null,
	scrollValueWithLerp : null,

	// PARAMETERS
	sizeBetweenImagesRatio : 0.20,
	scrollSpeedRatio : 2,

	setup()
	{
		this.setContentSize()
		this.setScrollEvent()
		this.setLerpInterval()
		this.setResizeEvent()

		names = [new Name('Yannick Saillet', 0), new Name('Christophe Rihet', 1), new Name('Eleonore Wismes', 2), new Name('Mathieu Juric', 3), new Name('Odieux Boby', 4)]
		setNamesScrollEvent()
	},

	setContentSize()
	{
		// SETTING MARGINS AND SIZES OF BLACKBLOCS TO PUT IMAGES AT THE CENTER OF THE VIEW
		this.contentMarginTop = (window.innerHeight - this.$img.getBoundingClientRect().height) * 0.5
		this.contentMarginBottom = (window.innerHeight - this.$img.getBoundingClientRect().height) * 0.5
		this.$content.style.marginTop = `${this.contentMarginTop}px`
		this.$content.style.marginBottom = `${this.contentMarginBottom}px`
		
		for (const _element of this.$blackBlocs)
		{
			_element.style.height = `${(window.innerHeight - this.$img.getBoundingClientRect().height) * this.sizeBetweenImagesRatio}px`
		}


		// MAKE THE BODY AS LONG AS THE CONTENT TO PERMIT THE SCROLL
		this.contentHeight = this.$content.getBoundingClientRect().height
		this.$body.style.height = `${(this.contentHeight + this.contentMarginTop + this.contentMarginBottom - window.innerHeight) * this.scrollSpeedRatio + window.innerHeight}px`
	},

	setScrollEvent()
	{
		// GET THE VALUE OF THE SCROLL
		window.addEventListener('scroll', (_mouse) =>
		{
			this.scrollValue = window.pageYOffset
		})

		// SCROLL TOP WHEN REFRESHING
		window.onbeforeunload = function ()
		{
			window.scrollTo(0, 0)
		}
	},

	setLerpInterval()
	{
		setInterval(() =>
		{
			// TRANSLATING BY THE SCROLL VALUE AFTER APPLY A LERP EFFECT
			this.scrollValueWithLerp = lerp(this.scrollValueWithLerp, this.scrollValue, 0.2)
			this.$content.style.transform = `translateY(${-this.scrollValueWithLerp / this.scrollSpeedRatio}px)`
			
			// TRANSLATING NAMES TO SIMULATE A POSITION FIXED
			this.$fillNamesContainer.style.transform = `translateY(${this.scrollValueWithLerp / this.scrollSpeedRatio - this.contentMarginTop}px)`
			this.$strokeNamesContainer.style.transform = `translateY(${this.scrollValueWithLerp / this.scrollSpeedRatio - this.contentMarginTop}px)`
		}, 1000 / 60)
	},

	setResizeEvent()
	{
		// UPDATE CONTENT SIZE WHEN WINDOW RESIZE FOR RESPONSIVE
		window.addEventListener('resize', () =>
		{
			this.setContentSize()
		})
	}
}
smoothScroll.setup()

function setNamesScrollEvent()
{
	window.addEventListener('scroll', () =>
	{
		for (const _element of names)
		{
			if(_element.yOrigin < window.pageYOffset + window.innerHeight * 1.5 && _element.yOrigin > window.pageYOffset - window.innerHeight * 1.5)
			{
				// console.log(_element)
				// TRANSLATE EACH LETTER ACCORDING TO THE SCROLL BUT WITH OUR LITTLE RANDOM GAP
				for (let i = 0; i < _element.strokeSpanList.length; i++)
				{
					_element.strokeSpanList[i].style.transform = `translateY(${(window.pageYOffset - _element.yOrigin) * _element.randomGapList[i] / smoothScroll.scrollSpeedRatio}px)`
					_element.strokeSpanList[i].style.opacity = Math.abs(_element.vanishDistance / (window.pageYOffset - _element.yOrigin))
				}
				for (let i = 0; i < _element.fillSpanList.length; i++)
				{
					_element.fillSpanList[i].style.transform = `translateY(${(window.pageYOffset - _element.yOrigin) * _element.randomGapList[i] / smoothScroll.scrollSpeedRatio}px)`
					// _element.fillSpanList[i].style.opacity = Math.abs(_element.vanishDistance / (window.pageYOffset - _element.yOrigin))
				}
			}
		}
	})
}
