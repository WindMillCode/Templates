$app_source = ".\apps\backend\FlaskApp"
$app_source_exclude =  ".\apps\backend\FlaskApp\site-packages"
$gae_orig = ".\apps\devops\FlaskGAE"
$destination = ".\apps\devops\FlaskGAENew"
$exclude = "site-packages"

rm -r $destination
mkdir $destination
Copy-Item $app_source\* $destination -Exclude @("site-packages","__pycache__") -Recurse
Copy-Item  $gae_orig\*  $destination
cd $destination
mv  windmillcodesite-gae.json ./my_resources
docker cp . windmillcodesite-linux-helper:/flask-backend/app
docker exec -i windmillcodesite-linux-helper sh -c '
cd /flask-backend/app;
mv app.preview.yaml app.yaml;
gcloud app deploy --quiet
'
