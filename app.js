
window.vk_graph_export = {}
window.vk_graph_export.Model = function() {
	this.current_user_id = ko.observable()
	this.stage = ko.observable("waiting")
	this.starting_user_id = ko.observable()
	this.depth = ko.observable(1)
	this.do_not_include_me = ko.observable(true)

	this.is_fake_vk = ko.observable(false)

	this.num_users_in_queue = ko.observable(0)
	this.num_users_completed = ko.observable(0)
	this.num_users_in_graph = ko.computed(function() {
		return 0;
	})

	this.download_data_url = ko.computed(function() {
		return "blah";
	})
	this.download_filename = ko.computed(function() {
		return "lolka";
	})

	this.resetStartingUserToMe = function() {
		this.starting_user_id(this.current_user_id())
	}

	this.start = function() {

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