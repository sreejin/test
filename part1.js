

//console.log(process.argv[2]);

//var path = 'https://raw.githubusercontent.com/SouthbankSoftware/SBSPublic/master/JStesterTestData.json'
//run command node .\part1.js https://raw.githubusercontent.com/SouthbankSoftware/SBSPublic/master/JStesterTestData.json

const https = require('https');
const http = require('http');
var body = "";

function test1(input,cb){
  var test1 = true;
  for (var i = 0; i<input.length; i++){
    if(input[i].proofType != "full" && input[i].proofType != "incremental" ){
      test1 = false;
      //console.log(i + ":" + input[i].proofType);
      break;
    }
  }
  cb(test1);
}

function test2(input,cb){
  var test2 = true;
  var date = new Date();
  for (var i = 0; i<input.length; i++){
    var date2 = new Date(input[i].submitTimestamp['$date']);
    if((Math.floor((date - date2)/8.64e7)/365)>1){
      //console.log(i + ":" + (Math.floor((date - date2)/8.64e7)/365));
       test2 = false;
       break;
     }
  }
  cb(test2);

}

function test3(input,cb){
  var test3 = true;
  var response = "";
  var count = 0;

  for(var i = 0; i<input.length; i++){

    http.get('http://services.groupkt.com/country/get/iso3code/' + input[i].Country,(res) => {

      res.on('data', (chunk) => {
        response += chunk;
      });

      res.on('end', () => {
        count++;
         var countryResponse = JSON.parse(response);
         if(!(countryResponse['RestResponse'].hasOwnProperty('result'))){
          // console.log('successs');
           test3 = false;
         }
         if(count === input.length){
             cb(test3);
           }
      });
    //console.log(input[i].Country);

    response = "";
  });
  }
  //cb(test3);
}


function validateTests(data){

  //console.log(data);
  var jsonData = JSON.parse(data);

  //test 1 : The case sensitive value of the proofType attribute should be “full” or “incremental.
  var test1Result = test1(jsonData,(test1Result) => {
    if(test1Result){
      console.log('Test 1 PASSED!');
    }else {
      console.log('\x1b[31m', 'Test 1 FAILED');
    }
  });

  var test2Result = test2(jsonData,(test2Result) => {
  if(test2Result){
    console.log('Test 2 PASSED!');
  }else {
    console.log('\x1b[31m','Test 2 FAILED');
  }
});

  var test3Result = test3(jsonData,(test3Result) => {
  if(test3Result){
    console.log('Test 3 PASSED!');
  }else {
    console.log('\x1b[31m','Test 3 FAILED');
  }

});
}

https.get(process.argv[2] , (res) => {

  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    //console.log(res.statusCode);
    if(res.statusCode == 200){
      validateTests(body);
    }
    else {
      console.log('Server returned non 200 response! :' + body);
    }
  });

}).on('error', (e) => {
  console.log("Got error: " + e.message);
});
