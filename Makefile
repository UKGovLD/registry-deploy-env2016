# build and push docker image to LDS ECR repository
# Override verisons by setting variables (environment or make command line):
#    REGISTRY_VERSION (default 2.3.15)

REGISTRY_VERSION?=2.3.15
IMAGE?=epimorphics/env-registry

.PHONY: build
build:
	docker build --build-arg REGISTRY_VERSION=$(REGISTRY_VERSION) -t "$(IMAGE):latest" .
	docker tag "$(IMAGE):latest" "$(REPO)/$(IMAGE):$(REGISTRY_VERSION)"
