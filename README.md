# AREP-04 CREATE A CRUD SYSTEM TO MANAGE PROPERTIES

Teniendo en cuenta todos los conocimientos obtenidos anteriormente sobre despliegue, desarrollo web y springboot, vamos a crear un servidor web desplegado con AWS que utilice un sistema CRUD que permita al usuario realizar las operaciones basicas y almacenar estos datos en una base de datos SQL. 

![](images/1.gif)



## Comenzando

Estas instrucciones te ayudarán a obtener una copia del proyecto en tu máquina local para fines de desarrollo y pruebas.

### Prerrequisitos

Necesitas instalar las siguientes herramientas para ejecutar el proyecto:

1. Java

   TPrueba con el siguiente comando:
    ```
    java -version
    ```
    Deberías ver algo como esto:

    ![](/images/2.png)

2. Maven

   También necesitamos Maven, usa el siguiente comando

    ```
    mvn -version
    ```
    Deberías ver algo como esto:
    
    ![](/images/3.png)

3. Git

   Debemos tener Git instalado. Puedes verificarlo con este comando:
    ```
    git --version
    ```
    Debería aparecer algo como esto:
    
    ![](/images/4.png)

4. Docker

   Por último, necesitamos la última versión de Docker:

   ```
    docker --version
    ```
   ![](/images/5.png)
   

### Instalando localmente el proyecto

   
1. Primero, necesitamos abrir una terminal de git e ingresar el siguiente comando para clonar el proyecto:

    ```
    git clone https://github.com/JeissonCasallas09/AREP-05-CRUD
    ```
    
2. Abre la carpeta del proyecto en una nueva terminal e inicializalo con el siguiente comando:
    ```
    mvn package
    ```
    Deberia ver un mensaje de exito similar al siguiente:

     ![](/images/6.png)

3. Tambien necesitamos ejecutar el contenedor docker con la base de datos  MySQL:
    ```
    docker-compose up -d
    ```
    Deberiamos tener un contenedor corriendo:

    ![](/images/7.png)
    
4. Ahora podremos ejecutar el proyecto con spring boot siguiendo el siguiente comando:
   ```
    mvn spring-boot:run
    ```
    Si cumple los requisitos y siguio los pasos anteriores deberia ver el proyecto corriendo

    ![](/images/8.png)

    
5. Ahora podemos ingresar a nuestro proyecto de manera local por el puerto 8080
   ```
    http://localhost:8080
    ```

   ![](/images/9.png)
 
6. Una vez tenemos el proyecto corriendo, podemos probar las operaciones dadas y verificar el funcionamiento de la base de datos con alguna interfaz SQL, como Dbeaver
   ![](/images/10.png)

   En docker podemos ver la base de datos corriendo:

   ![](/images/11.png)

