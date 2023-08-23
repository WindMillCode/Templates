CREATE USER 'myadmin'@'%' IDENTIFIED WITH mysql_native_password BY 'my-secret-pw';
FLUSH PRIVILEGES;
CREATE DATABASE your_app_mysql_database_0;
-- GRANT ALL PRIVILEGES ON *.* TO 'myadmin'@'%' IDENTIFIED BY 'my-secret-pw';
GRANT ALL PRIVILEGES ON *.* TO 'myadmin'@'%';

