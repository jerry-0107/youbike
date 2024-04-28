const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs')
const mysql = require('mysql2');
app.use(bodyParser.json());
app.use(express.static('./build'));
var cron = require('node-cron');

var apikey = ""
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

  if (apikey === "") {
    await getApiKeyFromDB(
      function (_apikey) {
        apikey = _apikey
        // console.log(_apikey)
        // console.log(req.body.apiurl)
        fetch(req.body.apiurl, {
          method: "GET",
          headers: {
            "authorization": "Bearer " + _apikey,
          }

        }).then(r => r.json())
          .then(r => res.send(r))
      }
    )
  } else {

    // console.log(apikey)
    // console.log(req.body.apiurl)
    fetch(req.body.apiurl, {
      method: "GET",
      headers: {
        "authorization": "Bearer " + apikey,
      }

    }).then(r => r.json())
      .then(r => res.send(r))
  }
})

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: './build' });
})

async function getApiKeyFromDB(callback) {
  var temp = ""
  sql_Connect.getConnection(async function (err, connection) {
    connection.query(`
      SELECT * FROM APIkey
    `, function (error, results, field) {
      if (error) console.log(error); connection.release();
      console.log(results[0]);
      temp = results[0].apiKey;
      connection.release();
      callback(temp)
      return temp;
    })
  })
  return temp
}

var getApiKey = cron.schedule('0 0,6,12,18 * * *', () => {
  var tdxLogin = {
    grant_type: "client_credentials",
    client_id: "jerry20200815-905e4c2d-f4f9-42dd",
    client_secret: "df5c085e-f262-4258-b1d6-518e40138f71"
  };
  fetch("https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(tdxLogin),
  })
    .then(response => response.json())
    .then(data => {
      sql_Connect.getConnection(function (err, connection) {
        connection.query(`
              SELECT * FROM APIkey
              `, function (error, results, fields) {
          if (error) { console.log("[CRON][SQL TEST] get SQL data : [ERR!]", error) }
          else {
            console.log("[CRON][SQL TEST] get SQL data : SUCCESS")
          }
          connection.release()

          sql_Connect.getConnection(function (err, connection2) {
            connection2.query(`
                 DELETE FROM APIkey
                  WHERE id > 0;
              `, function (error2, results2, fields) {
              if (error2) {
                console.log("[CRON][SQL TEST] delete SQL data : [ERR!]", error2)
              } else {
                console.log("[CRON][SQL TEST] delete SQL data : SUCCESS")
              }
              connection2.release()

              sql_Connect.getConnection(function (err, connection3) {
                connection3.query(`
                  INSERT INTO APIkey (apiKey,updateTime)
                  VALUES("${data.access_token}","${dayjs().format("MM/DD HH:mm")}")
              `, function (error3, results3, fields) {
                  if (error3) {
                    console.log("[CRON][SQL TEST] insert SQL data : [ERR]", error3)

                  } else {
                    apikey = data.access_token
                    console.log("API KEY 取得成功")
                    console.log("[CRON][SQL TEST] insert SQL data : SUCCESS")
                  }
                  connection3.release()
                })
              })
            })
          })
        })
      })



    })
    .catch(error => {
      console.error("Error:", error);
    });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  getApiKey.start()
  console.log(`Server is running on port ${PORT}`);
});