### Despliegue en AWS para MYSQL y La Aplicacion

   ## 1. Instancia de SQL en AWS
   1. Inicialmente vamos a ingresar a AWS y vamos a crear una Instancia donde vamos a hostear la base de datos

      ![](/images/12.png)
      
      Importante recordar generar el par de llaves y guardalas en un directorio local.
      
      ![](/images/13.png)

   2. Vamos a conectarnos a la instancia por cliente SSH, para ello vamos a entrar desde una terminal git al directorio donde tenemos la llave y pondremos el siguiente comando:

      ```
      ssh -i "lab5.pem" ec2-user@ec2-3-80-217-238.compute-1.amazonaws.com
      ```
      Este comando es generado por la instancia decidimos conectarnos por SSH, deberia verse así:

      ![](/images/14.png)

   3. Ahora instalaremos MySQL, con ayuda de los siguientes comandos:

      ```
      wget https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm

      sudo rpm -Uvh mysql80-community-release-el9-1.noarch.rpm

      sudo yum update -y

      sudo yum install -y mysql-community-server
      ```
      Una vez finalizada la instalación deberiamos ver algo como esto:

      ![](/images/15.png)
   
   4. Ahora vamos iniciamos MySQL y verificamos su estado con los siguientes comandos

      ```
      sudo systemctl enable --now mysqld
      sudo systemctl status mysqld
      ```
      Verificamos que esta corriendo correctamente
      ![](/images/16.png)
   
   5. Creamos una contraseña temporal para acceder al MySQL y la usamos para ingresar, esto con ayuda de los siguientes comandos
   
      ```
      sudo grep 'temporary password' /var/log/mysqld.log

      mysql -u root -p
      ```
      Si se hizo correctamente deberia verse así:
      ![](/images/17.png)

   6. Desde el SQL vamos a cambiar la contraseña,crear una base de datos, un usuario con su respectiva contraseña generica y le vamos a dar todos los privilegios.
   
      ```
      ALTER USER 'root'@'localhost' IDENTIFIED BY 'NuevaContraseñaSegura1*'; 

      CREATE DATABASE crudarep;

      CREATE USER 'myuser'@'%' IDENTIFIED BY 'Password123!';

      GRANT ALL PRIVILEGES ON crudsystem.* TO 'myuser'@'%';

      FLUSH PRIVILEGES;
      ```
      ![](/images/18.png)

   7. Nos salimos de la base y vamos a ingresar al archivo de configuración y a agregar una nueva linea que nos permite conectarnos desde cualquier dirección.
      ```
      sudo nano /etc/my.cnf

      bind-address = 0.0.0.0

      ```
      Debe verse así:

      ![](/images/19.png)

   8. Reiniciamos el MySQL, verificamos su status y verificamos su puerto predeterminado para conocer si se esta escuchando por el.
       ```
      sudo systemctl restart mysqld

      sudo systemctl status mysqld

      sudo netstat -tuln | grep 3306

      ```
      Debe verse así:

      ![](/images/20.png)

   9. Por ultimo, vamos a darle entrada a la instancia por el puerto 3306 y vamos a configurar el archivo de application.properties con los datos de la base que acabamos de crear y la ip de la instancia, debe ver algo así:

      ![](/images/21.png)
      ![](/images/22.png)
      ![](/images/23.png)

   Ahora tenemos una instancia MySQL corriendo en AWS!  

   ## 2. Instancia servidor web en AWS

   1. Inicialmente vamos a ingresar a AWS y vamos a crear una Instancia donde vamos a hostear la base de datos

      ![](/images/24.png)
      
      Importante recordar generar el par de llaves y guardalas en un directorio local.
      
      ![](/images/25.png)

   2. Vamos a conectarnos a la instancia por cliente SSH, para ello vamos a entrar desde una terminal git al directorio donde tenemos la llave y pondremos el siguiente comando:

      ```
      ssh -i "servidorweb.pem" ec2-user@ec2-3-89-217-216.compute-1.amazonaws.com
      ```
      Este comando es generado por la instancia decidimos conectarnos por SSH, deberia verse así:

      ![](/images/26.png)
   
   3. Ahora debemos instalar java 17 y maven en nuestra instancia, para ello usaremos los siguientes comandos:
      ```
      sudo yum install java-17-amazon-corretto -y

      sudo yum install maven -y
      ```
      Si se hizo correctamente deberia verse así
      
      java
      ![](/images/27.png)
      maven
      ![](/images/28.png)

   4. Ahora por medio de sftp vamos a cargar a nuestra instancia el JAR de nuestro proyecto, para ello usamos los comandos

      ```
       sftp -i "servidorweb.pem" ec2-user@ec2-3-89-217-216.compute-1.amazonaws.com


      put C:/Users/User/Desktop/crud/target/arep-0.0.1-SNAPSHOT.jar
      ```

      Debemos tener en cuenta que estos comandos varian segun la instancia y la ruta donde tengamos nuestro JAR, el cual se recomienda usar el comando "mvn clean install" y cambiar la dirección IP que entra en script.js en el directorio raiz del proyecto antes de obtenerlo.

      ![](/images/30.png)
      ![](/images/29.png)
   
   5. Volvemos a ingresar a la instancia y ahora ejecutamos el siguiente comando para ejecutar la aplicación.
      ```
       java -jar arep-0.0.1-SNAPSHOT.jar
      ```
   ![](/images/31.png)

   6. Probamos que todo ejecute correctamente, como podemos ver a continuación quedo desplegado correctamente nuestro proyecto junto con su base de datos funcional.
   
   ![](/images/32.gif)

   Podemos visualizar las instancias corriendo tanto de MySQL como del proyecto y las operaciones CRUD funcionando correctamente.
      

## Architecture

### Descripción general
Este proyecto sigue la arquitectura en capas para estructurar el backend desarrollado en Spring Boot, facilitando la separación de responsabilidades y el mantenimiento del código. La arquitectura está compuesta por las siguientes capas:

![](/images/33.png)

### Capa de Frontend (Static)

La capa de frontend está compuesta por archivos estáticos que permiten la interacción del usuario con la aplicación.

📌 Componentes principales:

   * index.html → Página principal de la aplicación.
   * styles.css → Archivo de estilos para el diseño visual.
   * script.js → Archivo JavaScript que gestiona la comunicación con el backend mediante fetch API o AJAX.

📌 Flujo:

