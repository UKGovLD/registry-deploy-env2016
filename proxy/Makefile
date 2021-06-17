# build and push docker image to LDS ECR repository
# Override verisons by setting variables (environment or make command line):
#    REGISTRY_VERSION (default 2.3.1)

REPO?=853478862498.dkr.ecr.eu-west-1.amazonaws.com
IMAGE?=epimorphics/env-registry-proxy

.PHONY: push
push: build just-push

.PHONY: build
build:
	docker build -t "$(IMAGE):latest" .
	docker tag "$(IMAGE):latest" "$(REPO)/$(IMAGE):latest"

.PHONY: just-push
just-push: 
	docker push "$(REPO)/$(IMAGE):latest"
