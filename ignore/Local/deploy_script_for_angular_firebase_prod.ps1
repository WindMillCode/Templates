$path = $MyInvocation.MyCommand.Path
if (!$path) {$path = $psISE.CurrentFile.Fullpath}
if ($path)  {$path = Split-Path $path -Parent}


$app_source = $path +"\..\..\apps\frontend\AngularApp"
$app_dist_source = $path +"\..\..\apps\frontend\AngularApp\dist\angular-app-prod"
$angular_build_destination = $path +"\..\..\apps\cloud\FirebaseApp\dist\angular-app-prod"
$fb_dest = $path +"\..\..\apps\cloud\FirebaseApp"

cd $app_source
yarn build:prod

cp  -r $app_dist_source $angular_build_destination
cd $fb_dest
npx firebase deploy  --only hosting:tooboards-57f9c --config angular.firebase.prod.json
rm -r $angular_build_destination
rm -r $app_dist_source
Set-Location ..\..\..