1. El usuario interactúa con la página web (index.html).
2. script.js envía solicitudes HTTP (GET, POST, PUT, DELETE) al backend.
3. La información de la base de datos es recuperada y mostrada en la interfaz de usuario.

### Capa de Backend (Src - Spring Boot)
El backend está desarrollado en Spring Boot y sigue una arquitectura en capas, dividiendo la lógica en:

   * Modelo (Property)
   * Repositorio (PropertyRepository)
   * Servicio (PropertyService)
   * Controlador (PropertyController)

   📌 **Componentes principales:**

   #### Modelo (Property)

   Define la estructura de la entidad Property, que representa una propiedad inmobiliaria en la base de datos, a partir de sus atributos dados:

   * id (long) → Identificador único.
   * address (String) → Dirección de la propiedad.
   * price (double) → Precio de la propiedad.
   * size (String) → Tamaño de la propiedad.
   * description (String) → Descripción de la propiedad.

   #### Repositorio (PropertyRepository)
   Es una interfaz que extiende JpaRepository, permitiendo la comunicación con la base de datos sin escribir SQL manualmente.

   #### Servicio (PropertyService)
   Contiene la lógica de negocio y maneja las operaciones CRUD.

   📌 **Métodos principales:**

   * createProperty(Property property): Guarda una nueva propiedad.
   * getPropertyById(Long id): Obtiene una propiedad por ID.
   * getAllProperties(): Retorna todas las propiedades.
   * updateProperty(Property property): Modifica una propiedad.
   * deleteProperty(Long id): Elimina una propiedad.

   #### Controlador (PropertyController)
   Expone endpoints REST para que el frontend pueda interactuar con la base de datos.

   📌 **Endpoints principales:**

   * POST /properties/create → Crear una nueva propiedad.
   * GET /properties/{id} → Obtener una propiedad por ID.
   * GET /properties → Listar todas las propiedades.
   * PUT /properties/{id} → Actualizar una propiedad.
   * DELETE /properties/{id} → Eliminar una propiedad.

### Base de Datos (Database - MySQL)

   La base de datos utilizada es MySQL, donde se almacenan los registros de propiedades.

## Diagrama de Clases
   ![](/images/32.png)

 #### 1. Capa de Modelo (Model)
 
   La capa de modelo representa la estructura de los datos en la aplicación.

   - La entidad principal es Property, que define los atributos de una propiedad.
   - Cada propiedad tiene los siguientes atributos:
      - id (long) → Identificador único de la propiedad.
      - address (String) → Dirección de la propiedad.
      - price (double) → Precio de la propiedad.
      - size (String) → Tamaño de la propiedad.
      - description (String) → Descripción de la propiedad.
   * Contiene un constructor sin parámetros y un constructor con parámetros para inicializar los objetos.
   * Incluye métodos getter y setter para acceder y modificar los atributos.

 #### 2. Capa de Repositorio (Repository)

   La capa de repositorio se encarga de la comunicación con la base de datos.

   * PropertyRepository es una interfaz que extiende JpaRepository<Property, Long>.
   * Proporciona métodos CRUD predefinidos (save, findById, findAll, deleteById, etc.), lo que evita la implementación manual de consultas SQL.

 #### 3. Capa de Servicio (Service)

   La capa de servicio contiene la lógica de negocio y actúa como intermediaria entre el controlador y el repositorio.

   * PropertyService encapsula las reglas de negocio y proporciona métodos para gestionar propiedades.
   * Métodos principales:
      * createProperty(Property property): Guarda una nueva propiedad en la base de datos.
      * getPropertyById(Long id): Busca una propiedad por ID.
      * getAllProperties(): Devuelve todas las propiedades registradas.
      * updateProperty(Property property): Modifica una propiedad existente.
      * deleteProperty(Long id): Elimina una propiedad por su ID.

 #### 4. Capa de Controlador (Controller)

   La capa de controlador maneja las solicitudes HTTP y expone los endpoints REST.

   * PropertyController es un @RestController que recibe las solicitudes y las dirige al servicio correspondiente.
   * Se utilizan ResponseEntity para manejar respuestas HTTP de forma adecuada.
   * Métodos y endpoints:
      * POST /properties → Crear una nueva propiedad.
      * GET /properties/{id} → Obtener una propiedad por ID.
      * GET /properties → Listar todas las propiedades.
      * PUT /properties/{id} → Actualizar una propiedad existente.
      * DELETE /properties/{id} → Eliminar una propiedad.

