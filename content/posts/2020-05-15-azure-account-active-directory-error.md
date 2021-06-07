---
title: "Fixing Azure Account Active Directory Association Error"
date: 2020-05-15T20:01:32+01:00
tags: ["microsoft", "azure", "power bi", "microsoft 365", "azure active directory"]
draft: false
---

If you've tried to create a Microsoft Azure subscription using an existing Microsoft 365 (formerly Office 365) or Microsoft Power BI account, depending on how the account is setup you might have been redirected to [this static page](https://account.azure.com/Error/NoValidTenant/100) which displays the following error message:

>>> Your account belongs to a directory that cannot be associated with an Azure subscription. Please sign in with a different account.

It's not immediately clear what this means. After a bit of research, I was able to establish that the directory referred to is an Azure Active Directory. When signing up for a Microsoft 365 or Power BI account, an unmanaged Azure Active Directory is created in the background which your account is then assigned to. The problem here is that we can't create an Azure subscription unless this account has the **Global Administrator** role within the Azure Active Directory.

The resolution is mentioned in [this Microsoft Support page](https://support.microsoft.com/en-us/help/4052156/account-to-a-directory-cannot-associated-with-an-azure-subscription). A simplified version is as follows:

1. Head to [the admin takeover page](https://portal.office.com/admintakeover) within the Microsoft 365 portal.
2. If you're not already signed in, ensure that you're signed in using your Microsoft 365 account, which should have the same domain as the one which you're receiving the Azure subscription error on. If you have a Power BI account rather than a Microsoft 365 account, then sign in using those credentials instead.
3. You'll be presented with an option to verify that you're the owner of the domain. Add the `TXT` record within the settings of your DNS. This could take up to 72 hours to propogate, depending on your DNS provider.
4. Click to verify - Azure will check that the `TXT` record exists on the domain.

You should now be able to create an Azure subscription using this account.