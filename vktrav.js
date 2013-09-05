window.vktrav = {
	Traverser: function(requester) {
		this.friends = []
		this.links = {}
		this.queue = []
		this.queued_ids = {}
		this.requester = requester
	}
}

window.vktrav.Traverser.prototype.enqueue = function(id, levels) {
	this.queue.push({
		id: id,
		levels: levels
	})
	this.queued_ids[id] = true
}

window.vktrav.Traverser.prototype.next = function() {
	var request = this.queue.shift()
	this.queued_ids[request.id] = undefined
	if (request === undefined) {
		return false;
	}

	var nonleaf = levels>0
	this.requester(id, nonleaf, function(items) {
		if (nonleaf) {
			this.friends = items.concat(this.queue)
		}
		this.links[request.id] = _.map(items, function(i) {return i.id})

		if (nonleaf) {
			_.each(items, function(item) {
				if (!this.queued_ids[item.id] && !this.links[item.id]) {
					this.enqueue(item.id, request.levels-1)
				}
			})
		}
	})
	return true;
}