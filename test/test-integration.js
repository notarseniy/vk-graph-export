
describe("Integration", function() {
	describe("Run integration multiple times", function() {
		for(i=1; i<=5; i++) {			
			describe("Try "+i, function() {
				var fake_api = new vk.FakeAPI()
				var trav = new vk.Traverser(function(id, is_detailed, on_result) {
					var friends = fake_api.getFriends(id, is_detailed)
					on_result(friends)
				})

				var starting_id = 100
				it("should complete traversing", function(done) {
					trav.enqueue(starting_id, 1)
					var onNext = function() {
						if (!trav.isCompleted()) {
							trav.next(onNext)
						} else {
							done()
						}
					}
					trav.next(onNext)
				})
				var graph
				it("should convert to graph", function() {
					graph = vk.to_graph(trav.friends, trav.links, [starting_id])
				})
				var gexf
				it("should output GEXF", function() {
					gexf = format_to_gexf(graph.nodes, graph.edges, graph.attribute_conf)
				})
				it("GEXF should not be empty", function() {
					chai.expect(gexf).to.be.not.empty
					chai.expect(gexf).to.be.a("string")
				})
			})
		}
	})
})