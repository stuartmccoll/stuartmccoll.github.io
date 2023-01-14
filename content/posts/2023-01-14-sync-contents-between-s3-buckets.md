---
categories:
  - Amazon Web Services
  - AWS
  - S3
  - Terraform
date: 2023-01-14T11:32:05Z
draft: false
tags:
  - Amazon Web Services
  - AWS
  - S3
  - Terraform
title: Sync contents between two S3 Buckets
---

Something I've had to do on more than one occassion recently is copy the
contents of one S3 bucket to another S3 bucket. There is no built-in way
of doing this in the AWS Management Console, but it _is_ possible using
the AWS Command Line Interface (CLI).

As an example, I'm going to create two new S3 buckets in my AWS account
using Terraform, push some objects into my source bucket, and then copy
the contents of this bucket into my target bucket. If you'd like to
skip the setup and jump straight to the instructions, head to the
[Syncing contents](#syncing-contents) section.

## Provisioning our infrastructure

I'm going to use Terraform to create two S3 buckets with some basic
configuration, one named `${account-id}-source`, and the other named
`${account-id}-target`. If you're playing along, the following steps
assume that you have Terraform installed and AWS credentials configured
locally.

First, we'll create a new directory to store out Terraform files.

```bash
mkdir sync-s3-bucket-contents
```

In this directory, we'll create a new `versions.tf` file.

```bash
touch versions.tf
```

In this file we'll declare our required Terraform version and provider(s).

```terraform
terraform {
  required_version = ">= 1.3.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.50.0"
    }
  }
}
```

Next, we'll create a new `main.tf` file.

```bash
touch main.tf
```

In this file, we'll utilise our provider:

```terraform
provider "aws" {
  region = local.region
}
```

We'll declare our local variables:

```terraform
locals {
  account_id = data.aws_caller_identity.current.account_id
  region     = "eu-west-2"
}
```

And we'll grab the AWS account identifier being used, so that we can
use that in our S3 bucket names to ensure that they're unique:

```terraform
data "aws_caller_identity" "current" {}
```

Finally, we'll declare our S3 buckets:

```terraform
module "s3_source_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "${local.account_id}-source-bucket"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  acl = "private"

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }
}

module "s3_target_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "${local.account_id}-target-bucket"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  acl = "private"

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }
}
```

Altogether, our `main.tf` file should look like this:

```terraform
provider "aws" {
  region = local.region
}

locals {
  account_id = data.aws_caller_identity.current.account_id
  region     = "eu-west-2"
}

data "aws_caller_identity" "current" {}

module "s3_source_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "${local.account_id}-source-bucket"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  acl = "private"

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }
}

module "s3_target_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "${local.account_id}-target-bucket"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  acl = "private"

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }
}
```

With that in place, we'll run `terraform init` to initiliase everything,
followed by `terraform validate` to ensure that everything we've written is
valid Terraform code. `terraform plan` will tell us exactly what Terraform will
provision. Finally, running `terraform apply` will provision our infrastructure.

## Adding items to our source S3 bucket

Again, if you're playing along, the following section assumes that you have
the AWS CLI installed, and AWS credentials configured locally.

I've created two `.txt` files locally, `test-1.txt` and `test-2.txt`. To move
these from my local machine into our source S3 bucket, I can use the following
AWS CLI command:

```bash
aws s3 mv test-1.txt s3://${my-account-id}-source-bucket
aws s3 mv test-2.txt s3://${my-account-id}-source-bucket
```

To check that the files have successfully been moved, I can run the following
AWS CLI command:

```bash
aws s3 ls ${my-account-id}-source-bucket
```

## Syncing contents

Now, to sync the contents from the source bucket to the target bucket, I run
the following AWS CLI command:

```bash
aws s3 sync s3://${my-account-id}-source-bucket s3://${my-account-id}-target-bucket
```

## Tearing down our infrastructure

Finally, to remove the infrastructure I provisioned for this example, I can
run `terraform destroy`.
