---
title: "Retrieving files from Microsoft Azure blob storage"
date: 2020-09-21T18:08:50+01:00
draft: false
images:
- img/microsoft-azure-logo.png
---

Recently on the Digital Service Design Team at [The National Lottery Heritage Fund](https://www.heritagefund.org.uk/) we've been investigating [Microsoft Azure blob storage](https://azure.microsoft.com/en-gb/services/storage/blobs/) as an option for storing files as part of a service we're building. 

Before writing any code, we tested some of our assumptions about things like access and structure by calling the [Microsoft Azure Storage REST API](https://docs.microsoft.com/en-us/rest/api/storageservices/) from [Postman](https://www.postman.com). This post documents a few of those tests using a basic Azure blob storage setup, using a Shared Key authorisation scheme to list files in a container; list files using a prefix; and to retrieve a specific file.

---

To begin, let's make sure that we have the following in our Azure account:

1. A Storage Account.
2. A container in our Storage Account.
3. A file in our container.

In Azure, open the **Storage accounts** service.

Click on the **Add** button.

Within the **Project details** section, choose a **Subscription** to create the Storage Account within, and then either select an existing **Resource group** or click **Create new** to add a new **Resource group**.

If you run into any errors around naming Storage Accounts or containers whilst following along, don't worry - choose a name that works for you. Just remember to update any URIs or code from the rest of the tutorial to match the name(s) you've chosen.

Under **Instance details**, let's go with `storage_account_name` as our **Storage account name**, we'll choose **(Europe) UK South** as the **Location**, select the **Standard** radio button for **Performance**, select **BlobStorage** within the **Account kind** dropdown and select **Locally-redundant storage (LRS)** within the **Replication** dropdown. For **Blob access tier (default)** we'll go with **Hot**.

Click the **Advanced** tab. Under the **Security** section, set **Allow Blob public access** to **Disabled**.

Click the **Review + create** button. We should see a *Validation passed* notification, and we can now go ahead and click the **Create** button. At this point Azure will start deploying our new Storage Account, which will take a few seconds. Once done, click the **Go to resource** button.

We've now ticked off the first item in our list, so we're ready to move onto creating a container within our Storage Account.

From the navigation menu on the left, click the **Containers** menu item beneath the **Blob service** heading.

Click the **+ Container** button.

Let's go with `container_name` as our container **Name** - then click the **Create** button. It'll take Azure just a second to add our new container.

From the list of containers, select the one which we just added.

From this page, click the **Upload** button. An **Upload blob** pane should appear, where we can select and upload a file. Select your file - in my case I'm uploading `test.txt`, and then click on the **Upload** button.

That's the end of our preparation. In our Azure account we now have a Storage Account, within which we have a single container, within which we have a single file.

---

Our file in Azure will have a URI that looks something like:

```
https://storage_account_name.blob.core.windows.net/container_name/test.txt
```

Because we've restricted the access level to our Storage Account, we can't simply access this URI to retrieve our file - we'll need to authorise our request. To do this, we're going to use [Shared Key authorisation](https://docs.microsoft.com/en-us/rest/api/storageservices/authorize-with-shared-key) (authorisation with Azure Active Directory is also available).

Shared Key authorisation requires that we set two headers in our request; `x-ms-date` (or `Date`) and `Authorization`.

To start with, let's set Postman up so that it will send through the correct `x-ms-date` header.

In Postman, click the **Eye** (Environment quick look) icon in the top right-hand corner, then click **Add** in the top right-hand corner of the modal that appears. In the **Environment Name** field, let's enter `Microsoft Azure Storage REST API` and then let's add two empty environment variables; `dateHeader` and `authSig`. They're going to be initialised as empty, as we're going to set them programmatically when we make our API request. Click the **Add** button.

Now, let's create a new Postman request - choose `GET` as the HTTP method. For our URI, let's begin by listing the files within the container. To do so, the URI will have the following format:

```
https://storage_account_name.blob.core.windows.net/container_name?restype=container&comp=list
```

The arguments in this URI are telling Azure that we're providing a resource type of `container`, of which we want to `list` the contents.

In the **Headers** tab, add an `x-ms-date` header and set the value as `{{dateHeader}}`, and add an `Authorization` header with a value of `{{authSig}}`.

If you send the request at this point, you'll get back the following error:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Error>
    <Code>InvalidAuthenticationInfo</Code>
    <Message>Authentication information is not given in the correct format. Check the value of Authorization header.
RequestId:{{A_GUID}}
Time:{{TIMESTAMP}}</Message>
</Error>
```

That's because we haven't set our environment variables. In the **Pre-request Script** tab, add the following code:

```javascript
// Key value should contain an Access Key string taken from Microsoft Azure Storage Account
const key = "YOUR_ACCESS_KEY";

// Add current timestamp to an environment variable
pm.environment.set("dateHeader", new Date().toUTCString());

// Create the string to sign (this needs to match exactly what the server is expecting)
const strToSign = 'GET\n\n\n\nx-ms-date:' + pm.environment.get("dateHeader") + '\n/storage_account_name/container_name?comp=list';

const secret = CryptoJS.enc.Base64.parse(key);

const hash = CryptoJS.HmacSHA256(strToSign, secret);

const base64EncodedHash = CryptoJS.enc.Base64.stringify(hash);

// Add the string required for the Authorization header to an environment variable
pm.environment.set("authSig", "SharedKey storage_account_name:" + base64EncodedHash);
```

Let's break this down:

* First, we're declaring a variable which contains an Access Key to our Storage Account
* Then, we're adding the current timestamp to our `dateHeader` environment variable
* Then, we construct the signature string, which will change based on the request you're making
* Next, we encode this string by using the HMAC-SHA256 algorithm over the UTF-8-encoded signature string
* Finally, we add this to our `authSig` environment variable.

Back in Azure, open your Storage Account and open the **Access keys** section. Grab the **Key** value of **key1** and paste this back into Postman over the top of `YOUR_ACCESS_KEY` in the script from above.

Now, hit the **Send** button in Postman. You should receive back something similar to the following XML:

```xml
<?xml version="1.0" encoding="utf-8"?>
<EnumerationResults ServiceEndpoint="https://storage_account_name.blob.core.windows.net/" ContainerName="container_name">
    <Blobs>
        <Blob>
            <Name>test.txt</Name>
            <Properties>
                <Last-Modified>Fri, 18 Sep 2020 08:33:01 GMT</Last-Modified>
                <Etag>0x8D85BAD74489912</Etag>
                <Content-Length>28</Content-Length>
                <Content-Type>text/plain</Content-Type>
                <Content-Encoding />
                <Content-Language />
                <Content-MD5>f10cU58khe1Nmi/4MQlCfw==</Content-MD5>
                <Cache-Control />
                <Content-Disposition />
                <BlobType>BlockBlob</BlobType>
                <LeaseStatus>unlocked</LeaseStatus>
                <LeaseState>available</LeaseState>
            </Properties>
        </Blob>
    </Blobs>
    <NextMarker />
</EnumerationResults>
```

Listing files using a prefix isn't too dissimilar. First, let's try with a prefix that won't match anything. Start with the same request as above, but this time let's set our request URI to:

```
https://storage_account_name.blob.core.windows.net/container_name?restype=container&comp=list&prefix=nofileshere
```

We don't have a file in our container whose filename begins with `nofileshere`, so this won't bring back any matches. In this case, we don't need to amend the `strToSign` variable, it'll work as before. Hit the **Send** button and your response should look as follows:

```xml
<?xml version="1.0" encoding="utf-8"?>
<EnumerationResults ServiceEndpoint="https://storage_account_name.blob.core.windows.net/" ContainerName="container_name">
    <Prefix>nofileshere</Prefix>
    <Blobs />
    <NextMarker />
</EnumerationResults>
```

Change the `prefix` argument in our URI to `test` however (assuming you've named your file `test.txt`) and your response should look as so:

```xml
<?xml version="1.0" encoding="utf-8"?>
<EnumerationResults ServiceEndpoint="https://storage_account_name.blob.core.windows.net/" ContainerName="container_name">
    <Prefix>test</Prefix>
    <Blobs>
        <Blob>
            <Name>test.txt</Name>
            <Properties>
                <Last-Modified>Fri, 18 Sep 2020 08:33:01 GMT</Last-Modified>
                <Etag>0x8D85BAD74489912</Etag>
                <Content-Length>28</Content-Length>
                <Content-Type>text/plain</Content-Type>
                <Content-Encoding />
                <Content-Language />
                <Content-MD5>f10cU58khe1Nmi/4MQlCfw==</Content-MD5>
                <Cache-Control />
                <Content-Disposition />
                <BlobType>BlockBlob</BlobType>
                <LeaseStatus>unlocked</LeaseStatus>
                <LeaseState>available</LeaseState>
            </Properties>
        </Blob>
    </Blobs>
    <NextMarker />
</EnumerationResults>
```

Finally, we want to retrieve the contents of our file. We know it's there, so how can we bring back what's inside it?

Change the URI in your Postman request to:

```
https://storage_account_name.blob.core.windows.net/container_name/test.txt
```

If you try and **Send** this request now, it won't work - the hashed and encoded string we're sending in our `Authorization` header doesn't match what the server is expecting. Update the `strToSign` variable declaration in the **Pre-request Script** tab to the following:

```javascript
const strToSign = 'GET\n\n\n\nx-ms-date:' + pm.environment.get("dateHeader") + '\n/storage_account_name/container_name/test.txt';
```

What you get in response will depend on the file you've added - in my case, it's a `.txt` file containing `These are my file contents`, which is exactly what gets returned in Postman's response body output.