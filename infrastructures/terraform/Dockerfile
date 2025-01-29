FROM python:3.11-slim-bullseye

WORKDIR /project

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y curl unzip vim groff less make jq zip

RUN mkdir /root/.aws/

# aws-cliのインストール
ARG AWSCLI_VERSION="2.17.12"
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.17.12.zip" -o "/tmp/awscliv2.zip"
RUN unzip -o /tmp/awscliv2.zip -d /tmp
RUN /tmp/aws/install
RUN rm -rf /tmp/aws /tmp/awscliv2.zip

# Session Manager Pluginをダウンロードしてインストール
ARG SESSION_MANAGER_PLUGIN_VERSION="1.2.650.0"
RUN curl "https://s3.amazonaws.com/session-manager-downloads/plugin/${SESSION_MANAGER_PLUGIN_VERSION}/ubuntu_64bit/session-manager-plugin.deb" -o "/tmp/session-manager-plugin.deb"
RUN dpkg -i /tmp/session-manager-plugin.deb
RUN rm /tmp/session-manager-plugin.deb

# teraformのインストール
ARG TERRAFORM_VERSION="1.8.0"
RUN curl "https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip" -o "/tmp/terraform.zip"
RUN unzip /tmp/terraform.zip -d /tmp
RUN mv /tmp/terraform /usr/local/bin/
RUN rm /tmp/terraform.zip

# tflintのインストール
ARG TFLINT_VERSION="0.52.0"
RUN curl -L "https://github.com/terraform-linters/tflint/releases/download/v${TFLINT_VERSION}/tflint_linux_amd64.zip" -o "/tmp/tflint.zip"
RUN unzip /tmp/tflint.zip -d /tmp
RUN mv /tmp/tflint /usr/local/bin/
RUN rm /tmp/tflint.zip
