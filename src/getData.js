import { getapikey } from './getApiKey';

async function getData(tdxUrl, callback, errorCallback) {
    console.log("[GET DATA]\nfrom: ", tdxUrl, "\ngetTdxData.js")

    // if (!localStorage.getItem("loginAccess")) {
    //     await getapikey()
    // }
    // var accesstoken = JSON.parse(localStorage.getItem("loginAccess"));

    fetch("/api/get", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiurl: tdxUrl })
    })
        .then(res => res.json())
        .then((res) => callback(res))
        .catch((...error) => errorCallback(error))
}
export default getData;