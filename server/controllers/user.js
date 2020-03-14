const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");

function signUp(req, res) {
  const user = new User();

  const { name , lastname, email, password, repeatPassword } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email;
  user.role = "admin";
  user.active = false;

  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Las contraseñas son obligatorias." });
  } else {
    if (password !== repeatPassword) {
      res
        .status(404)
        .send({ message: "Las contraseñas tienen que ser iguales." });
    } else {
      //encryptar password

      bcrypt.hash(password, null, null, function(err, hash) {
        if (err) {
          res.status(500).send({ message: "Error al encriptar la contraseña" });
        } else {
          user.password = hash;

          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: "El Correo que estas utilizando ya existe" });
            } else {
              if (!userStored) {
                res.status(404).send({ message: "Error al crear el Usuario." });
              } else {
                res.status(202).send({ user: userStored });
              }
            }
          });
        }
      });
    }
  }
}

module.exports = {
  signUp
};
