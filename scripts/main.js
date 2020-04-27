function lerp(start, end, ratio) {
	return start * (1 - ratio) + ratio * end
}

// Get config.sjon
window
	.fetch('../scripts/config.json')
	.then((_response) => _response.json())
	.then((_config) => {
		console.log(_config)
	})
