Dockerfile and support files for deploying a separate proxy container to support forwarding requests.

Runs as a non-privileged user on port 8080 by default.

Set environment variable `REGISTRY_SERVICE` to the URL for the registry service to be proxied.

Includes current medin redirects for environment registry.

Can override these by mounting file into /etc/nginx/conf.d/registry/proxy-env-registry.conf which could be an EFS cross mount from registry container `/var/opt/ldproxy`.
