
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

tee ~/.netrc <<EOF
machine api.heroku.com
  login me@yannisguedel.ch
  password $HEROKU_PASSWORD
machine code.heroku.com
  login me@yannisguedel.ch
  password $HEROKU_PASSWORD
EOF

chmod 600 ~/.netrc

git init
git add .
 git commit -m "deployment from travis"


heroku git:remote --app oevents
ssh-keygen -t rsa -f ~/.heroku_key -N '' -I "deploykey@travis"

chmod 600 ~/.heroku_key
ssh-add ~/.heroku_key
heroku keys:add ~/.heroku_key.pub

git push heroku -f