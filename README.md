# Massa Labs Frontend technical test

## Run project

To run the project, run the following commands:

In the first terminal :
- ipfs daemon

In the second terminal :
- npm install
- node app.js

Go to http://localhost:3000/ in your browser
- Choose a filename (Example: Test)
- Select an HTML file of your choice from your desktop (You can find also a sample file in the example directory)
- Press the submit button

Result: 
If everything went well the HTML will be stored in the IPFS platform
Then the Hash of the stored file will be added to a new transaction
This transaction will be used in order to mine a new bock in the massaBlockchain (with the Proof of work method)