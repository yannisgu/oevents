if [ -d packages ]
then
    rm -rf packages
fi

mkdir packages

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

./deployment/af.sh $DIR
./deployment/heroku.sh $DIR


