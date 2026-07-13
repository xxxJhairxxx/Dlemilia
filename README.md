Prompt
Objetivo

Desarrolla un sitio web E-commerce completo para Productos D'lemilia, una pastelería artesanal especializada en tortas y empanadas.

NO debe ser un e-commerce tradicional con carrito, checkout o pasarela de pago.

Toda la experiencia debe estar orientada a que el usuario navegue el catálogo y, al seleccionar un producto, se abra automáticamente WhatsApp con el pedido preparado.

El diseño debe transmitir una sensación de:

Pastelería artesanal
Calidad Premium
Elegancia
Cercanía
Tradición
Productos recién horneados

No quiero un diseño tecnológico o futurista.

Debe sentirse como una boutique de repostería artesanal.

Material de referencia

Te proporcionaré tres imágenes:

Logo oficial de Productos D'lemilia.
Publicación de Empanadas.
Catálogo de Tortas.

Toda la información de productos, precios, colores y estilo visual debe obtenerse de esas imágenes.

Respeta completamente esa identidad gráfica.

No inventes colores, textos ni productos.

Información de la marca

Nombre:

Productos D'lemilia

Slogan:

Sabor único, hecho con pasión

Número de WhatsApp:

942 392 993

Concepto visual

El sitio debe sentirse elegante y artesanal.

Inspiración:

Pastelerías boutique
Cafeterías premium
Panaderías artesanales

No utilizar:

Glassmorphism
Neones
Estilo tecnológico
Interfaces oscuras
Colores fuertes fuera de la identidad

Sí utilizar:

Mucho espacio en blanco
Fotografía grande
Bordes suaves
Sombras delicadas
Tipografía elegante
Detalles dorados
Paleta de colores

Tomar los colores del logo.

Como referencia:

Color principal

Borgoña

#6E0F16

Color secundario

Crema

#F8F3EC

Color de acento

Dorado

#C89A32

Texto

#2B2B2B

Gris

#707070
Tipografía

Usar una combinación elegante.

Por ejemplo:

Títulos

Playfair Display

Contenido

Poppins

o

Inter

Estilo general

Minimalista.

Premium.

Elegante.

Artesanal.

Mucha fotografía.

Tarjetas limpias.

Sombras suaves.

Mucho espacio entre secciones.

Estructura
Header

Debe contener:

Logo

Menú

Inicio

Tortas

Empanadas

Personaliza tu torta

Nosotros

Contacto

Botón destacado

"Pedir por WhatsApp"

Header fijo al hacer scroll.

Hero

Gran fotografía de fondo.

Utilizar una imagen de las empanadas o una composición con tortas.

Contenido:

Productos D'lemilia

Sabor único, hecho con pasión

Tortas artesanales

Empanadas recién horneadas

Pedidos personalizados

Botón principal

Ver catálogo

Botón secundario

Pedir por WhatsApp

Agregar una animación suave de entrada.

Sección Empanadas

Crear una sección destacada.

Utilizar la información real.

Producto:

Empanada Mixta

Variedades

Carne

Pollo

Precio

S/9

Descripción

Recién horneada.

Masa dorada y crujiente.

Relleno generoso.

Mostrar una fotografía grande.

Agregar un botón

"Pedir"

Al hacer clic abrir:

https://wa.me/51942392993

Con el mensaje:

Hola.

Quisiera pedir:

• Empanada Mixta

Cantidad: 1

Muchas gracias.
Catálogo de Tortas

Crear un grid elegante.

Cada tarjeta debe contener:

Fotografía

Nombre

Descripción

Precio

Botón

"Pedir"

Productos:

Torta Chocolate

S/60

Torta Selva Negra

S/60

Torta Sublime

S/60

Torta Moka

S/60

Torta Red Velvet

S/60

Torta Chocolúcuma

S/60

Torta Choco Premium

S/60

Torta Maracumango

S/60

Torta Pistacho

S/90

Torta Helada

S/50

Características generales

24 cm

16 porciones

Decoración artesanal

Al hacer clic en cualquier torta abrir WhatsApp con un mensaje personalizado.

Ejemplo

Hola.

Quisiera pedir la siguiente torta.

Producto:
Torta Red Velvet

Cantidad: 1

Muchas gracias.
Personaliza tu torta

Crear una sección premium.

Contenido:

¿No encuentras la torta que buscas?

Creamos tortas personalizadas para:

Cumpleaños

Aniversarios

Bodas

Baby Shower

Eventos

Botón

Solicitar cotización

Que abra WhatsApp.

Beneficios

Crear una sección con iconos.

Ingredientes de calidad

Decoración artesanal

Pedidos personalizados

Café de especialidad

Chocolate caliente

Hecho artesanalmente

Pedidos con 2 días de anticipación

Separación con el 50% de adelanto

Nosotros

Crear una pequeña sección.

Título

Nuestra historia

Texto

En Productos D'lemilia elaboramos cada torta y empanada de manera artesanal, utilizando ingredientes seleccionados y recetas preparadas con dedicación. Nuestro compromiso es ofrecer productos de excelente calidad para acompañar los momentos más especiales de nuestros clientes.

Footer

Debe incluir:

Logo

Slogan

Número

942 392 993

Horarios (espacio preparado)

Redes sociales (espacio preparado)

Botón WhatsApp

Derechos reservados

WhatsApp

Todo el sitio gira alrededor de WhatsApp.

Todos los botones de compra deben abrir un mensaje automáticamente.

Crear una función reutilizable.

Ejemplo

sendWhatsApp(producto, cantidad)

Que genere automáticamente la URL.

Responsive

Debe verse perfecto en:

Desktop

Tablet

Mobile

En móvil:

Menú hamburguesa.

Botón flotante de WhatsApp.

Cards adaptables.

Hero reorganizado.

Animaciones

Usar animaciones elegantes.

No exageradas.

Fade Up

Fade In

Zoom muy ligero

Hover en tarjetas

Hover en botones

Header con transición

Scroll Reveal

Rendimiento

Optimizar imágenes.

Lazy Loading.

SEO.

Open Graph.

Meta tags.

Schema.org para LocalBusiness o Bakery.

Lighthouse superior a 90.

Accesibilidad

Buen contraste.

Alt en imágenes.

Navegación por teclado.

ARIA cuando sea necesario.

Tecnologías

Utilizar:

Next.js 15 (App Router)
React 19
TypeScript
TailwindCSS
Framer Motion
Lucide React
next/image
Componentes reutilizables
Código limpio
Arquitectura escalable
Organización
app/

components/

Hero

Header

Footer

ProductCard

ProductGrid

SectionTitle

WhatsAppButton

Benefits

About

CTA

data/

products.ts

lib/

whatsapp.ts

types/

Product.ts

public/

logo

empanadas

tortas
Datos

Crear un archivo products.ts con toda la información de productos obtenida de las imágenes para que el catálogo sea dinámico.

Objetivo final

El resultado debe ser una landing page moderna con comportamiento de e-commerce, donde el usuario pueda explorar el catálogo de Productos D'lemilia y solicitar cualquier producto de forma rápida mediante WhatsApp, manteniendo en todo momento la identidad visual de la marca mostrada en las imágenes de referencia. El diseño debe transmitir una experiencia artesanal, cálida y premium, priorizando la facilidad de compra, una excelente experiencia de usuario, un alto rendimiento y un código limpio, modular y escalable.