
dir="$1"
echo $dir
mkdir $dir/packages/af
cp $dir/af.js $dir/packages/af
cp $dir/package.json $dir/packages/af
cp -r $dir/public $dir/packages/af
cp -r $dir/resources $dir/packages/af

cd $dir/packages/af

rm -r resources/solv-*

npm install --production

af login me@yannisguedel.ch --passwd "coolfr00"
af update oevents