### Flujo de Datos
   1️⃣ El usuario envía una solicitud a la API a través del Controlador (PropertyController).

   2️⃣ El Controlador llama al Servicio (PropertyService) para procesar la solicitud.

   3️⃣ El Servicio interactúa con el Repositorio (PropertyRepository) para acceder a la base de datos.

   4️⃣ La base de datos devuelve la información al Repositorio, que a su vez la pasa al Servicio.

   5️⃣ Finalmente, el Controlador devuelve la respuesta al usuario.


## Running the tests

Estas pruebas se realizaron con el fin comprobar el correcto funcionamiento del backend de la aplicación, verificando que se esten realizando correctamente las peticiones y los metodos estan funcionando como deberian.

![](/images/34.png)

### PropertyController

Este conjunto de pruebas verifica el correcto funcionamiento del PropertyController, que maneja las solicitudes HTTP relacionadas con las propiedades.

### Tecnologías Utilizadas
* JUnit 5 → Para la ejecución de pruebas unitarias.
* Mockito → Para simular el comportamiento del PropertyService.
* Spring Boot Test → Para validar el comportamiento de los controladores REST.

#### Estructura del Test
Antes de cada prueba:

✅ Se usa @Mock para simular PropertyService.

✅ Se usa @InjectMocks para inyectar el mock en PropertyController.

✅ Se llama MockitoAnnotations.openMocks(this) en @BeforeEach para inicializar los mocks antes de cada prueba.

#### Explicación de las Pruebas

1️⃣ **testCreateProperty_Success**

   ✅ Objetivo: Verificar que se pueda crear una propiedad correctamente.

   ✅ Flujo:

   * Se simula que el servicio guarda la propiedad correctamente.
   * Se llama al endpoint POST /properties.
   * Se valida que la respuesta es 200 OK y contiene los datos esperados.

   📌 Caso esperado:
   Se recibe la propiedad con los mismos datos que se enviaron.

2️⃣ **testCreateProperty_BadRequest**

✅ Objetivo: Verificar que si se envían datos inválidos, la API responde con un error 400.

✅ Flujo:

* Se simula que el servicio lanza una IllegalArgumentException.
* Se llama al endpoint POST /properties.
* Se valida que la respuesta es 400 Bad Request.

📌 Caso esperado: El cuerpo de la respuesta debe ser null.

3️⃣ **testGetPropertyById_Success**

✅ Objetivo: Verificar que se pueda obtener una propiedad por su ID.

✅ Flujo:

* Se simula que el servicio encuentra la propiedad.
* Se llama al endpoint GET /properties/{id}.
* Se valida que la respuesta es 200 OK con los datos correctos.

📌 Caso esperado: Se recibe la propiedad con la dirección "Calle 123".

4️⃣ **testGetPropertyById_NotFound**

✅ Objetivo: Verificar que si no se encuentra la propiedad, se devuelve un error 404.

✅ Flujo:

* Se simula que el servicio lanza NoSuchElementException.
* Se llama al endpoint GET /properties/{id}.
* Se valida que la respuesta es 404 Not Found.

📌 Caso esperado: El cuerpo de la respuesta debe ser null.

5️⃣ **testGetAllProperties_Success**

✅ Objetivo: Verificar que se obtengan todas las propiedades almacenadas.

✅ Flujo:

* Se simula que el servicio devuelve una lista de propiedades.
* Se llama al endpoint GET /properties.
* Se valida que la respuesta es 200 OK con una lista no vacía.

📌 Caso esperado: Se obtiene una lista con al menos 2 propiedades.

6️⃣ **testUpdateProperty_Success**

✅ Objetivo: Verificar que se pueda actualizar correctamente una propiedad.

✅ Flujo:

* Se simula que el servicio actualiza la propiedad.
* Se llama al endpoint PUT /properties/{id}.
* Se valida que la respuesta es 200 OK con los datos actualizados.

📌 Caso esperado: La propiedad debe tener dirección "Calle 789".

7️⃣ **testUpdateProperty_NotFound**

✅ Objetivo: Verificar que si se intenta actualizar una propiedad inexistente, se devuelva un error 404.

✅ Flujo:

* Se simula que el servicio lanza NoSuchElementException.
* Se llama al endpoint PUT /properties/{id}.
* Se valida que la respuesta es 404 Not Found.

📌 Caso esperado: El cuerpo de la respuesta debe ser null.

8️⃣ **testDeleteProperty_Success**

✅ Objetivo: Verificar que se pueda eliminar una propiedad correctamente.

✅ Flujo:

* Se simula que el servicio borra la propiedad sin problemas.
* Se llama al endpoint DELETE /properties/{id}.
* Se valida que la respuesta es 204 No Content.

 📌 Caso esperado: No debe haber contenido en la respuesta.

9️⃣ **testDeleteProperty_NotFound**

