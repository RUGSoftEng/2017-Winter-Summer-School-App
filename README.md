# Webinterface Winter and Summer School

A webinterface used by the coordinators of the Summer and Winter schools of the University of Groningen to interact with a database. The users may post, update or delete announcements, information sections and appointments in a schedule. 

## Installation
Install by cloning the repository:
```bash
git clone https://github.com/jeroenbrandsma/2017-Winter-Summer-School-App.git
```
Or download the ZIP file and extract it.
## Running the server
If NodeJS has been installed, you can run the server by entering the following command in the root directory of the project:
```bash
node server.js
```

By default the server is listening on port 8080. Therefore, the webinterface can be accessed on [localhost:8080/](localhost:8080/).



## API
#### Announcements
Retrieve a list of the latest announcements (by default 200)
```bash
GET http://localhost:8080/announcement/item[?count=<numberOfAnnouncements>]
```
The following requests require the user to be logged in:
Delete an announcement
```bash
DELETE http://localhost:8080/announcement/item?id=<announcementId>
```
Edit an announcement
```bash
PUT http://localhost:8080/announcement/item?id=<announcementId>&title=<newTitle>&description=<newDescription>
```
Add an announcement
```bash
POST http://localhost:8080/announcement/item?title=<title>&description=<description>
```
#### General information
Retrieve a list of the latest general information (by default 200)
```bash
GET http://localhost:8080/generalinfo/item[?count=<numberOfPost>]
```
The following requests require the user to be logged in:
Delete general information
```bash
DELETE http://localhost:8080/generalinfo/item?id=<announcementId>
```
Edit general information
```bash
PUT http://localhost:8080/generalinfo/item?id=<announcementId>&title=<newTitle>&description=<newDescription>
```
Add general information
```bash
POST http://localhost:8080/generalinfo/item?title=<title>&description=<description>
```
#### Schedule
Retrieve the events in a week. Passing a 0 for week represents the current week, whereas 1 would represent next week. Negative values are also possible to retrieve past events.
```bash
GET http://localhost:8080//calendar/event?week=<integer>
```
The following request requires the user to be logged in:
Add an event
```bash
POST http://localhost:8080//calendar/event?title=<title>&ssid=<schoolName>&date=<date>&startHour=<startingHour>&startMinute=<startingMinute>&endHour=<endingHour>&endMinute=<endingMinute>
```
#### Forum
Retrieve a list of the latest threads in the forum (by default 200)
```bash
GET http://localhost:8080/forum/item[?count=<numberOfPost>]
```
Create new thread
In the body of the post request there must be the fields: title,description,author,posterID
```bash
POST http://localhost:8080/forum/thread/item
```

Create new comment
In the body of the post request there must be the fields: threadID,author,posterID,text
```bash
POST http://localhost:8080/forum/comment/item
```
Edit thread
```bash
PUT http://localhost:8080/forum/thread/item?threadID=<id of the thread>&title=<new title>&description=<new description>
```
Edit comment
```bash
PUT http://localhost:8080/forum/comment/item?threadID=<id of the thread>&arrayPos=<position of the comment in arr>&text=<edited text>
```
Delete thread
```bash
PUT http://localhost:8080/forum/thread/item?threadID=<id of the thread>
```
Delete comment
```bash
PUT http://localhost:8080/forum/comment/item?threadID=<id of the thread>&arrayPos=<position of the comment in array>
```
