
window.vk_graph_export = {}
window.vk_graph_export.Model = function() {
	this.stage = ko.observable("ready")
	this.starting_user_id = ko.observable()
	this.depth = ko.observable(1)
	this.do_not_include_me = ko.observable(true)

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
}