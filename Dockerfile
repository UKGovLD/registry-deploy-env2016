FROM tomcat:8.5.87-jdk8-corretto
ARG REGISTRY_VERSION=2.3.15
ARG REGISTRY_WAR=https://s3-eu-west-1.amazonaws.com/ukgovld/release/com/github/ukgovld/registry-core/${REGISTRY_VERSION}/registry-core-${REGISTRY_VERSION}.war

RUN yum update -y \
  && yum install -y shadow-utils \
  && yum clean all

COPY logging-conf/WEB-INF /tmp/WEB-INF
COPY conf/META-INF /tmp/META-INF

RUN curl -s ${REGISTRY_WAR} > /usr/local/tomcat/webapps/registry.war \
  && jar uvf /usr/local/tomcat/webapps/registry.war -C /tmp WEB-INF/classes -C /tmp META-INF/context.xml \
  && mkdir -p /opt/ldregistry \
  && mkdir -p /var/log/ldregistry \
  && mkdir -p /var/log/ldproxy \
  && ln -s /usr/bin/bash /usr/bin/sudo
COPY ldregistry /opt/ldregistry
COPY conf/server.xml /usr/local/tomcat/conf/server.xml

RUN adduser -u 1000 app \
  && chown -R app /opt/ldregistry /usr/local/tomcat /var/log/ldregistry
  
USER app
