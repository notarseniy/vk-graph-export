window.vktrav = {}

window.vktrav.Traverser = function(requester) {
	this.friends = []
	this.links = {}
	this.queue = []
	this.queued_ids = {}
	this.requester = requester
}

window.vktrav.Traverser.prototype.enqueue = function(id, levels) {
	this.queue.push({
		id: id,
		levels: levels
	})
	this.queued_ids[id] = true
}

window.vktrav.Traverser.prototype.next = function(onComplete) {
	var request = this.queue.shift()
	this.queued_ids[request.id] = undefined
	if (request === undefined) {
		return false;
	}

	var nonleaf = request.levels>0
	var z = this
	this.requester(request.id, nonleaf, function(items) {
		if (nonleaf) {
			z.friends = _.uniq(items.concat(z.friends), function(f) {return f.id})
		}
		z.links[request.id] = _.map(items, function(i) {return i.id})

		if (nonleaf) {
			_.each(items, function(item) {
				if (!z.queued_ids[item.id] && !z.links[item.id]) {
					z.enqueue(item.id, request.levels-1)
				}
			})
		}
	})
	onComplete();
	return true;
}

window.vktrav.Traverser.prototype.isCompleted = function() {
	return !this.queue.length;
}
