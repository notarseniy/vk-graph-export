window.vk = {}

window.vk.Traverser = function(requester) {
	this.friends = []
	this.links = {}
	this.queue = []
	this.queued_ids = {}
	this.requester = requester
}

window.vk.Traverser.prototype.enqueue = function(id, levels) {
	this.queue.push({
		id: id,
		levels: levels
	})
	this.queued_ids[id] = true
}

window.vk.Traverser.prototype.next = function(onComplete) {
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

window.vk.Traverser.prototype.isCompleted = function() {
	return !this.queue.length;
}

window.vk.attributes = [
	{id: 0, title: 'first_name', type: 'string'},
	{id: 1, title: 'last_name', type: 'string'},
	{id: 2, title: 'nickname', type: 'string'},
	{id: 3, title: 'screen_name', type: 'string'},
	{id: 4, title: 'sex', type: 'integer'},
	{id: 5, title: 'photo_50', type: 'string'},
	{id: 6, title: 'relation', type: 'integer'},
	{id: 7, title: 'country', type: 'integer'},
	{id: 8, title: 'city', type: 'integer'},
	{id: 9, title: 'bdate', type: 'string'},
	{id: 10, title: 'timezone', type: 'integer'}
]

window.vk.to_graph = function(friends, links, exclude_ids) {
	var friends_filtered = _.filter(friends, function(f) {return !_.contains(exclude_ids, f.id)})
	var nodes = _.map(friends_filtered, function(f) {
		return {
			id: f.id,
			label: f.first_name + " " + f.last_name,
			attrs: {
				first_name: f.first_name,
				last_name: f.last_name,
				nickname: f.nickname,
				screen_name: f.screen_name,
				sex: f.sex,
				photo_50: f.photo_50,
				relation: f.relation,
				country: f.country,
				city: f.city,
				bdate: f.bdate,
				timezone: f.timezone
			}
		}
	})

	var node_ids = _.object(_.map(nodes, function(n) {return [n.id, true]}))

	var edges = []

	var edge_id = 0
	_.each(links, function(targets, source) {
		if (node_ids[source] !== undefined) {
			_.each(_.filter(targets, function(id) {return node_ids[id] !== undefined}), function(target) {
				edge_id++
				edges.push({
					id: edge_id,
					source: source,
					target: target
				})
			})
		}
	})

	return {
		nodes: nodes,
		edges: edges,
		attribute_conf: window.vk.attributes
	}
}