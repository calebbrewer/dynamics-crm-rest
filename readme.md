#dynamics-crm-rest
dynamics-crm-rest is a node module for interfacing with the [Microsoft Dynamics CRM REST (Web) API](https://msdn.microsoft.com/en-us/library/mt593051.aspx). If you’ve had issues with Microsoft’s adal-node tool for authing against the API (The auth is handled by an Azure app) then this module will make you happy.

`GET, POST, PATCH, PUT, and DELETE are supported.` 

**Note: This module needs more error handling and tests. That said, it does work well.**
**This module uses es6 classes, so you will need a version of NODE that supports them.**

##Install
`npm install dynamics-crm-rest`

##Setting Up Azure App for Authing
Dynamics uses Azure AD Applications to get an OAuth token, so you will need to register a “Native” app with Azure and use the “Application ID” in dynamics-crm-rest. You will need to give the app rights to Dynamics CRM, and you will need an Azure AD user with rights to the app. You will be using the users creds to auth against the app. I don’t like having to use an AD user, but that’s the way Microsoft does it. If adal-node worked I would use it.
Here is a link to a Microsoft article showing how to register an app with Azure AD. Scroll down to “App registration for OAuth authentication”. Also, make sure you choose “Native App” when registering. [https://msdn.microsoft.com/en-us/library/mt622431.aspx](https://msdn.microsoft.com/en-us/library/mt622431.aspx).

##Module Usage
```
let DynamicsCrmRest = require('dynamics-crm-rest');

let crm = new DynamicsCrmRest({
    orgName: ‘exampleOrgName’,
    orgDomain: ‘example.onmicrosoft.com',
    clientId: ‘’, //This is the app id from the Azure app you registered
    username: '', //The Azure AD user with rights to the app
    password: '' //The user’s password
});

//crm.HTTPMethod("endPoint", {dataObject}, callback(err, res) {}); 
//There is not dataObject for the GET or DELETE methods. 

crm.get("contacts", function(err, res) {
    if(err) {
        console.error(err);
    }
    else {
        console.log(res);
    }
});

crm.post("contacts", {
    firstname: ‘John’,
    lastname: ‘Smith’,
    mobilephone: ‘555-555-5555’,
    emailaddress1: ‘example@example.com’,
}, function(err, res) {
    if(err) {
        console.error(err);
    }
    else {
        console.log(res);
    }
});  
```

##To Do
- Add better error handling
- Add tests
- Add token refresh so it doesn't have to get a new token every time. 