environment="$1"

[ -z "$environment" ] && echo "missing Environment Name parameter" && exit

cd client || exit

echo "REACT_APP_ENVIRONMENT=$environment" > .env

yarn install
yarn build

cd ..
cd server || exit

yarn install
pulumi stack select "$environment"
pulumi up --yes