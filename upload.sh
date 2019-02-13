set -a
. .enviroments/prod/setup.sh
set +a

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

ssh -nNT -o ServerAliveInterval=30 -R $LOCAL:localhost:$REMOTE $SSHTUNEL &


meteor run --port $LOCAL --settings $METEOR_SETTINGS_FILE


ssh $SSHCIMETEOR cat /var/www/cimeteor/local.sh | bash -s -- .envoriments/prod/setup.sh
