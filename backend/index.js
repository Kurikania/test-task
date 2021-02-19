const express = require("express"); 
const app = express(); 
const axios = require('axios');
const bodyParser = require('body-parser')


const cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    axios.get('https://test-task-api.labilab.dev/clients')
  .then(response => {
     res.send(response.data)
  })
  .catch(error => {
    console.log(error);
  })
  })


app.listen(4000, function(){
  console.log('Server is running on Port:',4000);
});