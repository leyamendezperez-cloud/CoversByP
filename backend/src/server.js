const app = require('./app');
const Usuario = require('./models/Usuario');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  await Usuario.crearAdminSiNoExiste();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

iniciar();