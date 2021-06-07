---
title: "HTTP/S Redirects for AWS Route 53 Using S3"
date: 2020-02-07T20:45:35Z
tags: ["software development", "devops", "aws", "route53", "s3"]
draft: false
---

I moved hosting of my domains recently from [tsoHost](https://www.tsohost.com) to [Amazon Web Services](https://aws.amazon.com), as uptime on tsoHost seems to have been slowly getting worse. Rather than using disparate providers for different services, I chose AWS to sit everything under one provider.

Shifting to AWS itself was relatively easy - I'm now using [Amazon WorkMail](https://aws.amazon.com/workmail/) for my email service and [Amazon Route 53](https://aws.amazon.com/route53/) for DNS. The documentation for switching to both from another provider was straight forward and I was up and running within a few days.

Out of the box, Route 53 doesn't provide the ability to redirect to sites hosted outside of AWS. It's achievable with the use of another Amazon service, S3 (Simple Storage Bucket).

## Guide

Create a new S3 bucket in the [Amazon S3 console](https://console.aws.amazon.com/s3/). Give it a name which matches your domain - `example.com`. Keep all of the default settings. 

Once created, enter the 'Properties' section of the bucket, and select 'Static Website Hosting'. In here, select 'Redirect all request to another host name', which will provide you with two input fields to fill in. Add the domain to redirect to in the first, let's assume it's `https://www.example.net`, and enter one of `http` or `https` in the second, before saving.

In the [Route 53 console](https://console.aws.amazon.com/route53/), choose your matching hosted zone - in this case it'd be `example.com`.

In here, create a new resource record (by clicking 'Create Record Set'). Select a 'Record type' of 'A - IPv4 address'. Select the 'Alias' option, and within 'Alias Target', you'll be provided with a list of your AWS resources which you can redirect to. Your S3 bucket will be listed under a heading of 'S3 Website Endpoints'. Leave 'Routing Policy' as 'Simple' and 'Evaluate Health Target' as 'No', then click 'Create' to create the record.

The change might take a little bit of time to propogate. It was instant for me. You can test this by running `curl --head example.com`. This returned the following headers for my request `HTTP/1.1 301 Moved Permanently`, `Server: AmazonS3`, and `Location: https://www.example.net/`, confirming that the change had propogated.

To ensure redirects for both `example.com` and `www.example.com`, you'll want to follow the same process as above, this time creating an S3 bucket with a name of `www.example.com` and pointing another new record set for your domain at this second S3 bucket.