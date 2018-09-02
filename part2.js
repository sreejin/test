const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

var path = 'http://www.dbkoda.com'

const timeout = 30000;

async function verifydbkoda(path){

try{
//
// await driver.get(path);
//
// await driver.wait(until.titleIs('dbKoda | dbKoda is the open-source, next generation IDE for MongoDB. Take your database to the next level with our Rich Code Editor, Multiple Connection Management and Topology Tree Explorer.'), 10000);

await driver.get(path).catch( (e) => {
  console.log('Test 1 : FAILED! Website not reachable');
  process.exit(1);
});

await driver.wait(function() {
       return driver.getTitle().then(function(title) {
          return title === 'dbKoda | dbKoda is the open-source, next generation IDE for MongoDB. Take your database to the next level with our Rich Code Editor, Multiple Connection Management and Topology Tree Explorer.';
        });
      }, timeout);



await driver.executeScript( () => { return document.readyState }).then(function (res) {
    if (res == 'complete'){
	console.log('Test 1 : PASSED! Page Loaded successfully');
	} else{
	console.log('Test 1 : FAILED! Website still loading');
	process.exit(1);
	}
}).catch( (e) => {
  console.log('Test 1 : FAILED! Exception' + e);
  process.exit(1);
});

var getReady = driver.wait(until.elementLocated(By.xpath('//*[@id="owl-main-background"]')));

await driver.findElement(By.xpath('//*[@id="top"]/header/div[2]/div[2]/div/div/div/ul/li[2]')).click().then(function() {
	//console.log('click downloads...');
});

await driver.findElement(By.xpath('/html/body/main/section[5]/div/div[1]/div/header/h1')).then(function() {
	console.log('Test 2 : The Download link at the top of the page navigates to the downloads section : PASSED');
});

 await driver.findElement(By.xpath('//a[@href="https://s3-ap-southeast-2.amazonaws.com/asiapac-sydney.release.dbkoda/dbkoda-latest.exe"]')).click().then(function() {
 	console.log('click windows download...');

    driver.switchTo().alert().then(
        function() {
                     console.log("Test 3 : licking on the Windows download button causes ‘dbkoda-latest.exe’ to be downloaded : PASSED");
                  });
    //
    });

process.on('UnhandledPromiseRejectionWarning', error => {
  // to be fixed -- code quality"
  console.log('unhandledRejection');
});

process.on('DeprecationWarning', error => {
  // to be fixed -- code quality"
  console.log('unhandledRejection');
});

} catch (ex) {
    console.log('An error occured! All other tests failed!!!' + ex);
  } finally {
    await driver.quit();
  }
}

verifydbkoda(path);
