environment="$1"

[ -z "$environment" ] && echo "missing Environment Name parameter" && exit

cd server || exit

pulumi stack select "$environment"
pulumi destroy --yes --non-interactive --color always