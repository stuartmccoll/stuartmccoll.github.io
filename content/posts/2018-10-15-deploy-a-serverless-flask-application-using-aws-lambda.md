+++
date = "2018-10-17 22:00:00 +0000"
description = "Deploy a Serverless Flask Application with AWS Lambda"
linktitle = ""
title = "Deploy a Serverless Flask Application with AWS Lambda"
slug = "Deploy a Serverless Flask Application with AWS Lambda"
type = "post"
+++

[AWS Lambda](https://aws.amazon.com/lambda/) lets us run code without provisioning or managing servers, paying only for the compute time of the running code. There's no permanent infrastructure, and the server only has a life cycle of 40 *milliseconds*. AWS provides automatic horizontal scaling for Lambda applications, spinning up and down as many instances as are necessary.

An open source Python library, [Zappa](https://github.com/Miserlou/Zappa) gives us the ability to build and deploy serverless, event-driven Python applications on [AWS Lambda](https://aws.amazon.com/lambda/). Zappa works out of the box with WSGI web applications, such as Flask and Django. 

It's quick and easy to deploy a Python WSGI application to AWS Lambda. The below guide assumes you have an AWS account and have created an IAM user with the relevant permissions.

### Configuration

With [pip](https://pypi.org/project/pip/) installed locally, we'll grab the [awscli](https://pypi.org/project/awscli/) package.

```bash
$ pip install awscli
```

Once installed, the `aws configure` command will be the quickest way to configure our AWS credentials.

```bash
$ aws configure
```

This command will request four pieces of information.

```bash
AWS Access Key ID [None]:
```

This is the AWS Access Key ID of our IAM user with the relevant permissions.

```bash
AWS Secret Access Key [None]:
```

This is the AWS Secret Access Key of our IAM user with the relevant permissions.

```bash
Default region name [None]:
```

This can be left blank, which will default this value to `us-east-1`.

```bash
Default output format [None]:
```

This can also be left blank, which will default this value to `json`.

After running the command, the credentials will be stored in the AWS credentials file, located at `~/.aws/credentials`.

### Deployment

First, we'll create a `requirements.txt` file which will document the [pip](https://pypi.org/project/pip/) libraries our application will be dependent upon. Run the command below.

```bash
$ touch requirements.txt
```

And then add the following to this file:

```bash
awscli
flask
zappa
```

[Zappa](https://github.com/Miserlou/Zappa) needs a virtual environment to run, which we can create like so (after running `pip install virtualenv`):

```bash
$ virtualenv venv
```

That command will create our virtual environment in a new directory named `venv`. We can activate our virtual environment with the following command:

```bash
$ source venv/bin/activate
```

If we need to deactivate our virtual environment, we can do so by running the command `deactivate` or by exiting the terminal.

Once in the virtual environment, let's install the [pip](https://pypi.org/project/pip/) libraries from our `requirements.txt` file.

```bash
$ pip install -r requirements.txt
```

Our Flask application will sit in a file named `app.py`, which will serve one route that will return a JSON key/value pair.

```python
from flask import Flask, jsonify


app = Flask(__name__)

@app.route("/")
def index():
	return jsonify({"response": "Hello world"})

if __name__ == "__main__":
	app.run()
```

In order to deploy our application to AWS, we'll need to run a couple of Zappa commands. The following command begins an interactive process.

```bash
$ zappa init
```

This will prompt us for a few different values, which we'll leave as their defaults.

The next command we'll run will tell Zappa to bundle and upload our application and it's dependencies. As part of this process, Zappa will create the necessary API gateways.

```bash
$ zappa deploy dev
```

After running the above command, Zappa will return the URL where the application has been hosted. Hit this URL and we'll get back the following response:

```json
{"response":"Hello world"}
```

To remove the AWS Lambda function, and associated API gateway and Cloudwatch logs, we can run the `undeploy` command.

```bash
$ zappa undeploy dev
```
