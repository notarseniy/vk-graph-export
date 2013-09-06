
window.vk_graph_export = {}
window.vk_graph_export.Model = function() {
	this.ready = ko.observable(false)
	this.resulting_file_content = ko.observable(null)
	this.users_in_queue = ko.observable(0)
	
}