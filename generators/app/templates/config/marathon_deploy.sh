#!/bin/bash

# User config vars
CONFIG_REGISTRY="<%= dockerRepo %>"
APP_IMG=$CONFIG_REGISTRY"/nodejs:onbuild"
DEPLOY_IMG=$CONFIG_REGISTRY"/architecture/ops:0.2.0"

# Global vars
APP_NAME=`cat marathon.json | jq .id -r`
TAG_CODE=`cat marathon.json | jq .container.docker.image -r | rev | cut -d ":" -f1 | rev`
OS=`UNAME`

# Reminds the user to update the marathon file
echo "Did you remember to edit the container image tag in your marathon.json file? (y/n) "
read TAG_EDITED

if [ "$(tr [A-Z] [a-z] <<< "$TAG_EDITED")" != "y" ]; then
  echo "DEPLOY FAILED"
  echo "Please edit the container image tag in your marathon.json file"
  exit
fi

# Sets the application access
echo "Please set the level of visibility for your application 0-5 (0 default)"
echo "\n============================================================================="
echo "\n======== 0 - (default) Internal service,it won't create an ELB =============="
echo "\n======== 1 - ELB limited to BBVA                               =============="
echo "\n======== 2 - ELB limited to BBVA and Wifi Corporate            =============="
echo "\n======== 3 - ELB limited to Intelygenz                         =============="
echo "\n======== 4 - ELB limited to Intelygenz and BBVA                =============="
echo "\n======== 5 - ELB public                                        =============="
echo "\n============================================================================="
read IMG_ACCESS

if [ -z "$VAR" ]; then
  IMG_ACCESS="0"
fi

CHANGES=`git status --porcelain`
PUSHED=`git status -b --porcelain  | grep "ahead"`

if [[ -z "$CHANGES" && -z "$PUSHED" ]]; then

  DOCKER_MACHINE=`docker-machine status default`
  if [ "$DOCKER_MACHINE" != "Running" ]; then
    echo "Docker machine is not running. Please start it"
    exit
  fi

  if [ "$(tr [A-Z] [a-z] <<< "$OS")" == "darwin" ]; then
    eval "$(docker-machine env default)"
  fi

  echo "Specify the message for the tag to be created: "
  read TAG_MSG

  echo "\n================================================="
  echo "\n======== Uploading tag to the repository ========"
  echo "\n================================================="
  echo "\n"
  # Uploads the tag to the repository
  git tag -d $TAG_CODE
  `git tag -a $TAG_CODE -m "$TAG_MSG"`
  `git push origin :refs/tags/$TAG_CODE`
  `git push origin $TAG_CODE`

  echo "\n================================================="
  echo "\n=== Pulling app Image in case it has changed ===="
  echo "\n================================================="
  echo "\n"
  # Does a pull of the app Image just in case it has changed
  docker pull $APP_IMG

  #dev.docker.kickstartteam.es:5000/kst
  LOCAL_IMG=$CONFIG_REGISTRY"/framework/"$APP_NAME":"$TAG_CODE
  echo "\n================================================="
  echo "\n========= Building docker image locally ========="
  echo "\n================================================="
  echo "\n"
  # Builds the docker image locally
  docker build -t $LOCAL_IMG .

  echo "\n================================================="
  echo "\n============= Pushing docker image =============="
  echo "\n================================================="
  echo "\n"
  # Push the image to the registry
  docker push $LOCAL_IMG

  REPO_NAME=`basename $(git remote show -n origin | grep Push | cut -d: -f2-)`
  REPO_NAME="${REPO_NAME%%.*}"
  echo "\n================================================="
  echo "\n======= Deploying application in Marathon ======="
  echo "\n================================================="
  echo "\n"
  # Deploys the application in Marathon
  docker run --rm $DEPLOY_IMG deploy_app $REPO_NAME $TAG_CODE $IMG_ACCESS

else
  echo "DEPLOY FAILED"
  echo "Dirty repository. Commit and push before deploy"
fi
