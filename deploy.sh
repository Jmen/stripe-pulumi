environment="$1"

[ -z "$environment" ] && echo "missing Environment Name parameter" && exit

cd client || exit

echo "REACT_APP_API_BASE_URL=stripe-api-${environment}.jaimen-pulumi.co.uk" > .env

yarn install
yarn build

cd ..
cd server || exit

yarn install
pulumi stack select "$environment"
pulumi up --yes --non-interactive --color always