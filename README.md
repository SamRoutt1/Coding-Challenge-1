1. Install/Init:
    * "brew install mariadb" somewhere in terminal followed by "mysql.server start"
    * go to root directory of wherever you will run the code and "git clone" 
    * do "npm install mariadb" 
    * be sure data exists in a folder called "data"

2. DB setup:
    * login mysql with "mysql -u root" 
    * before running each time, manually "DROP DATABASE myMDB;" if it exists, then create database with "CREATE DATABASE myMDB;"

3. Run:
    * run with "nodemon" 