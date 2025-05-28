# TransactionalApi

Una API transaccional construida con NestJS que maneja compras, inventario, clientes y entregas con integración de pagos a través de Wompi.

## 🚀 Características

- **Arquitectura Hexagonal**: Separación clara entre dominio, aplicación e infraestructura
- **Gestión de Transacciones**: Procesamiento completo de compras con estados
- **Integración de Pagos**: Conexión con Wompi para procesamiento de pagos
- **Gestión de Inventario**: Control de stock en tiempo real
- **Sistema de Entregas**: Tracking de entregas por transacción
- **Base de Datos**: PostgreSQL con TypeORM
- **Documentación**: Swagger/OpenAPI integrado

## 🛠️ Tecnologías

- **Framework**: NestJS
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Documentación**: Swagger
- **Pagos**: Wompi API
- **Validación**: Class Validator
- **Testing**: Jest

## 📋 Prerrequisitos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## ⚙️ Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Decstro/TransactionalApi.git
cd TransactionalApi
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_DATABASE=transactional_api

# Wompi Payment Gateway
WOMPI_PUBLIC_KEY=pub_test_tu_llave_publica
WOMPI_PRIVATE_KEY=prv_test_tu_llave_privada
WOMPI_SANDBOX_URL=https://sandbox.wompi.co/v1
```

4. **Crear la base de datos**
```bash
createdb transactional_api
```

5. **Ejecutar migraciones**
```bash
npm run migration:run
```

6. **Ejecutar seeds**
```bash
npm run seed
```

7. **Iniciar la aplicación**
```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000`

## 📚 Documentación API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

### 🔗 **[Swagger UI - http://localhost:3000/api](http://localhost:3000/api)**

La documentación incluye:
- ✅ **Todos los endpoints disponibles**
- ✅ **Esquemas de request/response**
- ✅ **Ejemplos de uso**
- ✅ **Pruebas interactivas**
- ✅ **Códigos de estado HTTP**

## 🔗 Endpoints Principales

### **Productos/Stock**
- `GET /stock/:productId` - Obtener información de producto por ID

### **Clientes**
- `GET /customers/:customerId` - Obtener cliente por ID

### **Transacciones**
- `POST /transactions/purchase` - Procesar compra completa

### **Entregas**
- `GET /deliveries/:id` - Obtener entrega por ID

> 💡 **Tip**: Usa Swagger UI para probar todos los endpoints de forma interactiva

## 💳 Ejemplo de Compra

**Endpoint:** `POST /transactions/purchase`

**Request Body:**
```json
{
  "customerId": "CUST-001",
  "productId": "PROD-001",
  "quantity": 1,
  "shippingAddress": "Calle 123 #45-67, Bogotá, Colombia",
  "amount": 1500000,
  "cardData": {
    "cardNumber": "4242424242424242",
    "expMonth": "12",
    "expYear": "25",
    "cvc": "123",
    "holderName": "John Doe"
  }
}
```

**Response:**
```json
{
  "transactionId": "uuid-generated",
  "status": "COMPLETED",
  "deliveryId": "uuid-generated",
  "message": "Purchase completed successfully"
}
```

## 🗄️ Estructura de Base de Datos

### **Tablas Principales:**
- `customers` - Información de clientes
- `stock` - Inventario de productos
- `transactions` - Transacciones de compra
- `deliveries` - Información de entregas

### **Datos de Prueba:**
Después de ejecutar los seeds, tendrás:
- **2 clientes** (CUST-001, CUST-002)
- **3 productos** en stock
- Cliente predeterminado para frontend: `CUST-001`

## 🏗️ Arquitectura

```
src/
├── modules/
│   ├── customers/
│   │   ├── application/use-cases/
│   │   ├── domain/entities/
│   │   ├── infrastructure/
│   │   └── ports/
│   ├── deliveries/
│   ├── stock/
│   └── transactions/
├── database/
│   └── seeders/
└── config/
```

### **Principios Aplicados:**
- **Hexagonal Architecture**: Separación de responsabilidades
- **SOLID Principles**: Código mantenible y extensible
- **Domain Driven Design**: Lógica de negocio en el dominio

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📦 Scripts Disponibles

```bash
npm run start:dev      # Desarrollo con hot reload
npm run start:prod     # Producción
npm run build          # Compilar aplicación
npm run seed           # Ejecutar seeds
npm run migration:run  # Ejecutar migraciones
npm run lint           # Linter
npm run format         # Formatear código
```

## 🔄 Flujo de Compra

1. **Validación**: Cliente y disponibilidad de stock
2. **Creación**: Transacción en estado PENDING
3. **Pago**: Llamada a API externa de Wompi
4. **Actualización**: Estado de transacción según resultado
5. **Entrega**: Creación de registro de entrega (si éxito)
6. **Inventario**: Actualización de stock (si éxito)

## 🌐 Integración con Wompi

La API utiliza Wompi como gateway de pagos:
- **Sandbox**: Para desarrollo y testing
- **Tokenización**: Segura de tarjetas de crédito
- **Webhooks**: Para confirmación de pagos (próximamente)

## 🚀 Despliegue

### **Variables de Entorno de Producción:**
```env
NODE_ENV=production
DB_HOST=tu_host_produccion
WOMPI_PUBLIC_KEY=pub_prod_tu_llave
WOMPI_PRIVATE_KEY=prv_prod_tu_llave
```

### **Docker (Opcional):**
```bash
docker build -t transactional-api .
docker run -p 3000:3000 transactional-api
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@Decstro](https://github.com/Decstro)
- Email: tu.email@ejemplo.com

## 📞 Soporte

Si tienes preguntas o problemas:
1. **Revisa la [documentación de Swagger](http://localhost:3000/api)**
2. Verifica los logs de la aplicación
3. Abre un issue en GitHub

---

⭐ **¡No olvides dar una estrella al proyecto si te fue útil!**

### 📖 Enlaces Útiles
- **[Documentación Swagger](http://localhost:3000/api)** - Prueba la API interactivamente
- **[NestJS Docs](https://docs.nestjs.com)** - Framework documentation
- **[Wompi API](https://docs.wompi.co)** - Payment gateway documentation
