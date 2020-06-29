#!/bin/bash

LDIR=/tmp/inkfish/dev-ldap
PIDF=$LDIR/slapd.pid
CONF=./support/dev/dev-slapd.conf

if [[ -e $PIDF ]]
then
    kill $(cat $PIDF)
    sleep 2
fi

if [[ -d $LDIR ]]
then
    rm -rf $LDIR
fi

mkdir -p $LDIR/data
chmod 644 $CONF

/usr/sbin/slapd -f $CONF -h ldap://localhost:3389
sleep 2
ldapadd -h localhost:3389 -D cn=admin,dc=example,dc=com -w test -f test/scripts/test-data.ldif
