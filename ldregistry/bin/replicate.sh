#!/bin/bash
# Replication script for sending updates to a slave instance
# Imports a file /opt/ldregistry/replication-conf.sh which should define
#     RUPASSWORD  - password for user "replication"
#     SLAVE       - root URL for server to replicate to

[[ $# = 1 ]] || { echo "No log file given, aborting" 1>&2 ; exit 1 ; }
readonly log="$1"

. /opt/ldregistry/conf/replication-conf.sh

if [[ -z $SLAVE ]]; then
    echo "No slave configured"
    exit 0
fi

if ! curl -s --basic --user replication:$RUPASSWORD --data-binary "@$log" $SLAVE/system/replay ; then
    echo "Server access failed with curl status code $?"
    exit 1
fi
