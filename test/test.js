var chai = require('chai');
var expect = chai.expect;
var request = require('request');



describe('API get request',function(){

  it('should return a JSON file of announcements',function(done){
      request.get('http://localhost:8080/announcement/item',function(err,res,body){
          var parsed = JSON.parse(body);
          expect(res.statusCode).to.equal(200);
          expect('contentType',/json/);
          expect(parsed).to.be.an('array');
          if(parsed.length > 0){
              expect(parsed[0]).to.have.all.keys('_id','title','description','date','poster');
          }
          done();
      });
  });

  it('should return a JSON file of general information',function(done){
      request.get('http://localhost:8080/generalinfo/item',function(err,res,body){
          var parsed = JSON.parse(body);
          expect(res.statusCode).to.equal(200);
          expect('contentType',/json/);
          expect(parsed).to.be.an('array');
          if(parsed.length > 0){
              expect(parsed[0]).to.have.all.keys('_id','title','description');
          }
          done();
      });
  });

   it('should return a JSON file of lecturers',function(done) {
       request.get('http://localhost:8080/lecturer/item', function (err, res, body) {
           var parsed = JSON.parse(body);
           expect(res.statusCode).to.equal(200);
           expect('contentType', /json/);
           expect(parsed).to.be.an('array');
           if (parsed.length > 0) {
               expect(parsed[0]).to.have.all.keys('_id', 'name', 'description', 'imagepath', 'website');
           }
           done();
       });
    });

       it('should return a JSON file of the forum', function (done) {
           request.get('http://localhost:8080/forum/item', function (err, res, body) {
               var parsed = JSON.parse(body);
               expect(res.statusCode).to.equal(200);
               expect('contentType', /json/);
               expect(parsed).to.be.an('array');
               if (parsed.length > 0) {
                   expect(parsed[0]).to.have.all.keys('_id', 'title', 'description','date','posterID','author', 'comments');
               }
               done();
           });
       });
});
