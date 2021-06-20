# Using tomcat7 for now but should be compatible with tomcat 8
FROM tomcat:7.0-jdk8-corretto

ARG REGISTRY_VERSION=2.3.1

RUN yum -y install shadow-utils

RUN curl -s https://s3-eu-west-1.amazonaws.com/ukgovld/release/com/github/ukgovld/registry-core/${REGISTRY_VERSION}/registry-core-${REGISTRY_VERSION}.war > /usr/local/tomcat/webapps/registry.war \
  && mkdir -p /opt/ldregistry \
  && mkdir -p /var/log/ldregistry \
  && mkdir -p /var/log/ldproxy \
  && ln -s /usr/bin/bash /usr/bin/sudo

COPY ldregistry /opt/ldregistry

# Patch logging
COPY log4j.properties /tmp/build/WEB-INF/classes/log4j.properties
RUN cd /tmp/build \
  && mkdir -p WEB-INF/lib \
  && curl -s https://repo1.maven.org/maven2/net/logstash/log4j/jsonevent-layout/1.7/jsonevent-layout-1.7.jar > WEB-INF/lib/jsonevent-layout-1.7.jar \
  && curl -s https://repo1.maven.org/maven2/net/minidev/json-smart/1.1.1/json-smart-1.1.1.jar > WEB-INF/lib/json-smart-1.1.1.jar \
  && jar -uf /usr/local/tomcat/webapps/registry.war WEB-INF

RUN adduser -u 1000 app \
  && chown -R app /opt/ldregistry /usr/local/tomcat /var/log/ldregistry
  
USER app
