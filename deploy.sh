remoteAddr=$1
if test -z $remoteAddr
then
read -p "要部署的ip:" remoteAddr
fi
ssh -p1022 root@${remoteAddr} "rm -rf /usr/share/nginx/html/static/"
scp -P1022 ./dist/* root@${remoteAddr}:/usr/share/nginx/html/
scp -P1022 -r ./dist/static root@${remoteAddr}:/usr/share/nginx/html/
