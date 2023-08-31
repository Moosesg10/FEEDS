import { Router, response } from "express";
import { DeleteFile, GetFile, UploadFile } from "../s3.js";
import {
  createPost,
  createUser,
  deletePostUser,
  deletePreview,
  getOnePost,
  getOneUser,
  getPost,
  getPostUser,
  getUser,
  updatePost,
  updateUser,
  uploadsImage,
} from "../controllers/index.controllers.js";
import { pool } from "../db/db.js";

const router = Router();

const upload = router.use(uploadsImage);

//Router POST
router.post(
  "/uploads",
  async (req, res) => {
    await UploadFile(req.file);

    res.send(req.file.filename);
  },
  upload
);

router.post("/create-post", createPost);
router.post("/create-user", createUser);
router.post("/users/:correo", getOneUser);
router.post(
  "/uplodaAvatar",
  async (req, res) => {
    await UploadFile(req.file);

    res.send("enviado");
  },
  upload
);
router.post(
  "/chage-images",
  async (req, res) => {
    await UploadFile(req.file);
    res.send("enviado");
  },
  upload
);
router.post(
  "/preview-upload",
  async (req, res) => {
    res.send(req.file.filename);
  },
  upload
);

//Router PATCH
router.patch("/profile/:id", updateUser);
router.patch("/post-update/:id", updatePost);
//Router GET
router.get("/", (req, res) => {
  res.send("Building the backend for the client");
});
router.get("/post", getPost);
router.get("/post/:title", getOnePost);
router.get("/user", getUser);
router.get("/user/:name", getPostUser);
router.get("/delete-preview/:name", deletePreview);
router.get("/getImages", async (req, res) => {
  const inicio = parseInt(req.query.inicio);
  const limit = 8;
  const [row] = await pool.query(
    `SELECT * FROM post ORDER BY fecha DESC limit ?,?;`,
    [inicio, limit]
  );
  GetFile(row).then(async (result) => {
    try {
      const respueta = {
        data: result,
      };
   
        res.json(respueta);
   
    } catch (error) {
      console.log(error);
    }
  });
});

//Router Delete
router.delete("/post-delete/:id", deletePostUser);
router.delete("/file-delte/:name", DeleteFile);

export default router;
