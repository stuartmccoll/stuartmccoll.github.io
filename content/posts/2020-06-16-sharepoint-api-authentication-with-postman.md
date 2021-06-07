---
title: "Microsoft SharePoint API Access with Postman"
date: 2020-06-16T21:30:00+01:00
tags: ["microsoft", "sharepoint", "api", "postman"]
draft: false
---

[Microsoft Graph API](https://developer.microsoft.com/en-us/graph/) has largely superceded [v1 of the SharePoint REST API](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service?tabs=csom) for API-driven interaction with SharePoint online, but there are still a few things that you can't do with it. For example, at the time of writing, it's not possible to use Microsoft Graph API to add attachments to a list item, or retrieve attachments from an existing list item. The legacy SharePoint REST API *does* allow for this functionality. Authentication with the Graph API and the legacy SharePoint REST API also differs - the following acts as a tutorial for configuring interaction with the legacy SharePoint REST API using [Postman](https://www.postman.com).

For my SharePoint setup, I've used a developer subscription from the [Microsoft 365 Developer Program](https://developer.microsoft.com/en-us/microsoft-365/dev-program). This allows me to administrate my own free SharePoint configuration, add pre-configured users from a sample data pack, and more.

---

Ultimately, what we're trying to do is get an access token which will allow Postman authorised access to SharePoint. There are some steps we need to carry out first.

## Register a SharePoint Add-In

To authorise our external system - in this case Postman, but it could also be an external application - SharePoint needs to know about it.

To begin, login to your SharePoint site. Then, access the following URL (where `contoso` is your own tenant name):

```
https://contoso.sharepoint.com/_layouts/15/appregnew.aspx
```

This page allows us to register our SharePoint Add-In. You should see five input fields - `Client Id`, `Client Secret`, `Title`, `App Domain`, `Redirect URI`. Click the 'Generate' button next to both 'Client Id' and 'Client Secret', then make a note of the values populated - we'll need these later. You can enter anything in 'Title' - we'll go with 'Postman' for now. 'App Domain' should be `localhost` and 'Redirect URI' should be `https://localhost`. Click the 'Create' button. You should see a success message returned, with the information you added to the input fields.

## Grant permissions to a SharePoint Add-In

Assuming you're still logged into your SharePoint site, access the following URL (again, where `contoso` is your own tenant name):

```
https://contoso.sharepoint.com/_layouts/15/appinv.aspx
```

We can use this page to grant different permissions to any registered SharePoint Add-Ins. Paste the 'Client Id' that we generated when registering our Add-In into the 'App Id' field, and then click the 'Lookup' button. This should prepopulate the other fields on the page. However, it won't populate the 'Permission Request XML' field. In this field, paste the following XML:

```xml
<AppPermissionRequests AllowAppOnlyPolicy="true">
    <AppPermissionRequest Scope="http://sharepoint/content/sitecollection/web" Right="FullControl" />
</AppPermissionRequests>
```

This will grant our Add-In full permissions on our SharePoint site. Your use case may call for more granular permissions. If that's the case, see [this Microsoft documentation](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/add-in-permissions-in-sharepoint) for details on how to adapt this XML to be more granular.

Once you're happy with the XML that will grant permissions to our SharePoint Add-In, click the 'Create' button. You'll see a screen asking if you trust the Add-In - click 'Trust it'.

## Creating a Postman environment

Within Postman, you'll see a dropdown in the top right corner of the screen containing the words `No Environment`. Next to this is an eye icon - click this to bring up a list of variables local to the environment and a list of global environment variables. Depending on your prior usage, you might see different things here. Click 'Add' in the top right corner.

Enter a descriptive environment name - such as `Microsoft SharePoint REST API`. In the table below, we're going to add five environment variables - enter the values in the 'Initial Value' column.

`appReg_clientId` should contain our 'Client Id' for our SharePoint Add-In.

`appReg_clientSecret` should contain our 'Client Secret' for our SharePoint Add-In.

`targetHost` should contain `contoso.sharepoint.com` where `contoso` is your own tenant name.

`principal` should contain `00000003-0000-0ff1-ce00-000000000000`.

`realm` should contain your tenant ID.

To find your tenant ID, you can send a `GET` request to (where `contoso` is your own tenant name):

```
https://contoso.sharepoint.com/_vti_bin/client.svc/
```

You'll receive a `System.UnauthorizedAccessException` in the response body, but we're interested in the headers here. Inside the `WWW-Authenticate` header, you'll see `Bearer realm="<GUID>"...`. The GUID value is your tenant ID, which you'll want to set as the value of `realm` in our environment variables.

Be careful here to check that the 'Current Value' column for each environment variable doesn't contain a new line at the end of each value. If it does, it'll stop us from being able to use these environment variables correctly.

With that done, click 'Add' to save our Postman environment.

## Requesting an access token

Let's create a new Postman request, with an HTTP method of `POST`. Our URL should be:

```
https://accounts.accesscontrol.windows.net/{{realm}}/tokens/OAuth/2
```

The `{{realm}}` in the middle of the URL will pull from our `realm` environment variable.

In the 'Body' section, select `x-www-form-urlencoded`. We're going to create four key/value pairs.

`grant_type` should have a value of `client_credentials`.

`client_id` should have a value of `{{appReg_clientId}}@{{realm}}`.

`client_secret` should have a value of `{{appReg_clientSecret}}`.

Finally, `resource`, should have a value of `{{principal}}/{{targetHost}}@{{realm}}`.

Now, click 'Send' and the SharePoint REST API will respond with an access token that can be used in future requests to the API. We'll use this in a future tutorial to create new list items with attachments.
