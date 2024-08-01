ARG PIP_VERSION=22.0.2
ARG BASE_IMAGE=ubuntu:22.04

FROM ${BASE_IMAGE} as build-image-base

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get --no-install-recommends install -yq \
        curl \
        make \
        pkg-config \
        python3-dev \
        python3-pip \
    && rm -rf /var/lib/apt/lists/*

ARG PIP_VERSION

RUN python3 -m pip install -U pip==${PIP_VERSION}

FROM build-image-base AS build-image-av
COPY requirements/requirements-base.txt /tmp/requirements/requirements.txt 
RUN pip install -r /tmp/requirements/requirements.txt  --extra-index-url https://pypi.apple.com/simple
COPY sourcerer/ /home/sourcerer/

ENV PYTHONPATH "${PYTHONPATH}:/home"
WORKDIR /home/sourcerer/

EXPOSE 8080
VOLUME ["/home/sourcerer/sourcererdb"]
ENTRYPOINT ["python3", "cli.py", "--action", "run-with-ui"]

