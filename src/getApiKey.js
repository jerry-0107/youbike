

export async function getapikey(callback) {
    var tdxLogin = {
        grant_type: "client_credentials",
        client_id: "jerry20200815-905e4c2d-f4f9-42dd",
        client_secret: "df5c085e-f262-4258-b1d6-518e40138f71"
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
            localStorage.setItem("loginAccess", JSON.stringify(data))
            callback(true)
        })
        .catch(error => {
            console.error("Error:", error);
        });

}



