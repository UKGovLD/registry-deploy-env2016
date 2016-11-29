# Notes on replication

Configured so that all servers will log actions to /var/opt/ldregistry/logstore
and will attempt to replication via script /opt/ldregistry/bin/replicate.sh

The URL to redirect logins to is current set to:

    https://environment.data.gov.uk/registry-master

The proxy should direct this to correct master server.

That script is in turn configured by /var/opt/ldregistry/replication-conf.sh
On the master this should define:

     RUPASSWORD  - password for user "replication" on the slave
     SLAVE       - root URL for server to replicate to

On the slave omit this file or set SLAVE to empty string to stop the slave trying to replicate.

