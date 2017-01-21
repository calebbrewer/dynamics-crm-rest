"use strict";
var request = require('request');
var toJson = require('safe-json-parse/callback');

class DynamicsCrmRest {
    constructor(params) {
        this.params = params;
    }

    auth(params, callback) {
        //Need error handling to make sure the required params are provided
        var body = 'client_id=' + encodeURI(params.clientId) + '&resource=https%3A%2F%2F' + params.orgName + '.crm.dynamics.com&username=' + encodeURI(params.username) + '&password=' + encodeURI(params.password) + '&grant_type=password'

        request({ method: 'POST', url: 'https://login.windows.net/' + params.orgDomain + '/oauth2/token', headers: { 'Cache-Control': 'no-cache', 'Content-Type': 'application/x-www-form-urlencoded' }, body: body }, function (err, res, body) {
            if (err) {
                callback(err)
            }
            else {
                toJson(body, function (err, json) {
                    if (err) {
                        console.error('toJson error in auth: ' + err);
                    }
                    else {
                        if (json.error) {
                            callback(json.error);
                        }
                        else {
                            callback(null, json.access_token);
                        }
                    }
                });
            }
        });
    };

    get isTokenGood() {
        //Need to renew the token
        console.log(this.lastTokenCreated);
        if (this.lastTokenCreationTime && new Date().getMilliseconds > this.lastTokenCreationTime + 3600) {
            return false;
        }
        else {
            return true;
        }
    };

    getToken(callback) {
        /*if(this.isTokenGood) {
            console.log('good token', this.lastTokenCreationTime);
            callback(this.lastTokenCreated);
        }
        else {*/
        //console.log('bad token');
        var setTokenInfo = function (token, tokenSetTime) {
            this.lastTokenCreated = token;
            this.lastTokenCreationTime = tokenSetTime;
        }

        this.auth(this.params, function (err, authToken) {
            if (err) {
                console.error(err);
                return 'error'
            }
            else {
                //setTokenInfo(authToken, new Date().getMilliseconds);            
                callback(authToken);
            }
        });
        //}
    };

    /***************/

    get(endPoint, callback) {
        var orgName = this.params.orgName;

        this.getToken(function (token) {
            request({ url: 'https://' + orgName + '.api.crm.dynamics.com/api/data/v8.1/' + endPoint, headers: { 'OData-MaxVersion': '4.0', 'OData-Version': '4.0', 'Accept': 'application/json', 'Authorization': 'Bearer ' + token } }, function (err, response, body) {
                if (err) {
                    callback(err);
                }
                else {
                    toJson(body, function (err, json) {
                        if (err) {
                            console.error('toJson error in auth: ' + err);
                        }
                        else {
                            if (json.error) {
                                callback(json.error);
                            }
                            else {
                                if (json.value) {
                                    callback(null, json.value);
                                }
                                else {
                                    callback(null, json);
                                }
                            }
                        }
                    });
                }
            });
        });
    };

    post(endPoint, data, callback) {
        var orgName = this.params.orgName;

        this.getToken(function (token) {
            request({ method: 'POST', url: 'https://' + orgName + '.api.crm.dynamics.com/api/data/v8.1/' + endPoint, headers: { 'OData-MaxVersion': '4.0', 'OData-Version': '4.0', 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify(data) }, function (err, response, body) {
                if (err) {
                    callback(err);
                }
                else if (response.statusCode == 204) {
                    //Expect this when your operation succeeds but does not return data in the response body.
                    callback(null, 'Dynamics CRM POST success!')
                }
                else {
                    toJson(body, function (err, json) {
                        if (err) {
                            console.error('toJson error in auth: ' + err);
                        }
                        else {
                            if (json.error) {
                                callback(json.error);
                            }
                            else {
                                if (json.value) {
                                    callback(null, json.value);
                                }
                                else {
                                    callback(null, json);
                                }
                            }
                        }
                    });
                }
            });
        });
    };

    put(endPoint, data, callback) {
        var orgName = this.params.orgName;

        this.getToken(function (token) {
            request({ method: 'PUT', url: 'https://' + orgName + '.api.crm.dynamics.com/api/data/v8.1/' + endPoint, headers: { 'OData-MaxVersion': '4.0', 'OData-Version': '4.0', 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify(data) }, function (err, response, body) {
                if (err) {
                    callback('request error', err);
                }
                else if (response.statusCode == 204) {
                    //Expect this when your operation succeeds but does not return data in the response body.
                    callback(null, 'Dynamics CRM PUT success!')
                }
                else {
                    toJson(body, function (err, json) {
                        if (err) {
                            console.error('toJson error in auth: ' + err);
                        }
                        else {
                            if (json.error) {
                                callback('json error: ', json);
                            }
                            else {
                                if (json.value) {
                                    callback(null, json.value);
                                }
                                else {
                                    callback(null, json);
                                }
                            }
                        }
                    });
                }
            });
        });
    };

    patch(endPoint, data, callback) {
        var orgName = this.params.orgName;

        this.getToken(function (token) {
            request({ method: 'PATCH', url: 'https://' + orgName + '.api.crm.dynamics.com/api/data/v8.1/' + endPoint, headers: { 'OData-MaxVersion': '4.0', 'OData-Version': '4.0', 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify(data) }, function (err, response, body) {
                if (err) {
                    callback('request error', err);
                }
                else if (response.statusCode == 204) {
                    //Expect this when your operation succeeds but does not return data in the response body.
                    callback(null, 'Dynamics CRM PATCH success!')
                }
                else {
                    toJson(body, function (err, json) {
                        if (err) {
                            console.error('toJson error in auth: ' + err);
                        }
                        else {
                            if (json.error) {
                                callback('json error: ', json);
                            }
                            else {
                                if (json.value) {
                                    callback(null, json.value);
                                }
                                else {
                                    callback(null, json);
                                }
                            }
                        }
                    });
                }
            });
        });
    };

    delete(endPoint, callback) {
        var orgName = this.params.orgName;

        this.getToken(function (token) {
            request({ method: 'DELETE', url: 'https://' + orgName + '.api.crm.dynamics.com/api/data/v8.1/' + endPoint, headers: { 'OData-MaxVersion': '4.0', 'OData-Version': '4.0', 'Accept': 'application/json', 'Authorization': 'Bearer ' + token } }, function (err, response, body) {
                //console.log(response);
                if (err) {
                    callback('request error', err);
                }
                else if (response.statusCode == 204) {
                    //Expect this when your operation succeeds but does not return data in the response body.
                    callback(null, 'Dynamics CRM DELETE success!')
                }
                else {
                    toJson(body, function (err, json) {
                        if (err) {
                            console.error('toJson error in auth: ' + err);
                        }
                        else {
                            if (json.error) {
                                callback(json);
                            }
                            else {
                                if (json.value) {
                                    callback(null, json.value);
                                }
                                else {
                                    callback(null, json);
                                }
                            }
                        }
                    });
                }
            });
        });
    };
};

module.exports = DynamicsCrmRest;