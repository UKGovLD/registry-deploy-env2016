# build and push docker image to LDS ECR repository
# Override verisons by setting variables (environment or make command line):
#    REGISTRY_VERSION (default 2.3.6)

REGISTRY_VERSION?=2.3.6
REPO?=853478862498.dkr.ecr.eu-west-1.amazonaws.com
IMAGE?=epimorphics/env-registry

.PHONY: push
push: build just-push

.PHONY: build
build:
	docker build --build-arg REGISTRY_VERSION=$(REGISTRY_VERSION) -t "$(IMAGE):latest" .
	docker tag "$(IMAGE):latest" "$(REPO)/$(IMAGE):$(REGISTRY_VERSION)"

.PHONY: just-push
just-push: 
	docker push "$(REPO)/$(IMAGE):$(REGISTRY_VERSION)"
