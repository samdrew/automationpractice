var chai = require('chai')
    , chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

const urlHome = "http://automationpractice.com";

describe("Loading main page", function() {
    it("returns HTTP-200 and HTML content", function(done){
        chai.request(urlHome)
            .get('/')
            .end(function(err, res) {
                expect(res).to.be.html;
                expect(res).to.have.status(200);
                done();
            });
    });
});