
dir="$1"
echo $dir
mkdir $dir/packages/heroku
cp $dir/heroku.js $dir/packages/heroku
cp $dir/package.json $dir/packages/heroku
cp -r $dir/public $dir/packages/heroku
cp -r $dir/resources $dir/packages/heroku

cd $dir/packages/heroku


npm install --production


touch ~/.netrc

echo "machine api.heroku.com\n login me@yannisguedel.ch\n  password $HEROKU_PASSWORD\n machine code.heroku.com\n  login me@yannisguedel.ch \n  password $HEROKU_PASSWORD" > ~/.netrc

chmod 600 ~/.netrc

git init
git add .
 git commit -m "deployment from travis"


heroku git:remote --app oevents
ssh-keygen -t rsa -f ~/.ssh/id_rsa -N '' -I "deploykey@travis"

chmod 600 ~/.ssh/id_rsa
heroku keys:add ~/.ssh/id_rsa.pub

echo "heroku.com,50.19.85.154 ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAu8erSx6jh+8ztsfHwkNeFr/SZaSOcvoa8AyMpaerGIPZDB2TKNgNkMSYTLYGDK2ivsqXopo2W7dpQRBIVF80q9mNXy5tbt1WE04gbOBB26Wn2hF4bk3Tu+BNMFbvMjPbkVlC2hcFuQJdH4T2i/dtauyTpJbD/6ExHR9XYVhdhdMs0JsjP/Q5FNoWh2ff9YbZVpDQSTPvusUp4liLjPfa/i0t+2LpNCeWy8Y+V9gUlDWiyYwrfMVI0UwNCZZKHs1Unpc11/4HLitQRtvuk0Ot5qwwBxbmtvCDKZvj1aFBid71/mYdGRPYZMIxq1zgP1acePC1zfTG/lvuQ7d0Pe0kaw==" >> ~/.ssh/known_hosts

git push heroku -f