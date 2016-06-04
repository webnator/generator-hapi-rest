#!/usr/bin/env bash

CONSUL_DOMAIN=""
CONSUL_API_KV="/v1/kv"
CONSUL_API_PORT="8500"
MASTER_TOKEN=""

APP_NAME=$1
PREFIX=$2
DB_NAME=$3

if [[ ! -z $APP_NAME && ! -z $PREFIX && ! -z $DB_NAME ]]; then

  # Mongo config
  sh -c "curl -s -X PUT \"$CONSUL_DOMAIN:$CONSUL_API_PORT$CONSUL_API_KV/$APP_NAME/"$PREFIX"_MONGO_IP?token=$MASTER_TOKEN\" -d \"mongo.service.consul\" "
  sh -c "curl -s -X PUT \"$CONSUL_DOMAIN:$CONSUL_API_PORT$CONSUL_API_KV/$APP_NAME/"$PREFIX"_MONGO_PORT?token=$MASTER_TOKEN\" -d \"10017\" "
  sh -c "curl -s -X PUT \"$CONSUL_DOMAIN:$CONSUL_API_PORT$CONSUL_API_KV/$APP_NAME/"$PREFIX"_MONGO_DDBB_NAME?token=$MASTER_TOKEN\" -d \"$DB_NAME\" "
  # App settings
  sh -c "curl -s -X PUT \"$CONSUL_DOMAIN:$CONSUL_API_PORT$CONSUL_API_KV/$APP_NAME/"$PREFIX"_IP?token=$MASTER_TOKEN\" -d \"localhost\" "
  sh -c "curl -s -X PUT \"$CONSUL_DOMAIN:$CONSUL_API_PORT$CONSUL_API_KV/$APP_NAME/"$PREFIX"_PORT?token=$MASTER_TOKEN\" -d \"9000\" "
  sh -c "curl -s -X PUT \"$CONSUL_DOMAIN:$CONSUL_API_PORT$CONSUL_API_KV/$APP_NAME/"$PREFIX"_LOGLEVEL?token=$MASTER_TOKEN\" -d \"debug\" "
  # Environment settings
  sh -c "curl -s -X PUT \"$CONSUL_DOMAIN:$CONSUL_API_PORT$CONSUL_API_KV/$APP_NAME/"$PREFIX"_NODE_ENV?token=$MASTER_TOKEN\" -d \"production\" "

else
  echo "Bad arguments: "$@
  echo ""
fi
