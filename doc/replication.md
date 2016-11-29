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

## Issues

The replication script currently just plays directly to the slave.

If the slave is down then the replication will fail with no catch up option.

Ideally the script would register in a broker that will do a safe replay if needed.
C.f. use of s3 and dms-util for update distribution in DMS.
