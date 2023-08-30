import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../db/db.js";
import fs from "fs/promises";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.url.includes("/uplodaAvatar")) {
      cb(null, path.join("public/avatar"));
    }
    if (req.url === "/uploads") {
      cb(null, path.join("public/uploads"));
    }
    if (req.url === "/preview-upload") {
      cb(null, path.join("public/preview"));
    }
    if (req.url === "/chage-images") {
      cb(null, path.join("public/uploads"));
    }
  },
  filename: function (req, file, cb) {

    if (req.url === "/preview-upload") {
      return cb(null,  uuidv4() + path.extname(file.originalname));
    }
    if (req.url.includes("/uplodaAvatar")) {
      const nameFile = req.query.nameImag;
      console.log(nameFile);
      return cb(null, nameFile);
    } else {
      cb(null, uuidv4() + path.extname(file.originalname));
    }
  },
});

export const uploadsImage = multer({
  storage,
}).single("file");

export const createPost = async (req, res) => {
  const { title, autor, descripcion, nameImg } = req.body;
  const id = uuidv4();
  const date = new Date();
  const hora = date.toLocaleTimeString();
  const dia = date.toDateString();
  const fecha = `${dia} - ${hora}`;
  try {
    const [prevPost] = await pool.query(
      "SELECT * FROM post ORDER BY fecha DESC"
    );
    if (prevPost.length > 0) {
      const namefile = prevPost[0].nameImg;
      if (namefile != undefined) await fs.unlink(`public/uploads/${namefile}`);
    }

    const response = await pool.query(
      "INSERT INTO post (id , title , nameImg , autor, descripcion,fecha) VALUES (? , ? ,? , ? ,? , ?)",
      [id, title, nameImg, autor, descripcion, fecha]
    );
    res.send(response);
  } catch (error) {
    res
      .status(404)
      .json({ message: `Hubo un error en la peticion ${error.status}` });
  }
};

export const createUser = async (req, res) => {
  const { name, correo, password } = req.body;
  try {
    const response = await pool.query(
      "INSERT INTO user ( name , correo , password) VALUES (? , ? ,?  )",
      [name, correo, password]
    );
    res.send(response);
  } catch (error) {
    res
      .status(404)
      .json({ message: `Hubo un error en la peticion ${error.status}` });
  }
};

export const getPost = async (req, res) => {
  const inicio = parseInt(req.query.inicio);
  const fin = 8;

  const [index] = await pool.query("SELECT * FROM post");
  const exactnumberpag = Math.floor(index.length / 8);
  let numberpag = index.length / 8;
  let pag;
  if (index.length < 9) {
    pag = 0;
  } else {
    if (numberpag === exactnumberpag) {
      pag = exactnumberpag;
    } else {
      pag = exactnumberpag + 1;
    }
  }
  try {
    const [data] = await pool.query(
      `SELECT * FROM post ORDER BY fecha DESC limit ?,?;`,
      [inicio, fin]
    );
    const newRespone = { data, numberpag: pag };
    res.json(newRespone);
  } catch (error) {
    res
      .status(404)
      .json({ message: `Hubo un error en la peticion ${error.status}` });
  }
};

export const getOnePost = async (req, res) => {
  const namePost = req.params.title;
  try {
    const [row] = await pool.query("SELECT * FROM post WHERE id = ? ", [
      namePost,
    ]);
    res.json(row);
  } catch (error) {
    res
      .status(404)
      .json({ message: `Hubo un error en la peticion ${error.status}` });
  }
};

export const getUser = async (req, res) => {
  try {
    const [response] = await pool.query("SELECT * FROM user");
    res.json(response);
  } catch (error) {
    res
      .status(404)
      .json({ message: `Hubo un error en la peticion ${error.status}` });
  }
};

export const getPostUser = async (req, res) => {
  const name = req.params.name;
  const [response] = await pool.query(
    "SELECT * FROM post WHERE autor = ? ORDER BY fecha DESC ",
    [name]
  );

  res.json(response);
};

export const getOneUser = async (req, res) => {
  const { password, correo } = req.body;
  try {
    const [response] = await pool.query("SELECT * FROM user WHERE correo = ?", [
      correo,
    ]);
    if (response.length <= 0)
      return res
        .status(404)
        .json({ message: "Este usuario no puedo ser encotrado" });

    const resCorreo = response[0].correo;
    const resPassword = response[0].password;

    if (password === resPassword && correo === resCorreo) {
      res.json(response);
    } else {
      return res
        .status(404)
        .json({ message: "La contraseña ingresada no coincide" });
    }
  } catch (error) {
    console.log(error);
  }
};
export const deletePostUser = async (req, res) => {
  const id = req.params.id;
  const [response] = await pool.query("DELETE  FROM post WHERE id = ?", [id]);
  res.json(response);
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { avatar, name, post_number, correo, password } = req.body;
  try {
    const [preview] = await pool.query("SELECT * FROM user WHERE id = ?", [id]);
    const namefile = preview[0].avatar;
    if (namefile != undefined) fs.unlink(`public/avatar/${namefile}`);

    console.log(avatar)
    const response = await pool.query(
      `UPDATE user SET  name = IFNULL( ? ,name) , post_number= IFNULL(? , post_number) , correo= IFNULL(? , correo)  , password= IFNULL(? , password)  , avatar =IFNULL(?,avatar) WHERE  id = ? `,
      [name, post_number, correo, password, avatar, id]
    );
    const [respo] = await pool.query("SELECT * FROM user WHERE id = ?", [id]);
    res.json(respo);
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (req, res) => {
  const { title, nameImg, descripcion } = req.body;
  const id = req.params.id;

  try {
/*     const [preview] = await pool.query("SELECT * FROM post WHERE id = ?", [id]);
    const namefile = preview[0].nameImg;
    console.log(preview[0].nameImg); */
/*     if (namefile != undefined) fs.unlink(`public/uploads/${namefile}`); */
    const [response] = await pool.query(
      "UPDATE post SET  title = IFNULL( ? ,title) , nameImg= IFNULL(? , nameImg) , descripcion= IFNULL(? , descripcion)   WHERE  id = ? ",
      [title, nameImg, descripcion, id]
    );
    const [respo] = await pool.query("SELECT * FROM post WHERE id = ?", [id]);
    res.json(respo);
  } catch (error) {
    console.log(error);
  }
};

export const deletePreview = async (req, res) => {
  const namefile = req.params.name;
  await fs.unlink(`public/preview/${namefile}`);
  res.send("hecho");
};
