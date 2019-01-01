var chai = require('chai')
    , chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

const urlHome = "http://automationpractice.com";

const pages = {
    "root" : {
        "type" : "redirect",
        "uri": "/",
        "statusCode" : 302,
        "redirectTo" : "/index.php"
    },
    "home" : {
        "type" : "page",
        "uri" : "/index.php",
        "testable" : ["basic", "authenticated", "cart"],
        "title" : "My Store"
    },
    "cart" : {
        "type" : "page",
        "uri" : "/index.php?controller=order",
        "testable" : ["basic", "authenticated", "cart"],
        "title" : "Order - My Store"
    },
    "product" : {
        "type" : "class",
        "uri" : "/index.php?controller=product&id_product=$id$",
        "testable" : ["basic", "authenticated", "cart"],
        "title" : "$name$ - My Store",
        "instances" : [
            {"id" : 5, "name" : "Printed Summer Dress"}
        ]
    }
};

class Page {
    constructor(pageBuilder) {
        this.test_array = [];
        if (pageBuilder.type == "page") {
            if (pageBuilder.testable.includes("basic")) {
                this.test_array.push(function(){
                    it("returns HTTP-200 and has the title \"" + pageBuilder.title + "\"", function(done) {
                        chai.request(urlHome)
                            .get(pageBuilder.uri)
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.text).to.contain("<title>"+pageBuilder.title+"</title>");
                                done();
                            });
                })});
            }
        }
    }

    request() {
        let i = 0
        for (; i < this.test_array.length; i++) {
            this.test_array[i]();
        }
    }
}

describe("Loading main page", function() {
    it("returns HTTP-200 and HTML content", function(done){
        chai.request(urlHome)
            .get('/')
            .end(function(err, res) {
                expect(res).to.redirectTo(urlHome + '/index.php');
                done();
            });
    });

    let homePage = new Page(pages.home);
    homePage.request()
});