const {Builder, By, until} = require('selenium-webdriver');
const {expect} = require('chai');

const testParams = {
    "username" : "random@mailinator.com",
    "password" : "password",
    "product" : {
        "id" : 7,
        "desc" : "Printed Chiffon Dress",
        "price" : "16.40",
        "colour" : "color_15"
    }
}

describe ("Purchase a dress", function() {
    let driver = new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions( /* … */)
        .setChromeOptions( /* … */)
        .build();

    // Set mocha timeout
    this.timeout(20000);

    before("open sign in page and log into website", function(done) {
        driver.get("http://automationpractice.com/index.php?controller=authentication&back=my-account")
            .then(_ => driver.findElement(By.id("email")).sendKeys(testParams.username))
            .then(_ => driver.findElement(By.id("passwd")).sendKeys(testParams.password))
            .then(_ => driver.findElement(By.id("SubmitLogin")).click())
            .then(_ => driver.getTitle())
            .then(title => {
                expect(title).equals("My account - My Store");
                done();
            });
    });

    describe("on homepage", function() {
        it("loads " + testParams.product.desc + " product page when clicked", function(done) {
            let qvElement = "/html/body/div[1]/div[2]/div/div[2]/div/div[1]/ul[1]/li["+testParams.product.id+"]";
            driver.get("http://automationpractice.com/index.php")
                .then(_ => driver.findElement(By.xpath(qvElement)).click())
                .then(_ => driver.getTitle())
                .then(title => {
                    expect(title).equals(testParams.product.desc + " - My Store");
                    done();
                });
        });

        it("adds item to basket when selected", function(done) {
            driver.then(_ => driver.wait(until.elementLocated(By.id(testParams.product.colour)), 100))
                .then(_ => driver.findElement(By.id(testParams.product.colour)).click())
                .then(_ => driver.findElement(By.name("Submit")).click())
                // .then(_ => driver.wait(until.elementTextContains(By.id("layer_cart"), testParams.product.desc),100))
                .then(_ => driver.findElement(By.id("layer_cart")).getCssValue("display"))
                .then(css => {
                    expect(css).equals("block");
                    done();
                });
        });

        it("loads the checkout when proceed is selected", function(done) {
            let procElement = "/html/body/div[1]/div[1]/header/div[3]/div/div/div[4]/div[1]/div[2]/div[4]/a/span";
            driver.then(_ => driver.findElement(By.xpath(procElement)).click())
                .then(_ => driver.getTitle())
                .then(title => {
                    expect(title).equals("Order - My Store");
                    done();
                });
        });

        

    });
});