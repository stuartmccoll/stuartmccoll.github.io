---
categories:
  - Automation
  - GitHub Actions
  - Microsoft Azure
date: 2022-06-11T11:15:00+01:00
draft: false
lastMod: 2022-06-11T11:15:00+01:00
tags:
  - Automation
  - GitHub Actions
  - Microsoft Azure
title: Push a Docker image to Azure Container Registry using a GitHub Actions workflow
---

Building and pushing Docker images to Azure Container Registry is simple with
a small GitHub Actions workflow.

This blog post assumes you've got a `docker-compose.yml` file in your GitHub
repository. If you're just using a `Dockerfile`, you'll need to make a tiny
amendment to the `Build Docker image` step in the `push-to-acr.yml` file
described below.

## Microsoft Azure setup/configuration

If you're starting fresh, in terms of our Azure setup we'll need:
* a Resource Group;
* an Azure Container Registry (ACR);
* and an access key so that we can access our ACR programmatically from our
GitHub Actions workflow.

If you've already got this configured, you can skip to the
[next section](#github-actions-workflow).

I'll use PowerShell to create this. First, our Resource Group.

```powershell
New-AzResourceGroup -Name "mydemoappghatoacr" -Location "UK South"
```

With that done, we'll create our ACR within this Resource Group.

```powershell
New-AzContainerRegistry -ResourceGroupName "mydemoappghatoacr" -Name "mydemoappghatoacr" -Sku "Basic" -EnableAdminUser
```

Finally, let's grab the access key values we'll need to connect to our ACR
from our GitHub Actions workflow.

```powershell
Get-AzContainerRegistryCredential -ResourceGroupName "mydemoappghatoacr" -Name "mydemoappghatoacr"
```

Make a note of the `Username` and `Password` values from this response.

## GitHub Actions workflow

Before we create our GitHub Actions workflow, we'll add a couple of Actions
secrets to our GitHub repository. These are encrypted environment variables
that can be used within our GitHub Actions workflow(s), which stops us from
exposing values that we want to remain secure, such as our Microsoft Azure
client ID and secret.

Head to your GitHub repository, and navigate to the Settings screen. In here,
you should be able to find a Secrets section under the Security subheading.
Secrets currently allows you to configure secrets for Actions, Codespaces,
and Dependabot. Select Actions, and then click 'New repository secret'.

We'll be adding three Actions secrets:
1. `ACR_REGISTRY_NAME`, containing the name of your ACR.
2. `AZ_SP_CLIENT_ID` containing the `Username` value you noted earlier.
3. `AZ_SP_CLIENT_SECRET` containing the `Password` value you noted earlier.

In your repository, create a new directory named `.github`. Inside here, we'll
create another new directory named `workflows`, inside which we'll add a new
empty file named `push-to-acr.yml`, with the resulting file path being
`.\.github\workflows\push-to-acr.yml`.

First, we'll give our workflow a name, and some run configuration. In this
case we're telling GitHub Actions to run this workflow when we push code
to our `main` branch.

Secondly, we're checking out the repository code.

```yml
name: Push to Azure Container Registry
on:
  push:
    branches:
      - main

jobs:
  push-to-azure-container-registry:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@main
```

In order for our GitHub Actions workflow to push to ACR, it'll need to
authenticate using the credentials we've stored as GitHub Actions secrets.
To do this, we'll use the [Azure Container Registry Login](https://github.com/marketplace/actions/azure-container-registry-login)
GitHub Action available on the [GitHub Marketplace](https://github.com/marketplace).
This GitHub Action will handle the authentication for us, we just need to
tell it what values to use.

```yml
- name: Login to Azure Container Registry
        uses: azure/docker-login@v1
        with:
          login-server: ${{ secrets.ACR_REGISTRY_NAME }}.azurecr.io
          username: ${{ secrets.AZ_SP_CLIENT_ID }}
          password: ${{ secrets.AZ_SP_CLIENT_SECRET }}
```

Next, we'll add a simple step to our workflow that will build our Docker image.

```yml
- name: Build Docker image
run: docker-compose build
```

Our workflow is now capable of checking out our codebase and building our
Docker image. The final step is to push this image to our pre-configured
Azure Container Registry.

Let's add this final step to our workflow. This last step will tag the image
we've just built with the Git commit SHA, and then push this tagged image
to ACR.

```yml
- name: Push Docker image to Azure Container Registry
  run: |
    docker tag mydemoapp:latest ${{ secrets.ACR_REGISTRY_NAME }}.azurecr.io/mydemoapp:${{ github.sha }}
    docker push ${{ secrets.ACR_REGISTRY_NAME }}.azurecr.io/mydemoapp:${{ github.sha }}
```

Our full GitHub Actions workflow file looks like the following:

```yml
name: Push to Azure Container Registry
on:
  push:
    branches:
      - main

jobs:
  push-to-azure-container-registry:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@main

      - name: Login to Azure Container Registry
        uses: azure/docker-login@v1
        with:
          login-server: ${{ secrets.ACR_REGISTRY_NAME }}.azurecr.io
          username: ${{ secrets.AZ_SP_CLIENT_ID }}
          password: ${{ secrets.AZ_SP_CLIENT_SECRET }}

      - name: Build Docker image
        run: docker-compose build

      - name: Push Docker image to Azure Container Registry
        run: |
            docker tag mydemoapp:latest ${{ secrets.ACR_REGISTRY_NAME }}.azurecr.io/mydemoapp:${{ github.sha }}
            docker push ${{ secrets.ACR_REGISTRY_NAME }}.azurecr.io/mydemoapp:${{ github.sha }}
```
