var chai = require('chai');
var expect = chai.expect;
var request = require('request');
var supertest = require('supertest');
var server;
describe('Server',function() {
    it('should start the server and initialize it properly',function(done){
        server = require('./../server.js');
        done();
    });
});

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
          expect('content-Type',/html/);
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
describe('API receives correct information',function() {
    it('announcement post should receive correct values',function(done){
       request.post('http://localhost:8080/announcement/item',
           {form:{title:"test",description:"test",user:"test"}},
           function(err,res,body){
            var parsed = JSON.parse(body);
            expect(parsed).to.deep.equal({"title":"test","description":"test"});
            done();
           });
    });
    it('general information route should receive correct values',function(done){
        request.post('http://localhost:8080/generalinfo/item',
            {form:{title:"test",description:"test",user:"test"}},
            function(err,res,body){
                var parsed = JSON.parse(body);
                expect(parsed).to.deep.equal({"title":"test","description":"test"});
                done();
            });
    });
    it('lecturer route should receive correct values',function(done){
        request.post('http://localhost:8080/lecturer/item',
            {form:{title:"test",description:"test",user:"test"}},
            function(err,res,body){
                var parsed = JSON.parse(body);
                expect(parsed).to.deep.equal({"title":"test","description":"test"});
                done();
            });
    });

    it('forum route should receive correct values',function(done){
        request.post('http://localhost:8080/forum/thread/item',
            {form:{title:"test",description:"test",user:"test"}},
            function(err,res,body){
                var parsed = JSON.parse(body);
                expect(parsed).to.deep.equal({"title":"test","description":"test"});
                done();
            });
    });
});
describe('Web pages ',function(){
   it('should return announcepage',function(done){
       supertest(server.app).get('/announcepage').expect('Content-Type',"text/html; charset=utf-8").expect(200,done);
   });
    it('should return generalinfo',function(done){
        supertest(server.app).get('/generalinfo').expect('Content-Type',"text/html; charset=utf-8").expect(200,done);
    });
    it('should return lecturerpage',function(done){
        supertest(server.app).get('/lecturerpage').expect('Content-Type',"text/html; charset=utf-8").expect(200,done);
    });
    it('should return main',function(done){
        supertest(server.app).get('/main').expect('Content-Type',"text/html; charset=utf-8").expect(200,done);
    });
    it('should return options',function(done){
        supertest(server.app).get('/options').expect('Content-Type',"text/html; charset=utf-8").expect(200,done);
    });
});

