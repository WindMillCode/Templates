CREATE USER 'mysqladmin'@'%' IDENTIFIED WITH mysql_native_password BY 'my-secret-pw';
FLUSH PRIVILEGES;
CREATE DATABASE windmillcodesite_mysql_database_0;
GRANT ALL PRIVILEGES ON *.* TO 'mysqladmin'@'%' IDENTIFIED BY 'my-secret-pw';
GRANT ALL PRIVILEGES ON *.* TO 'mysqladmin'@'%';

