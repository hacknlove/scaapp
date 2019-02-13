set -a
. .enviroments/dev/setup.sh
set +a
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

if [ -z "$SSHTUNEL" ];
then
  ssh -nNT -o ServerAliveInterval=30 -R $LOCAL:localhost:$REMOTE $SSHTUNEL &
fi

meteor run --port $LOCAL --settings $METEOR_SETTINGS_FILE
