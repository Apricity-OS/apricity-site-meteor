mongoimport -h localhost:3001 --db meteor --collection imported_categories --type json --jsonArray --file meteor_categories.json
mongoimport -h localhost:3001 --db meteor --collection imported_discussions --type json --jsonArray --file meteor_discussions.json
mongoimport -h localhost:3001 --db meteor --collection imported_comments --type json --jsonArray --file meteor_comments.json
mongoimport -h localhost:3001 --db meteor --collection imported_users --type json --jsonArray --file meteor_users.json
mongoimport -h localhost:3001 --db meteor --collection configs --type json --jsonArray --file default-configs.json
mongoimport -h localhost:3001 --db meteor --collection content --type json --jsonArray --file content.json
mongoimport -h localhost:3001 --db meteor --collection posts --type json --jsonArray --file blog-posts.json
