# registry-deploy-env2016

This is a customization of registry-config-base for the 2016 release of the Defra Environment registry.

Should set upstream to enable changes to be pulled in:

    git remote add upstream git@github.com:UKGovLD/registry-config-base.git

## Installation

While this includes the `install` and `scripts` areas they are not used, this is deployed using a separate chef cookbook.

touch
=======
## Change notes

A substantial restructuring of the UI templates and assets is underway. The key changes are noted here:

   * Moved UI assets to subdirectory `ui/assets`. This makes it easier to configure the front end web serve to serve the static assets directly, with only the ui templates being served from tomcat.

   * Updated default look and feel to be more consistent with, but not infringe, gov.uk styling. This is created using sass to customize boostrap 3.3.6. The new subdirectory `ui-customize` contains the sass scripts and instructions for regenerating the styling.

   * Restructure the UI templates to split into smaller, more maintanable parts with more consistent naming convention. 

   * Simplify the default UI
      * splitting the "admin" tab into separate "actions" and "adminstrators"
      * flattening the "registration" action
      * move some actions to "advanced" menu
      * improved "create register" dialog
    These are aimed a supporting common opertions where a register might be manually created but most content is upload from CSV (or maybe jsonld or ttl files) with "patch" mode being a good universal default. Clarifies the differences between patch, upload and batch-upload by hiding beind verbose radio buttons on the "Register new of changed entries" action dialog
