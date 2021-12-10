FROM tomcat:7.0.109-jdk8-corretto

ARG REGISTRY_VERSION=2.3.6

RUN yum update -y \
  && yum install -y shadow-utils \
  && yum clean all

RUN curl -s https://s3-eu-west-1.amazonaws.com/ukgovld/release/com/github/ukgovld/registry-core/${REGISTRY_VERSION}/registry-core-${REGISTRY_VERSION}.war > /usr/local/tomcat/webapps/registry.war \
  && mkdir -p /opt/ldregistry \
  && mkdir -p /var/log/ldregistry \
  && mkdir -p /var/log/ldproxy \
  && ln -s /usr/bin/bash /usr/bin/sudo
COPY ldregistry /opt/ldregistry

RUN adduser -u 1000 app \
  && chown -R app /opt/ldregistry /usr/local/tomcat /var/log/ldregistry
  
USER app
