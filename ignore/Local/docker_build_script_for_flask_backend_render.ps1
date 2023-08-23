$app_source = ".\apps\zero\backend\FlaskApp"
$app_source_exclude =  ".\apps\zero\backend\FlaskApp\site-packages"
# $docker_source = ".\apps\zero\devops\FlaskECS"
$destination = ".\apps\zero\devops\FlaskRenderDocker"
$exclude = "site-packages"

rm -r $destination
mkdir $destination
Copy-Item $app_source\* $destination -Exclude @("site-packages","__pycache__") -Recurse
# cp   $docker_source\* $destination
cd $destination
# docker build -t your-app/your-appsite-ecs-flask-backend-image-0  .
# docker tag your-app/your-appsite-ecs-flask-backend-image-0:latest 719639031870.dkr.ecr.us-east-1.amazonaws.com/your-appsite/your-appsite-ecs-flask-backend-image-0:latest
# docker container run -it --name my_linux_notebook --privileged=true your-app/docker-img-0:0.0.7 bash
