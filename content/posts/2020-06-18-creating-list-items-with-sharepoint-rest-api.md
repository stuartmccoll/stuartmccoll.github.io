---
title: "Creating list items with the Microsoft SharePoint REST API"
date: 2020-06-18T19:30:00+01:00
tags: ["microsoft", "sharepoint", "rest", "api", "postman"]
draft: false
---

In my [last blog post](../2020-06-16-sharepoint-api-authentication-with-postman) I explained how to authenticate requests to Microsoft's legacy SharePoint REST API using Postman. This post builds on that work to store our access token as a Postman environment variable and to then send `POST` requests to the SharePoint REST API to create new items within an existing SharePoint list.

---

If you were following along previously, the last thing we did was to request an access token to use in future requests. We're going to write a couple of lines of JavaScript code within Postman which will parse the API response containing the access token and add it to our previously-created Postman environment.

You should still have a Postman tab open ready to send a request to the following URL:

```
https://accounts.accesscontrol.windows.net/{{realm}}/tokens/OAuth/2
```

Click on the 'Tests' tab. In the empty window, add the following two lines of code:

```javascript
const json_response_body = JSON.parse(responseBody);
postman.setEnvironmentVariable("appReg_bearerToken", json_response_body.access_token);
```

Click 'Send' to send our `POST` request. You should receive a response body containing an `access_token` key/value pair. The value of the `access_token` key will now have been added as the 'Current Value' of our `appReg_bearerToken` Postman environment variable. You can confirm this by clicking the eye icon next to the environments dropdown and checking the environment variable values.

We're now ready to create a new item within an existing SharePoint list. To do so, we need to know the `ListItemEntityTypeFullName` of the list. Let's open a new request in Postman, which we're going to send to the following URL (replacing `contoso` with your tenant name, and 'Test list' with your own list name):

```http
GET https://contoso.sharepoint.com/_api/web/lists/GetByTitle('Test list')?$select=ListItemEntityTypeFullName
Authorization: Bearer {{appReg_bearerToken}}
Accept: application/json;odata=nometadata
```

Before sending, let's add a test to this Postman request which will grab the `ListItemEntityTypeFullName` value and store it as a Postman environment variable. Click the 'Tests' tab and in the empty window add the following two lines of code:

```javascript
const json_response_body = JSON.parse(responseBody);
postman.setEnvironmentVariable("ListItemEntityTypeFullName", json_response_body.ListItemEntityTypeFullName);
```

You should receive a response body which looks something like the following:

```json
{
    "ListItemEntityTypeFullName": "SP.Data.Test_x0020_listListItem"
}
```

The value of the `ListItemEntityTypeFullName` key will now have been added as the 'Current Value' of our `ListItemEntityTypeFullName` Postman environment variable. You can confirm this by clicking the eye icon next to the environments dropdown and checking the environment variable values.

We're now ready to create our test item in our existing SharePoint list. Open a new Postman request, which we'll be sending as a `POST`. Use the following details, where `contoso` is replaced with your own tenant name and 'Test list' is replaced with your own SharePoint list name (note the **double** underscore before `metadata`):

```http
POST https://contoso.sharepoint.com/_api/web/lists/GetByTitle('Test list')/items
Authorization: Bearer {{appReg_bearerToken}}
Accept: application/json;odata=verbose
Content-Type: application/json;odata=verbose

{
    "__metadata": {
        "type": "{{ListItemEntityTypeFullName}}"
    },
    "Title": "My test item"
}
```

Send this request and you should receive a `201` status code in response, as well as a lengthy response body. Check your SharePoint list and you should see that the item has been successfully created.

We can also use the API to retrieve this item. Create a new Postman request and send the following (replacing `contoso` with your own tenant name, 'Test list' with your own list name and `1` with the id you will have received in the previous response body after creating your item):

```http
GET https://contoso.sharepoint.com/_api/web/lists/GetByTitle('Test list')/items(1)
Authorization: Bearer {{appReg_bearerToken}}
Accept: application/json;odata=verbose
```

You should receive a `200` status code in response, as well as a response body containing your chosen SharePoint list item.

In my next blog post I'll look at how we can use the SharePoint REST API to add attachments to our list items.
