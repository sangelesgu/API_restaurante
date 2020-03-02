**API Restaurante**
----
API REST para controlar la base de datos de un restaurante.


Bienvenidos!  Esta API ha sido construida con el proposito de modernizar el restuarante de mi tia Maria. Sin embargo, cualquiera que desee puede hacer uso de ella. 

Solo teneis que tener en cuenta la siguiente información.

La URL base de la API es la siguiente: 

https://localhost:3000

Para poder usar la API tendréis que hacer distintas llamadas HTTP a los enpoints correspondientes. 

Por ejemplo.  Si quereis saber los usuarios que estan registrados en la base de datos y que ya han hecho pedidos online a traves de la web del restaurante debéis hacer una llamada GET mas o menos así: 

Ejemplo: https://localhost:3000/users

De cada usuario se veria la información de la siguiente manera: 

* username: 
* email:
* password: 

<b>¿Cómo usar la API?</b> 

La API contiene 7 paths distintos que se corresponden a las distintas operaciones CRUD: 

+ Una llamada POST al path /register Permite registrar un nuevo usuario.  Para hacerlo debes enviar el body a la peticion en formato JSON de la siguiente manera:

{

	"username": "pepito",
	"email": "pepito@gmail.com",
	"password":"ejemlo"

	
}

+ Una llamada POST al path /login Permite que un usuario se logee en la pagina web del restaurante. Sus datos menos relevantes se almacenan en nuestra base de datos.  En el caso de su contraseña, se almacena un hash generado una vez el usuario registre su contraseña.  Una vez hecho esto, se le envia una cookie al usuario para que no tenga que hacer loggin una vez accede la primera vez.   Para poder hacer la petición debes  enviar el body a la peticion en formato JSON de la siguiente manera:

{

	"username": "pepito",
	"email": "pepito@gmail.com",
	"password":"ejemplo"
	

}

+ Una llamada GET al path /pedidos permite ver una lista con todos los pedidos alamacenados en la base de datos. 

+ Una llamada GET al path /pedidos/:indice permite ver la informacion del pedido que corresponda con el valor que se coloque en el path en lugar de la palabra "indice". 

+ Una llamada POST al path /crearPedido.  Permite crear un nuevo pedido en la base de datos.  Una vez hecha la peticion con el formato de body correcto la base de datos genera un id automaticamente para dicho pedido.  La petición debe realizarse con un body construido de la siguiente manera: 

{

	
"productos": ["Sopa", "vino"], 
"fecha": "28/02/2020", 
"direccion": "C. ejemplo, 328", 
"precio": "30€"
	
	
}

+ Una llamada PUT al path /editarPedido.  Permite editar un pedido registrado previamente en la base de datos.  El body para esta petición debe enviarse igual que las anteriores llamadas en formato JSON y de la manera siguiente: 

{
"productos": ["Arroz Negro", "Vino blanco"], 
"fecha": "29/02/2020", 
"direccion": "C. ejemplo, 7", 
"precio": "60€",
"id": 2
}

+ Una llamada DELETE al path /eliminarPedido/:indice  Permitirá borrar un pedido que previamente haya sido registrado en la base datos, lo unico que debe hacerse es sustituir la palabara "indice" del path por el numero correspondiente al id de dicho pedido. 


Si encuentras algun fallo en la API, no dudes en ponerte en contacto conmigo,  en la mayor brevedad posible intentaré solucionar los errores. 


