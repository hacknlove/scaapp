PORTA=41763 # uno de los dos puertos que cimeteor se usará para rotar la aplicación
PORTB=41764 # el segundo de los dos puertos que cimeteor se usará para rotar la aplicación

ROOT_URL=https://example.com # URL en la que se servirá la aplicación
MONGO_URL="..." # URL completa de conexión a la base de datos de mongo
MONGO_OPLOG_URL="..." # URL completa de conexión a la base de datos "local"

METEOR_SETTINGS=.enviroments/prod/settings.json # ruta al archivo que contiene la configuración

NGINX=.enviroments/prod/nginx.conf # Ruta a la configuración de nginx

servidores=(deploy@server1.example.com deploy@server2.example.com) # lista de  usuario@servidores en los que se desplegará la aplicación
