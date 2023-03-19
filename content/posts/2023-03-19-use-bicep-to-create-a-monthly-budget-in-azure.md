---
categories:
  - Automation
  - Microsoft Azure
  - Bicep
  - PowerShell
date: 2023-03-19T21:00:00+01:00
draft: false
lastMod: 2023-03-19T21:00:00+01:00
tags:
  - Automation
  - Microsoft Azure
  - Bicep
  - PowerShell
title: Use Bicep to create a monthly budget in Azure
---

I've recently started experimenting with [Bicep](https://github.com/Azure/bicep)
for deploying Azure resources declaratively.

In this post, I'll show you how to create a Bicep file which declares a simple
Azure Budget with a monthly alert.

## Creating the `.bicep` file

Create a new file, called `main.bicep`.

The first thing we'll declare in this file is the target scope of any
resources that we create. In this case, the Budget we're creating will be
created at a Subscription level.

```bicep
targetScope = 'subscription'
```

Next, we'll declare some input parameters to be used when we deploy our
resources.

```bicep
param startDate string
param endDate string
param email array
```

The `startDate` and `endDate` will be used to configure how long our Budget
lasts, whilst the `email` array will be used to send email alerts.

Finally, we'll declare the Budget resource itself.

```bicep
resource budget 'Microsoft.Consumption/budgets@2021-10-01' = {
  name: 'BudgetMonthly'
  properties: {
    timePeriod: {
      startDate: startDate
      endDate: endDate
    }
    timeGrain: 'Monthly'
    amount: 10
    category: 'Cost'
    notifications: {
      NotificationForExceededBudget1: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 90
        contactEmails: email
      }
      NotificationForExceededBudget2: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 110
        contactEmails: email
      }
    }
  }
}
```

The `thresholds` within the two notification objects can be thought of as our
triggers; the first threshold of `90` means that we'll send a notification once
we've exceeded 90% of our `amount` (which in this case is $10, meaning $0.90);
the second threshold of `110` means that we'll send a notification once we've
exceeded 110% of our `amount` ($1.10).

## Deploying the resources declared in the `.bicep` file

If you don't already have the Azure CLI installed, you can find an installation
guide at [Microsoft Learn](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).

With the Azure CLI installed and authenticated, deploying the resource is done
using the following PowerShell commands:

```powershell
$email = @("user@contoso.com")

New-AzSubscriptionDeployment -Name budgetMonthly -Location uksouth -TemplateFile ./main.bicep -startDate "2023-03-01" -endDate "2023-12-31" -email $email
```
