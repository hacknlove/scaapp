# scaapp

## Demo
https://scaapp.com

## Instalación en producción:

### Requisitos:

* Uno o más servidores con [cimeteor](https://github.com/hacknlove/cimeteor)
* Un replicaset de mongo, por ejemplo en [mongo atlas](https://www.mongodb.com/cloud/atlas)
* Un entorno de desarrollo con ssh y meteor

### Configuración:

Editar los archivo `.enviroments/prod/nginx.conf`, `.enviroments/prod/settings.json` y `.enviroments/prod/setup.sh`

#### Nginx

La configuración avanzada de nginx está fuera del alcance de estas instrucciones.

Basta con obtener un certificado ssh, por ejemplo con [acme.sh](https://github.com/Neilpang/acme.sh) y sustituir example.com por el dominio que se vaya a utilizar.

#### oauth de google drive

Hay que crear una credencial OAuth 2.0 en [console.developers.google.com](console.developers.google.com) y copiar la id de cliente en el archivo `.enviroments/prod/settings.json`

#### Meteor y mongo

El resto de la configuración de despliegue va en el archivo `.enviroments/prod/setup.sh` el cual contiene la ayuda necesaria para ser editado

```sh
PORTA=41763 # uno de los dos puertos que cimeteor se usará para rotar la aplicación
PORTB=41764 # el segundo de los dos puertos que cimeteor se usará para rotar la aplicación

ROOT_URL=https://example.com # URL en la que se servirá la aplicación
MONGO_URL="..." # URL completa de conexión a la base de datos de mongo
MONGO_OPLOG_URL="..." # URL completa de conexión a la base de datos "local"

METEOR_SETTINGS=.enviroments/prod/settings.json # ruta al archivo que contiene la configuración

NGINX=.enviroments/prod/nginx.conf # Ruta a la configuración de nginx

servidores=(deploy@server1.example.com deploy@server2.example.com) # lista de  usuario@servidores en los que se desplegará la aplicación
```

## Instalación de entorno de desarrollo

### Requisitos:

* meteor


#### ssh tunel

Si quieres poder acceder a la aplicación que está siendo ejecutada en tu entorno de desarrollo, tienes que configurar un tunel ssh.

En `.enviroments/dev/sshtunel.nginx.conf` hay un ejemplo de como configurar uno de tus servidores para establecer un reverse proxy a través del tunel ssh

Para configurar el entorno de configuración de modo que use el tunel ssh debes descomentar y editar en el archivo `.enviroments/dev/setup.sh` las variables que configuran el tunel ssh

#### oauth de google drive

Hay que crear una credencial OAuth 2.0 en [console.developers.google.com](console.developers.google.com) y copiar la id de cliente en el archivo `.enviroments/prod/settings.json`

#### Meteor y mongo

El resto de la configuración del entorno de desarrollo va en el archivo `.enviroments/dev/setup.sh` el cual contiene la ayuda necesaria para ser editado
