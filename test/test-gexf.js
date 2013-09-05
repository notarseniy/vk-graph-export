
describe("GEXF writer", function() {
	'use strict';

	var xml_sample = '<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<gexf xmlns="http://www.gexf.net/1.2draft" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gexf.net/1.2draft http://www.gexf.net/1.2draft/gexf.xsd" version="1.2">' +
	// '    <meta lastmodifieddate="2009-03-20">' +
	// '        <creator>Gephi.org</creator>' +
	// '        <description>A Web network</description>' +
	// '    </meta>' +
	'    <graph defaultedgetype="directed">' +
	'        <attributes class="node">' +
	'            <attribute id="0" title="url" type="string"/>' +
	'            <attribute id="1" title="indegree" type="float"/>' +
	'            <attribute id="2" title="frog" type="boolean">' +
	'                <default>true</default>' +
	'            </attribute>' +
	'        </attributes>' +
	'        <nodes>' +
	'            <node id="0" label="Gephi">' +
	'                <attvalues>' +
	'                    <attvalue for="0" value="http://gephi.org"/>' +
	'                    <attvalue for="1" value="1"/>' +
	'                </attvalues>' +
	'            </node>' +
	'            <node id="1" label="Webatlas">' +
	'                <attvalues>' +
	'                    <attvalue for="0" value="http://webatlas.fr"/>' +
	'                    <attvalue for="1" value="2"/>' +
	'                </attvalues>' +
	'            </node>' +
	'            <node id="2" label="RTGI">' +
	'                <attvalues>' +
	'                    <attvalue for="0" value="http://rtgi.fr"/>' +
	'                    <attvalue for="1" value="1"/>' +
	'                </attvalues>' +
	'            </node>' +
	'            <node id="3" label="BarabasiLab">' +
	'                <attvalues>' +
	'                    <attvalue for="0" value="http://barabasilab.com"/>' +
	'                    <attvalue for="1" value="1"/>' +
	'                    <attvalue for="2" value="false"/>' +
	'                </attvalues>' +
	'            </node>' +
	'        </nodes>' +
	'        <edges>' +
	'            <edge id="0" source="0" target="1"/>' +
	'            <edge id="1" source="0" target="2"/>' +
	'            <edge id="2" source="1" target="0"/>' +
	'            <edge id="3" source="2" target="1"/>' +
	'            <edge id="4" source="0" target="3"/>' +
	'        </edges>' +
	'    </graph>' +
	'</gexf>'

	var nodes = [
		{
			id: 0,
			label: "Gephi", 
			attrs: {
				url: "http://gephi.org",
				indegree: 1
			}
		},
		{
			id: 1,
			label: "Webatlas",
			attrs: {
				url: "http://webatlas.fr",
				indegree: 2
			}
		},
		{
			id: 2,
			label: "RTGI",
			attrs: {
				url: "http://rtgi.fr",
				indegree: 1
			}
		},
		{
			id: 3,
			label: "BarabasiLab",
			attrs: {
				url: "http://barabasilab.com",
				indegree: 1,
				frog: false
			}
		}
	]

	var edges = [
		{id: 0, source: 0, target: 1},
		{id: 1, source: 0, target: 2},
		{id: 2, source: 1, target: 0},
		{id: 3, source: 2, target: 1},
		{id: 4, source: 0, target: 3}
	]

	var attribute_conf = [
		{id: 0, title: 'url', type: 'string'},
		{id: 1, title: 'indegree', type: 'float'},
		{id: 2, title: 'frog', type: 'boolean', default: true}
	]

	var result = format_to_gexf(nodes, edges, attribute_conf)
	console.log("r:",result)
	console.log("s:",xml_sample)

	it("should dump some gexf from graph data", function() {
		chai.expect(result).to.be.a('string')
	})

	it("output should match sample xml", function() {
		var r1 = EquivalentXml.xml(result)
		var r2 = EquivalentXml.xml(xml_sample)
		chai.expect(EquivalentXml.isEquivalent(r1, r2)).to.be.true
	})
})
