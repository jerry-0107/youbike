const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs')
const mysql = require('mysql2');
app.use(bodyParser.json());
app.use(express.static('./build'));
var cron = require('node-cron');

var apikey = []
var apikey_index = 0
// app.use(express.json());

var sql_Connect = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  port: process.env.MYSQLPORT,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 15
});





app.post(/^\/api\/get/, async (req, res) => {

  if (apikey.length < 1) {
    await getApiKeyFromDB(
      function (_apikey) {
        apikey = _apikey
        // console.log(_apikey)
        // console.log(req.body.apiurl)
        console.log(`now we have ${apikey.length} api keys , and this time we were using the #${apikey_index}`)
        fetch(req.body.apiurl, {
          method: "GET",
          headers: {
            "authorization": "Bearer " + apikey[apikey_index],
          }

        }).then(r => r.json())
          .then(r => res.send(r))
        if (apikey_index < 3) { apikey_index++ }
        else { apikey_index = 0 }
      }
    )
  } else {
    console.log(`now we have ${apikey.length} api keys , and this time we were using the #${apikey_index}`)

    // console.log(apikey)
    // console.log(req.body.apiurl)
    fetch(req.body.apiurl, {
      method: "GET",
      headers: {
        "authorization": "Bearer " + apikey[apikey_index],
      }

    }).then(r => r.json())
      .then(r => res.send(r))
      .catch(err => {
        res.send("error:" + JSON.stringify(err))
        console.log(apikey_index, err)
      })
    if (apikey_index < 2) { apikey_index++ }
    else { apikey_index = 0 }
  }
})

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: './build' });
})

async function getApiKeyFromDB(callback) {
  var temp = []
  sql_Connect.getConnection(async function (err, connection) {
    connection.query(`
      SELECT * FROM APIkey
    `, function (error, results, field) {
      if (error) console.log(error); connection.release();
      console.log(results[0]);
      temp = [results[0].apiKey, results[1].apiKey, results[2].apiKey];
      connection.release();
      console.log(temp)
      callback(temp)
      return temp;
    })
  })
  return temp
}

async function getApiKeyFromTDX() {

  function updateKeys(token) {
    // console.log(token)
    if (!token) { console.log("TOKEN ERROR"); return }
    sql_Connect.getConnection(function (err, connection3) {
      connection3.query(`
                  INSERT INTO APIkey (apiKey,updateTime)
                  VALUES("${token}","${dayjs().format("MM/DD HH:mm")}")
              `, function (error3, results3, fields) {
        if (error3) {
          console.log("[CRON][SQL TEST] insert SQL data : [ERR]", error3)

        } else {
          apikey.push(token)
          console.log("API KEY 取得成功")
          console.log("[CRON][SQL TEST] insert SQL data : SUCCESS")
          console.log(apikey)
        }
        connection3.release()
      })
    })
  }
  function deletekeys(then, token) {
    apikey = []
    sql_Connect.getConnection(function (err, connection2) {
      connection2.query(`
                 DELETE FROM APIkey
                  WHERE id > 0;
              `, function (error2, results2, fields) {
        if (error2) {
          console.log("[CRON][SQL TEST] delete SQL data : [ERR!]", error2)
          then(false)
        } else {
          console.log("[CRON][SQL TEST] delete SQL data : SUCCESS")
          then(token)
        }
        connection2.release()
      })
    })
  }


  var loginData = [
    {
      grant_type: "client_credentials",
      client_id: "jerry20200815-905e4c2d-f4f9-42dd",
      client_secret: "df5c085e-f262-4258-b1d6-518e40138f71"
    },
    {
      grant_type: "client_credentials",
      client_id: "jerry20200815-3a261775-221c-47b3",
      client_secret: "82b0d523-4d14-4b33-be34-79031f7de093"
    },
    {
      grant_type: "client_credentials",
      client_id: "jerry20200815-fbe3a182-d6be-4902",
      client_secret: "97bc5e9c-c49a-4b36-985a-01454e408699"
    }
  ]

  for (let i = 0; i < loginData.length; i++) {
    console.log(i, "--fetching api keys.")
    var tdxLogin = {
      grant_type: loginData[i].grant_type,
      client_id: loginData[i].client_id,
      client_secret: loginData[i].client_secret
    };
    await fetch("https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(tdxLogin),
    })
      .then(response => response.json())
      .then(data => {
        console.log(i, data)
        console.log(i, "--processing api keys.")

        if (i < 1) {
          console.log(i, "--deleting old api keys.")

          deletekeys(
            updateKeys,
            data.access_token
          )

        } else {
          console.log(i, "--appending api keys.")

          updateKeys(data.access_token)
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
}

var getApiKey = cron.schedule('0 0,6,12,18 * * *', () => {
  getApiKeyFromTDX()
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  getApiKeyFromTDX()
  getApiKey.start()
  console.log(`Server is running on port ${PORT}`);
});

