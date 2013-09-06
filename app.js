
window.vk_graph_export = {}
window.vk_graph_export.Model = function() {
	var self = this
	this.current_user_id = ko.observable()
	this.stage = ko.observable("waiting")
	this.starting_user_id = ko.observable()
	this.depth = ko.observable(1)
	this.do_not_include_me = ko.observable(true)

	this.is_fake_vk = ko.observable(false)

	this.num_users_in_queue = ko.observable(0)
	this.num_users_completed = ko.observable(0)

	this.delay_between_requests = ko.observable(1000)
	this.data = ko.observable(null)
	this.graph = ko.computed(function(){
		if (self.data() !== null) {
			var exclude = self.do_not_include_me() ? [ self.starting_user_id() ] : []
			return vk.to_graph(self.data().friends, self.data().links, exclude)
		}
	})

	this.num_users_in_graph = ko.computed(function() {
		if (self.graph() !== undefined) {
			return self.graph().nodes.length;
		}
	})

	this.download_data_url = ko.computed(function() {
		var utf8_to_b64 = function(str) {
		    return window.btoa(unescape(encodeURIComponent( str )));
		}

		if (self.graph() !== undefined) {
			var graph = self.graph()
			var gexf = format_to_gexf(graph.nodes, graph.edges, graph.attribute_conf)
			return "data:application/gexf+xml;charset=utf-8;base64,"+utf8_to_b64(gexf)
		} else {
			return ""
		}
	})
	this.download_filename = ko.computed(function() {
		return "lolka.gexf";
	})

	this.resetStartingUserToMe = function() {
		this.starting_user_id(this.current_user_id())
	}

	this.start = function() {
		var trav = new vk.Traverser(this.requester)
		trav.enqueue(self.starting_user_id(), self.depth())
		var onNext = function() {
			if (!trav.isCompleted()) {
				self.num_users_in_queue(trav.queue.length)
				self.num_users_completed(_.keys(trav.links).length)
				setTimeout(function() {trav.next(onNext)}, self.delay_between_requests())
			} else {
				self.data({
					friends: trav.friends, 
					links: trav.links
				})
				self.stage("completed")
			}
		}
		trav.next(onNext)
		this.stage("loading")
	}

	this.cancel = function() {
		this.stage("ready")
	}

	this.reset = function() {
		this.stage("ready")
	}

	this.requester = window.vk.requester

	this.vk_init_completed = function() {
		this.stage("ready")
		console.log("vk init completed")
		var m = window.location.href.match(/.*viewer_id=(\d+).*/)
		if (m !== null && m[1] !== undefined) {
			this.current_user_id(m[1])
		} else {
			this.current_user_id(_.random(1, 100))
			this.is_fake_vk(true)

			var fake_api = new vk.FakeAPI()
			this.requester = function(id, is_detailed, on_result) {
				var friends = fake_api.getFriends(id, is_detailed)
				on_result(friends)
			}
		}
		this.starting_user_id(this.current_user_id())
	}
}