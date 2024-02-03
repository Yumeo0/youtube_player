#!/bin/bash
set -e

# Install the necessary software
apt-get update
apt-get install -y gnupg curl

curl -fsSL https://deb.nodesource.com/setup_21.x | bash -
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

apt-get update
apt-get install -y git cron nodejs yarn

# Clone or pull the repository
mkdir -p "$GIT_DEST_PATH"
cd "$GIT_DEST_PATH"
if [ ! "$(ls -A $GIT_DEST_PATH)" ]; then
  git clone --branch "$GIT_BRANCH" "$GIT_REPO" .
else
  git fetch origin "$GIT_BRANCH"
  git reset --hard "origin/$GIT_BRANCH"
fi

# Run additional startup script
/scripts/start.sh

# Setup the cron job to pull changes every 10 minutes
echo "*/10 * * * * cd $GIT_DEST_PATH && git pull" | crontab -

# Start cron in the foreground
cron -f