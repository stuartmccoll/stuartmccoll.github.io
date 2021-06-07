+++
date = "2017-05-14 10:10:32 +0000"
description = "Add a Flask application to a Docker container"
linktitle = ""
title = "Add a Flask Application to a Docker Container"
slug = "Add a Flask Application to a Docker Container"
type = "post"
+++

[Flask](http://flask.pocoo.org/) is a microframework for Python, based on [Werkzeug](http://werkzeug.pocoo.org/) and [Jinja2](http://jinja.pocoo.org/docs/2.9/). The core Flask framework is extremely lightweight, albeit infinitely extensible, and it's simple for an experienced developer to pick up. I had been using Laravel a lot at the beginning of the year and Flask has been a breeze to work with in comparison. With it's extensibility I haven't been locked into working with pre-defined components either; I've used different database abstraction layers across multiple projects, such as [Redis](https://redis.io/) and [PostgreSQL](https://www.postgresql.org/).

We'll need a few things to begin, the first of which is a directory to house our Flask application, which we'll call **flask_docker**.

```bash
$ mkdir flask_docker
```

Within this directory we're going to need to create two different files. Firstly, we'll create our Flask application. For this, I'm going to create a simple Flask app that'll return a string of text when the root directory is hit within a web browser.

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def simple():
    return 'Flask running within Docker container'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
```

With our basic Flask app written, we now want to be able to build our Docker image. We have a few options here, in that we could build from a base image of Ubuntu or something similar, but in this instance I'm just going to use the base Python 2.7 Docker image.

```docker
FROM python:2.7

RUN pip install flask

ADD . /app

WORKDIR /app

EXPOSE 5000

CMD ["python", "app.py"]
```

Once our base image has been established, our Dockerfile has a few more commands within it. Firstly, we're installing the Flask pip package (pip is included within the Python 2.7 Docker image that we our basing our own Docker image upon). After this, we copy the contents of the current directory to the '/app' directory within our Docker container, and then we set that as the current working directory. Following this, we expose port 5000 before lastly running the command that'll run our Flask application.

## Building the Docker Image

```bash
$ docker build -t our-flask-app .
```

This command will build the Dockerfile within the current working directory, giving the image a name of 'our-flask-app'.

```bash
$ docker run -d -p 5000:5000 our-flask-app
```

Lastly, this command builds our Docker container, which in turn runs our Flask application. The arguments we pass in here run the container in headless mode and map port 5000 on our local machine to port 5000 within our Docker container. Now, if we visit [http://0.0.0.0:5000/](http://0.0.0.0:5000/) in a web browser we'll be served the string that our Flask application returns.