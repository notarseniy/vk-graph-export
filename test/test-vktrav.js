
describe("VK friends traversing module", function() {
	describe("Graph traverser", function() {
		var testdata_edges = [
			[75,76],[75,77],[75,79],[76,77],[76,79],[76,80],
			[77,79],[78,75],[78,76],[78,77],[78,79],[78,85],
			[78,92],[81,75],[81,82],[81,86],[82,75],[82,87],
			[83,75],[83,87],[86,80],[86,87],[87,88],[88,93],
			[92,88]
		]
		var starter_id = 76
		var testdata_mirrored = testdata_edges.concat(_.map(testdata_edges, function(i) {return [i[1], i[0]]}))
		var friends = _.groupBy(testdata_mirrored, "0")
		
		var generate_dummy = function(id, is_detailed) {
			if (is_detailed) {
				return {
					bdate: "20.10.1991",
					city: "2",
					country: "1",
					first_name: "Fgsfds",
					home_phone: "+728346763254",
					id: id,
					last_name: "Lastname",
					nickname: "Ololosha",
					online: 1,
					photo_50: "http://cs234765.vk.me/v45384574/5be7/CCDHDC_xw.jpg",
					relation: "4",
					relation_partner: Object,
					screen_name: "tetetest",
					sex: 1,
					timezone: 3
				}
			} else {
				return {
					id: id
				}
			}
		}

		var Requester = function() {
			this.requests = []
		}
		Requester.prototype.simulateRequest = function(id, is_detailed) {
			this.requests.push({id: id, is_detailed: is_detailed})
			if (friends[id] === undefined) {return []}
			return _.map(friends[id], function(pairs) {
				return generate_dummy(pairs[1], is_detailed)
			})
		}

		describe("For depth of 1", function() {
			var req = new Requester()
			var trav = new vktrav.Traverser(function(id, is_detailed, on_result) {
				on_result(req.simulateRequest(id, is_detailed))
			})
			it("should complete", function(done) {
				trav.enqueue(starter_id, 1)
				var onNext = function() {
					if (!trav.isCompleted()) {
						trav.next(onNext)
					} else {
						done()
					}
				}
				trav.next(onNext)
			})
			it("should have 5 friends", function() {
				chai.expect(trav.friends).to.have.length(5)
			})
			it("should have made 6 requests", function() {
				chai.expect(req.requests).to.have.length(6)
			})
			it("should not have requested any user more than one time", function() {
				var request_counts = _.countBy(req.requests, "id")
				chai.expect(_.max(request_counts)).to.be.not.above(1)
			})
		})
	})
})