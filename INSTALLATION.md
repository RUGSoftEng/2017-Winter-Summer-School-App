# First installation instructions.
## Mongodb
Install mongodb according to the specific instructions of your OS/distribution in the website https://docs.mongodb.com/master/administration/install-community/.
##Database initialization.
Enter mongo shell through the following terminal command. Alternatively you may choose to run mongo as a service in that refer to the mongo documentation.
```bash
mongo
```
Create the database used by the application through the following command in mongo shell.
```bash
use summer-schools
```
## Running the application for the first time.
Open up a fresh terminal and run the application with the following command.<br />
_The application can be run as a service depending on your operating system the method may vary._<br />

_(note: npm and nodejs are prerequisites for running)_
```bash
npm start
```
The application should let you login now using any non empty username and password.<br />
Navigate to the options page and add a new **ADMIN** user.<br />
Restart the server so the auto login feature is disabled. 
