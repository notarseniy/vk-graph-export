
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
			it("should return friends with ids: 75, 77, 78, 79, 80", function() {
				chai.expect(_.map(trav.friends, function(u) {return u.id})).to.have.members([75, 77, 78, 79, 80])
			})
			it("should return friend 80 with connections to 76, 86", function() {
				chai.expect(trav.links[80]).to.have.members([76, 86])
			})
			it("should return friend 79 with connections to 75, 76, 77, 78", function() {
				chai.expect(trav.links[79]).to.have.members([75, 76, 77, 78])
			})
			it("should return friend 78 with connections to 75, 76, 77, 79, 85, 92", function() {
				chai.expect(trav.links[78]).to.have.members([75, 76, 77, 79, 85, 92])
			})
		})
		
		describe("For depth of 2", function() {
			var req = new Requester()
			var trav = new vktrav.Traverser(function(id, is_detailed, on_result) {
				on_result(req.simulateRequest(id, is_detailed))
			})
			it("should complete", function(done) {
				trav.enqueue(starter_id, 2)
				var onNext = function() {
					if (!trav.isCompleted()) {
						trav.next(onNext)
					} else {
						done()
					}
				}
				trav.next(onNext)
			})
			it("should have 12 users found", function() {
				chai.expect(trav.friends).to.have.length(12)
			})
			it("should have found users: 75, 76, 77, 78, 79, 80, 81, 82, 83, 85, 86, 92", function() {
				var ids = _.map(trav.friends, function(f) {return f.id})
				chai.expect(ids).to.have.members([75, 76, 77, 78, 79, 80, 81, 82, 83, 85, 86, 92])
			})
			it("should have made 1 + 5 + 6 = 12 requests", function() {
				chai.expect(req.requests).to.have.length(1 + 5 + 6)
			})
			it("should not have requested any user more than one time", function() {
				var request_counts = _.countBy(req.requests, "id")
				chai.expect(_.max(request_counts)).to.be.not.above(1)
			})
			it("should have 12 links records", function() {
				chai.expect(_.toArray(trav.links)).to.have.length(1 + 5 + 6)
			})
			it("should have done detailed requests to users 76; 75, 77, 78, 79, 80", function() {
				chai.expect(_.map(_.filter(req.requests, function(r) {return r.is_detailed}), function(r) {return r.id})).
					to.have.members([76, 75, 77, 78, 79, 80])
			})
			it("should have done non-detailed requests to users 81, 82, 83, 85, 86, 92", function() {
				chai.expect(_.map(_.filter(req.requests, function(r) {return !r.is_detailed}), function(r) {return r.id})).
					to.have.members([81, 82, 83, 85, 86, 92])				
			})
			it("should have user 92 with links to 78 and 88", function() {
				chai.expect(trav.links[92]).to.have.members([78, 88])
			})
			it("should have user 80 with links to 76 and 86", function() {
				chai.expect(trav.links[80]).to.have.members([76, 86])
			})
		})
	})
})