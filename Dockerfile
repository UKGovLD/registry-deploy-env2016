# Using tomcat7 for now but should be compatible with tomcat 8
FROM tomcat:7.0-jdk8-corretto

ARG REGISTRY_VERSION=2.3.1

RUN yum -y install shadow-utils

RUN curl -s https://s3-eu-west-1.amazonaws.com/ukgovld/release/com/github/ukgovld/registry-core/${REGISTRY_VERSION}/registry-core-${REGISTRY_VERSION}.war > /usr/local/tomcat/webapps/registry.war \
  && mkdir -p /opt/ldregistry \
  && mkdir -p /var/log/ldregistry \
  && ln -s /usr/bin/bash /usr/bin/sudo
COPY ldregistry /opt/ldregistry

RUN adduser -u 1000 app \
  && chown -R app /opt/ldregistry /usr/local/tomcat /var/log/ldregistry
  
USER app
