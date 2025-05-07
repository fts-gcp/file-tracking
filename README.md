# Build production version
```shell
cd /home/username/my-nextjs-app
npm install
npm run build
```

# Start with PM2
```shell
pm2 start npm --name "nextjs-app" -- run start
pm2 save
pm2 startup

```
# Redirect to localhost
```
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:8007/$1 [P,L]
```
