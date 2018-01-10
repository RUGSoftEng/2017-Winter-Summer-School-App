var chai = require('chai');
var expect = chai.expect;
var request = require('request');
var supertest = require('supertest');
var server = {};
var ObjectId = require('mongodb').ObjectID;

describe('Server', function () {
	it('should start the server and initialize it properly', function (done) {
		require('./../config/app.js').start(function (app) {
			server.app = app;
			supertest(app).get('/').expect('Content-Type', "text/html; charset=utf-8").expect(200, done);
		});
	});
});

describe('API get request', function () {

	it('should return a JSON file of announcements', function (done) {
		request.get('http://localhost:8800/API/announcement', function (err, res, body) {
			var parsed = JSON.parse(body);
			expect(res.statusCode).to.equal(200);
			expect('contentType', /json/);
			expect(parsed).to.be.an('array');
			if (parsed.length > 0) {
				expect(parsed[0]).to.include.keys('_id', 'title', 'description', 'created', 'school');
			}
			done();
		});

	});

	it('should return a JSON file of general information', function (done) {
		request.get('http://localhost:8800/API/generalinfo', function (err, res, body) {
			var parsed = JSON.parse(body);
			expect(res.statusCode).to.equal(200);
			expect('content-Type', /html/);
			expect(parsed).to.be.an('array');
			if (parsed.length > 0) {
				expect(parsed[0]).to.include.keys('_id', 'title', 'description', 'created', 'category');
			}
			done();
		});
	});

	it('should return a JSON file of lecturers', function (done) {
		request.get('http://localhost:8800/API/lecturer', function (err, res, body) {
			var parsed = JSON.parse(body);
			expect(res.statusCode).to.equal(200);
			expect('contentType', /json/);
			expect(parsed).to.be.an('array');
			if (parsed.length > 0) {
				expect(parsed[0]).to.include.keys('_id', 'name', 'description', 'created');
			}
			done();
		});
	});

	it('should return a JSON file of the forum', function (done) {
		request.get('http://localhost:8800/forum/item', function (err, res, body) {
			var parsed = JSON.parse(body);
			expect(res.statusCode).to.equal(200);
			expect('contentType', /json/);
			expect(parsed).to.be.an('array');
			if (parsed.length > 0) {
				expect(parsed[0]).to.include.keys('_id', 'title', 'description', 'date', 'posterID', 'author', 'imgurl', 'comments');
			}
			done();
		});
	});
});

describe('API receives correct information', function () {
	it('announcement post should receive correct values', function (done) {
		request.post('http://localhost:8800/API/announcement',
			{ form: { title: "test", description: "test", user: "test", school: "41224d776a326fb40f000001" } },
			function (err, res, body) {
				expect(res.statusCode).to.equal(302);
				done();
			});
	});
	it('general information route should receive correct values', function (done) {
		request.post('http://localhost:8800/API/generalinfo',
			{ form: { title: "test", description: "test", user: "test", category: "Location" } },
			function (err, res, body) {
				expect(res.statusCode).to.equal(302);
				done();
			});
	});
	it('lecturer route should receive correct values', function (done) {
		request.post('http://localhost:8800/API/lecturer',
			{ form: { title: "test", description: "test", user: "test", website: "http://test.com" } },
			function (err, res, body) {
				expect(res.statusCode).to.equal(302);
				done();
			});
	});

	/*it('forum route should receive correct values', function (done) {
		request.post('http://localhost:8800/forum/thread/item',
			{form: {title: "test", description: "test", user: "test"}},
			function (err, res, body) {
				var parsed = JSON.parse(body);
				expect(parsed).to.deep.equal({"title": "test", "description": "test"});
				done();
			});
	});*/
});

describe('Web pages ', function () {
	it('should return announcepage', function (done) {
		request.get('http://localhost:8800/announcepage', function (err, res, body) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});

	it('should return generalinfo', function (done) {
		request.get('http://localhost:8800/generalinfo', function (err, res, body) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});
	it('should return lecturerpage', function (done) {
		request.get('http://localhost:8800/lecturerpage', function (err, res, body) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});
	it('should return main', function (done) {
		request.get('http://localhost:8800/main', function (err, res, body) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});
	it('should return options', function (done) {
		request.get('http://localhost:8800/options', function (err, res, body) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});
});

describe('Google Calendar API', function () {
	var path = 'http://localhost:8800/calendar/event'
	var eventForm =
		{
			title: 'Judgement Day',
			description: '',
			location: 'Cheyenne Mountain, Colorado, USA',
			details: 'Skynet becomes self aware',
			startDate: '1997-08-29',
			startHour: '02',
			startMinute: '14',
			endDate: '1997-08-29',
			endHour: '23',
			endMinute: '59',
			ssid: 'Artificial Intelligence'
		}
	var modifyEvent =
		'&title=' + eventForm.title +
		'&description=' + eventForm.description +
		'&location=' + eventForm.location +
		'&details=' + eventForm.details +
		'&startDate=' + eventForm.startDate +
		'&endDate=' + eventForm.endDate +
		'&startHour=' + eventForm.startHour +
		'&endHour=' + eventForm.endHour +
		'&startMinute=' + eventForm.startMinute +
		'&endMinute=' + eventForm.endMinute +
		'&ssid=' + eventForm.ssid;

	describe('Event insertion.', function () {
		it('Creates and inserts an event into the Calendar.', function (done) {
			request.post({ url: path, form: eventForm }, function (error, response, body) {
				expect(response.statusCode).to.equal(302);
				done();
			});
		});
	});

	describe('Event retreival, modification, deletion.', function () {
		var startDate = eventForm.startDate + 'T' + eventForm.startHour + ':' + eventForm.startMinute + ':00-00:00';
		var endDate = eventForm.endDate + 'T' + eventForm.endHour + ':' + eventForm.endMinute + ':00-00:00';
		var getEvent = '?startDate=' + startDate + '&endDate=' + endDate;
		it('Retrieves, modifies, and deletes the inserted event.', function (done) {
			var id = null;
			var gotten = [];
			request(path + getEvent, function (error, response, body) {
				var packet = JSON.parse(body);
				var data = JSON.parse(packet.data);
				id = data[0][1][0].id;
				gotten = [packet.error, data[0][1][0].summary];
				request.put(path + '?id=' + id + modifyEvent, function (error, response, body) {
					gotten.push(response.statusCode);
					request.delete(path + '?id=' + id, function (error, response, body) {
						gotten.push(response.statusCode);
						expect(gotten).to.deep.equal([null, eventForm.title, 201, 200]);
						done();
					});
				});
			});
		});
	});
});
