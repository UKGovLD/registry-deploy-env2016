# build and push docker image to LDS ECR repository
# Override verisons by setting variables (environment or make command line):
#    REGISTRY_VERSION (default 2.3.1)

REGISTRY_VERSION?=2.3.1
REPO?=853478862498.dkr.ecr.eu-west-1.amazonaws.com

.PHONY: push
push: build just-push

.PHONY: build
build:
	docker build --build-arg REGISTRY_VERSION=$(REGISTRY_VERSION) -t "epimorphics/env-registry:latest" .
	docker tag "epimorphics/env-registry:latest" "$(REPO)/epimorphics/env-registry:$(REGISTRY_VERSION)"

.PHONY: just-push
just-push: 
	docker push "$(REPO)/epimorphics/hmlr-elda:$(REGISTRY_VERSION)"
