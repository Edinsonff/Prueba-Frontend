# Prueba-Frontend - Angular Application

## Descripción del Proyecto

**Prueba-Frontend** es una aplicación web desarrollada en Angular 18 que permite a los usuarios registrarse, iniciar sesión, y gestionar productos. Se enfoca en la autenticación de usuarios mediante un servicio `AuthService` y en la manipulación de productos mediante el servicio `ProductService`. Además, la aplicación incluye un sistema de paginación, filtrado, validaciones personalizadas y es completamente responsive.

### Funcionalidades Principales

1. **Autenticación**:
   - El proyecto cuenta con un usuario mock predeterminado que se almacena en `localStorage`. Las credenciales del usuario mock son:
     - **Correo**: `test@example.com`
     - **Contraseña**: `password123`
   - Se puede **iniciar sesión** utilizando las credenciales del usuario mock.
   - Los usuarios pueden **registrarse** con un nombre, correo y contraseña personalizados, los cuales se almacenan en `localStorage`.
   - El estado de autenticación se mantiene a través de un guardian (`AuthGuard`) que protege las rutas.

2. **Gestión de Productos**:
   - Los usuarios pueden **ver**, **agregar**, **editar** y **eliminar** productos desde una interfaz intuitiva.
   - **Filtrado** de productos por nombre, categoría, disponibilidad y rango de precios.
   - Cada acción sobre los productos se refleja de inmediato en la interfaz gracias a las señales de Angular (`signals`).
   - **Paginación**: Los productos se muestran con un sistema de paginación integrado, permitiendo una mejor experiencia de usuario al gestionar grandes listas de productos.

3. **Servicios**:
   - **`AuthService`**: Servicio encargado de la autenticación y manejo del estado del usuario.
   - **`ProductService`**: Servicio que gestiona las operaciones relacionadas con los productos (obtener, agregar, editar, eliminar).
   - **`HandlerService`**: Servicio para el manejo de errores, que centraliza la gestión de errores y notificaciones en la aplicación.
   - **`ProductStateService`** : Servicio no usado aun, pero implemnetado para la centralizacion del estado y comunicar los datos entre componentes.
  
4. **Validaciones Personalizadas**:
   - El proyecto incluye validaciones personalizadas (`CustomValidators`) para asegurar la integridad de los datos ingresados por el usuario.
   - Entre las validaciones están la restricción de espacios en blanco, validaciones de formato y comparaciones de campos.

### Funcionalidades de Usuario

- **Iniciar Sesión**: Los usuarios pueden iniciar sesión utilizando las credenciales del usuario mock o registrando una cuenta nueva.
- **Registro**: Los usuarios pueden registrarse proporcionando un nombre, correo y contraseña.
- **Ver Productos**: Los usuarios pueden ver una lista de productos paginada.
- **Agregar Producto**: Se puede agregar un nuevo producto con nombre, descripción, precio, stock, categoría e imagen.
- **Editar Producto**: Se puede editar la información de productos ya existentes.
- **Eliminar Producto**: Los productos se pueden eliminar permanentemente.
- **Filtrado de Productos**: Los productos se pueden filtrar por:
  - Nombre
  - Categoría
  - Disponibilidad (en stock o fuera de stock)
  - Rango de precios (bajo, medio, alto)
  
### Otras Características

- **Almacenamiento Local**: Los usuarios se almacenan en `localStorage`, permitiendo mantener la sesión activa en el navegador.
- **Responsividad**: El diseño es completamente responsive, adaptándose a diferentes tamaños de pantalla (móvil, tablet y escritorio).
- **Señales**: El proyecto hace uso de la nueva funcionalidad de señales (`signals`) de Angular para una mejor gestión del estado reactivo.
- **Despliegue**: El proyecto está desplegado en Firebase y se puede acceder desde el siguiente enlace:
  - [https://pruebafrontend-cd4da.web.app/login](#)

### Tecnologías Utilizadas

- **Angular 18**: Framework principal para el desarrollo del frontend.
- **RxJS**: Para la gestión de operaciones asíncronas como el inicio de sesión y registro.
- **LocalStorage**: Para el almacenamiento de los usuarios registrados y autenticación.
- **Firebase Hosting**: Para el despliegue del proyecto en un entorno en la nube.
- **SCSS**: Para los estilos personalizados y mantener un código más modular.
- **Tailwind CSS**: Para el diseño responsivo de la interfaz de usuario.

### Instalación y Configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Edinsonff/Prueba-Frontend.git
   cd Prueba-Frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Ejecuta la aplicación localmente:
   ```bash
   ng serve
   ```

4. Para crear el build de producción:
   ```bash
   ng build --configuration production
   ```

### Despliegue en Firebase

Para desplegar este proyecto en Firebase:

1. **Instala Firebase CLI** si no lo tienes:
   ```bash
   npm install -g firebase-tools
   ```

2. **Inicia sesión en Firebase**:
   ```bash
   firebase login
   ```

3. **Inicializa el proyecto de Firebase**:
   ```bash
   firebase init
   ```

4. **Despliega el proyecto**:
   ```bash
   firebase deploy
   ```

### Contribuciones

Si deseas contribuir a este proyecto, realiza un fork del repositorio, realiza tus cambios y crea un Pull Request.

