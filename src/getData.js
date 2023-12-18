import $ from 'jquery'

async function getData(tdxUrl, callback, errorCallback) {
    console.log("[GET DATA]\nfrom: ", tdxUrl, "\ngetTdxData.js")
    async function getapikey() {
        var tdxLogin = {
            grant_type: "client_credentials",
            client_id: "jerry20200815-905e4c2d-f4f9-42dd",
            client_secret: "df5c085e-f262-4258-b1d6-518e40138f71"
        };
        $.ajax({
            type: "POST",
            url: "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token",
            crossDomain: true,
            dataType: 'JSON',
            data: tdxLogin,
            async: false,
            success: function (data) {
                console.log(data)
                localStorage.setItem("loginAccess", JSON.stringify(data))
            },
            error: function (xhr, textStatus, thrownError) {
                errorCallback(textStatus, thrownError)
            }
        });
    }


    if (!localStorage.getItem("loginAccess")) {
        await getapikey()
    }
    var accesstoken = JSON.parse(localStorage.getItem("loginAccess"));
    $.ajax({
        url: tdxUrl,
        method: "GET",
        dataType: "json",
        async: true,
        headers: {
            "authorization": "Bearer " + accesstoken.access_token,
        },
        success: function (res) {

            callback(res)
            return res
        },
        error: function (xhr, textStatus, thrownError) {
            getapikey()
        }
    })


}
export default getData;