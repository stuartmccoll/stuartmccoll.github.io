---
title: "Attaching to list items with the Microsoft SharePoint REST API"
date: 2020-06-22T16:00:48+01:00
tags: ["microsoft", "sharepoint", "rest", "api", "postman"]
draft: false
---

In my [last blog post](../2020-06-18-creating-list-items-with-sharepoint-rest-api) I explained how to create list items with Microsoft's legacy SharePoint REST API using Postman. This post builds on that work to attach a file to an existing list item.

---

Assuming you've been following along, we have a SharePoint list with at least one item in it that we've created through a request sent from Postman to the Microsoft SharePoint REST API. The item we created will have been assigned an `id` within SharePoint. If you don't still have the response from our creation request to hand (which will have contained the ID in the response body), you can obtain it from SharePoint. Access the list item and then click the 'Copy Link' shortcut. A URL will be copied to your clipboard which looks like the following:

```
https://contoso.sharepoint.com/Lists/Test%20list/DispForm.aspx?ID=1&e=...
```

The `id` we need is right there in the URL, within the `ID` parameter.

Let's add an attachment to this list item. Open a new Postman request, which we'll be sending as a `POST`. Use the following details, where `contoso` is replaced with your own tenant name, `Test list` is replaced with your own SharePoint list name, and `id` with your own list item identifier as discussed above:

```http
POST https://contoso.sharepoint.com/_api/web/lists/GetByTitle('Test list')/items(1)/AttachmentFiles/add(FileName='microsoft-logo.jpg')
Authorization: Bearer {{appReg_bearerToken}}
```

We're going to do something different this time. Select the 'Body' tab and then the 'binary' radio button. You should see a 'Select File' button. We're going to upload the following image as our attachment:

![Microsoft logo][microsoft-logo]

Click the 'Select File' button and then select the `microsoft-logo.jpg` file. Now click 'Send' to send our `POST` request to the SharePoint REST API. You should receive a `200` HTTP status code in response, with an XML response body. The XML will contain some details about the attachment, such as the server relative path, etc. If you now browse to your list item within SharePoint you should be able to see that we've successfully attached our file.

[microsoft-logo]: /img/microsoft-logo.jpg
