import { loginRequest } from "../authConfig";
import { msalInstance } from "../index";

const graphApiBaseUrl = "https://graph.microsoft.com/beta/"

function handleErrors(response) {
    if (!response.ok) throw Error(response.statusText);
    return response;
}

export async function callMsGraph(graphApiResourceUrl) {
    const account = msalInstance.getActiveAccount();
    if (!account) {
        throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
    }

    const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: account
    });

    const headers = new Headers();
    const bearer = `Bearer ${response.accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    let graphApiFullUrl = graphApiBaseUrl + graphApiResourceUrl
    return fetch(graphApiFullUrl, options)
        .then(handleErrors)
        .then(response => response.json())
        .catch(error => console.log("error: unable to request " + graphApiFullUrl));
}
