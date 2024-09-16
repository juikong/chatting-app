# Chat-ing App

Backend for Chat-ing App

## Deployment

Installation

```bash
npm install
```

Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install nodejs -y
```

Install PM2

```bash
npm install pm2 -g
```

Install MongoDB

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongodb
systemctl enable mongodb
```

Install Nginx

```bash
apt install nginx
```

Build the app

```bash
npm run build
```

Start the app

```bash
pm2 start dist/main.js
```

Start the app on startup

```bash
pm2 startup
pm2 save
```

Configure Nginx (Use port 3001 and alias photo to uploads/photos folder)

```bash
server {
  listen 3001 ssl;
  server_name domainname;

  location /photos/ {
    alias /var/www/chatting-app/uploads/photos/;
  }

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Install SSL certificate

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d domainname
```

Add User

Refer to https://github.com/juikong/chatting-web to setup admin dashboard to add user

## Support

Chat-ing is an MIT-licensed open source project. If you interest to support this project, contact me at juikong@yahoo.com

## License

[MIT](https://choosealicense.com/licenses/mit/)
