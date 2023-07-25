$app_source = ".\apps\backend\FlaskApp"
$app_source_exclude =  ".\apps\backend\FlaskApp\site-packages"
# $docker_source = ".\apps\devops\FlaskECS"
$destination = ".\apps\devops\FlaskRenderDocker"
$exclude = "site-packages"

rm -r $destination
mkdir $destination
Copy-Item $app_source\* $destination -Exclude @("site-packages","__pycache__") -Recurse
# cp   $docker_source\* $destination
cd $destination
# docker build -t windmillcode/windmillcodesite-ecs-flask-backend-image-0  .
# docker tag windmillcode/windmillcodesite-ecs-flask-backend-image-0:latest 719639031870.dkr.ecr.us-east-1.amazonaws.com/windmillcodesite/windmillcodesite-ecs-flask-backend-image-0:latest
# docker container run -it --name my_linux_notebook --privileged=true windmillcode/docker-img-0:0.0.7 bash
