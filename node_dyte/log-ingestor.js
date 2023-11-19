const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions)) 
app.listen(port, () => {
  console.log(`Log ingestor listening at http://localhost:${port}`);
});
app.use(bodyParser.json());
let file_path = "./tmp/";
let file_name = "test.json";
let logs = [];
app.post('/log', (req, res) => {
  const logEntry = req.body;
  console.log(logEntry,"..logEntry..")
  console.log('Log received:', logs);
  //make db connection and write to it 
  var obj = JSON.parse(fs.readFileSync(file_path + file_name, 'utf8'));
  if(obj.length>0){
    for(var i=0;i<obj.length;i++){
      logs.push(obj[i]);
    }
    
  }
  else{
    obj=[];
  }
  logs.push(logEntry);
  fs.writeFileSync(file_path + file_name, JSON.stringify(logs));
  res.sendStatus(200);
  
});
app.use('/', (req, res, next) => { 
  const filters = req.query; 
  //read directly from db
  var obj = JSON.parse(fs.readFileSync(file_path + file_name, 'utf8'));
  const filteredUsers = obj.filter(user => { 
    let isValid = true; 
    for (key in filters) { 
      console.log(key, user[key], filters[key]); 
      isValid = isValid && user[key] == filters[key]; 
    } 
    return isValid; 
  }); 
  res.send(filteredUsers); 
}); 
