
describe("xmlwriter", function() {
	it("should encode entities in attribute values and text nodes", function() {
		var test_xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
			'<test attr="lol&amp;&quot;&lt;&gt;">' +
			'  <inner>lol&amp;&quot;&lt;&gt;</inner>' +
			'  <inner2>' +
			'     lol&amp;&quot;&lt;&gt;' +
			'  </inner2>' +
			'</test>'
		var xw = new XMLWriter('UTF-8', '1.0');
		xw.writeStartDocument();
		xw.writeStartElement("test")
		xw.writeAttributeString("attr", 'lol&"<>')
		xw.writeElementString("inner", 'lol&"<>')
		xw.writeStartElement("inner2")
		xw.writeString('lol&"<>')
		xw.writeEndElement()

		var result = xw.flush()
		expect(result).to.be.a("string")
		var r1 = EquivalentXml.xml(result)
		var r2 = EquivalentXml.xml(test_xml)
		expect(EquivalentXml.isEquivalent(r1, r2)).to.be.true
	})
})