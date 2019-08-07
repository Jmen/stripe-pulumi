environment=$1
parentDomain=$2

[ -z "$environment" ] && echo "missing Environment Name parameter" && exit
[ -z "$parentDomain" ] && echo "missing Parent Domain parameter" && exit

cd server || exit

pulumi stack init "$environment"
pulumi config set aws:region eu-west-1
pulumi config set stripe:parentDomain "$parentDomain"