✅ Objetivo: Verificar que si se intenta eliminar una propiedad inexistente, se devuelva un error 404.

✅ Flujo:

* Se simula que el servicio lanza NoSuchElementException.
* Se llama al endpoint DELETE /properties/{id}.
* Se valida que la respuesta es 404 Not Found.

📌 Caso esperado: No debe haber contenido en la respuesta.

### PropertyService
Este conjunto de pruebas verifica el correcto funcionamiento del PropertyService, que se encarga de la lógica de negocio y la interacción con la base de datos mediante PropertyRepository.

### Tecnologías Utilizadas

* JUnit 5 → Para la ejecución de pruebas unitarias.
* Mockito → Para simular el comportamiento del PropertyRepository.
* Spring Boot Test → Para validar la capa de servicio.

#### Estructura del Test
Antes de cada prueba:

✅ Se usa @Mock para simular PropertyRepository.

✅ Se usa @InjectMocks para inyectar el mock en PropertyService.

✅ Se llama MockitoAnnotations.openMocks(this) en @BeforeEach para inicializar los mocks antes de cada prueba.

#### Explicación de las Pruebas

1️⃣ **testCreateProperty_Success**

✅ Objetivo: Verificar que se pueda crear una propiedad correctamente.

✅ Flujo:

* Se simula que el repositorio guarda la propiedad correctamente.
* Se llama al método createProperty del servicio.
* Se valida que la propiedad creada tiene los datos esperados.

📌 Caso esperado: La propiedad debe contener la dirección "Calle 123", precio 100000.0, tamaño "100m2" y descripción "Casa moderna".

2️⃣ **testGetAllProperties_Success**

✅ Objetivo: Verificar que se obtengan todas las propiedades almacenadas en la base de datos.

✅ Flujo:

* Se simula que el repositorio devuelve una lista de propiedades.
* Se llama al método getAllProperties del servicio.
* Se valida que la respuesta contiene dos propiedades.

📌 Caso esperado: La lista debe contener 2 propiedades con los datos correctos.

3️⃣ **testUpdateProperty_NotFound**

✅ Objetivo: Verificar que si se intenta actualizar una propiedad inexistente, se devuelva null.

✅ Flujo:

* Se simula que el repositorio no encuentra la propiedad por su ID.
* Se llama al método updateProperty del servicio.
* Se valida que la respuesta sea null.

📌 Caso esperado: No se encuentra la propiedad, por lo que la actualización no se realiza.

4️⃣ **testDeleteProperty_Success**

✅ Objetivo: Verificar que se pueda eliminar una propiedad 
correctamente.

✅ Flujo:

* Se simula que el repositorio elimina la propiedad sin problemas.
* Se llama al método deleteProperty del servicio.
* Se verifica que el método deleteById del repositorio se haya llamado una vez.

📌 Caso esperado: La propiedad debe eliminarse correctamente y el método deleteById debe ser invocado exactamente una vez.


## Conclusions

 * El proyecto se estructuró en tres capas: frontend, backend y base de datos, lo que permitió una separación clara de responsabilidades. Esto facilita futuras mejoras sin afectar el funcionamiento del sistema.

 * Se emplearon tecnologías ampliamente utilizadas en la industria, como Spring Boot para la gestión del backend, MySQL para el almacenamiento de datos y Mockito + JUnit para pruebas unitarias. Estas herramientas garantizaron eficiencia y estabilidad en el desarrollo.

* El desarrollo incluyó pruebas en los controladores y servicios, asegurando el correcto funcionamiento de las operaciones CRUD. Esto permitió detectar y corregir errores antes de la implementación.

* Se implementó una interfaz sencilla que permite visualizar, modificar y eliminar registros de manera eficiente. La comunicación con el backend se realizó de forma fluida, asegurando una experiencia de usuario estable.

* El proyecto fue desplegado en AWS, utilizando dos instancias EC2, una para la base de datos MySQL y otra para el servicio web en Spring Boot. Esta configuración permitió un control total sobre la infraestructura, optimizando el rendimiento y la seguridad. Además, facilita la escalabilidad del sistema y la integración con otros servicios en la nube según sea necesario.

## Built With

* [Maven](https://maven.apache.org/) - Dependency Control
* [GIT](https://git-scm.com) - Versioning
* [Docker](https://hub.docker.com/) -Virtualization
* [MYSQL](https://www.mysql.com/) - Database


## Versioning

versioning made it by [GitHub](http://git-scm.com).

## Authors

* **Jeisson Steban Casallas Rozo** - [JeissonCasallas09](https://github.com/JeissonCasallas09)

Date: 16/02/2025
## License

This project is licensed by ECI.

