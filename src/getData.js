
import { getapikey } from './getApiKey';

async function getData(tdxUrl, callback, errorCallback) {
    console.log("[GET DATA]\nfrom: ", tdxUrl, "\ngetTdxData.js")

    if (!localStorage.getItem("loginAccess")) {
        await getapikey()
    }
    var accesstoken = JSON.parse(localStorage.getItem("loginAccess"));

    fetch(tdxUrl, {
        method: "GET",
        headers: {
            "authorization": "Bearer " + accesstoken.access_token,
        }
    })
        .then(res => res.json())
        .then((res) => callback(res))
        .catch((...error) => errorCallback(error))
}
export default getData;