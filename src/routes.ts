import express, { Request, Response } from "express";
import config from "config";
import { omit } from "lodash";
import bycrypt from "bcrypt";
import { UserRepo } from "./repos/user-repo";
import validate from "./middleware/validateResource";
import { CreateUserInput, createUserSchema } from "./schema/user.schema";
import logger from "./utils/logger";
import {
  CreateSessionInput,
  createSessionSchema,
} from "./schema/session.schema";
import requireUser from "./middleware/requireUser";
import { signJwt } from "./utils/jwt.utils";
import {
  CreateProductInput,
  createProductSchema,
  DeleteProductInput,
  deleteProductSchema,
  getProductSchema,
  ReadProductInput,
  UpdateProductInput,
  updateProductSchema,
} from "./schema/product.schema";

const routes = express.Router();

// Health Check
routes.get("/healthcheck", async (req: Request, res: Response) => {
  return res.sendStatus(200);
});

// Create User
routes.post<{}, {}, CreateUserInput["body"]>(
  "/api/users",
  validate(createUserSchema),
  async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const hash = await bycrypt.hash(password, 10);
      const user = await UserRepo.createUser(name, email, hash);
      return res.send(omit(user, "password"));
      // res.status(200).json("Registered Successfully!");
    } catch (e: any) {
      logger.error(e);
      return res.status(400).send(e.errors);
    }
  }
);

// Login and Create Session
routes.post<{}, {}, CreateSessionInput["body"]>(
  "/api/sessions",
  validate(createSessionSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserRepo.findByEmail(email);

      if (user) {
        const isValidPass = await bycrypt.compare(password, user.password);

        if (isValidPass) {
          // create a session
          const session = await UserRepo.createSession(
            user.id,
            req.get("user-agent") || ""
          );

          // create an access token
          const accessToken = signJwt(
            {
              ...session,
            },
            { expiresIn: config.get<string>("accessTokenTtl") } // 1 minutes
          );

          // create a refresh token
          const refreshToken = signJwt(
            {
              ...session,
            },
            { expiresIn: config.get<string>("refreshTokenTtl") } // 1 year
          );

          // return access & refresh token
          return res.send({ accessToken, refreshToken });
        } else {
          return res.json("Wrong pass!");
        }
      } else {
        const message = "User not found!";
        return res.status(404).json(message);
      }
    } catch (e: any) {
      logger.error(e);
      return res.status(400).send(e.errors);
    }
  }
);

// Get Session
routes.get("/api/sessions", requireUser, async (req, res) => {
  const userId = res.locals.user.userId;

  const session = await UserRepo.findSessions({ user: userId, valid: true });
  return res.send(session);
});

// Delete Session
routes.delete("/api/sessions", requireUser, async (req, res) => {
  const sessionId = res.locals.user.id;

  const session = await UserRepo.updateSessions({
    id: sessionId,
    valid: false,
  });

  return res.send({ accessToken: null, refreshToken: null });
});

// Create Product
routes.post(
  "/api/products",
  [requireUser, validate(createProductSchema)],
  async (req: Request<{}, {}, CreateProductInput["body"]>, res: Response) => {
    const userId = res.locals.user.userId;
    const body = req.body;

    const product = await UserRepo.createProduct({ userId: userId, ...body });

    return res.send(product);
  }
);

// Find Product
routes.get<{}, {}, ReadProductInput["body"]>(
  "/api/products",
  validate(getProductSchema),
  async (req, res) => {
    const body = req.body;

    const product = await UserRepo.findProductByTitle(body);

    if (!product) {
      return res.sendStatus(404);
    }

    return res.send(product);
  }
);

// Update Product
routes.put(
  "/api/products/:id",
  [requireUser, validate(updateProductSchema)],
  async (
    req: Request<UpdateProductInput["params"], {}, UpdateProductInput["body"]>,
    res: Response
  ) => {
    const userId = res.locals.user.userId;
    const productId = req.params.id;

    const update = req.body;

    const product = await UserRepo.findProductById({ id: +productId });

    if (!product) {
      return res.sendStatus(404);
    }

    if (product.userId !== userId) {
      return res.sendStatus(403);
    }

    const updateProduct = await UserRepo.updateProduct({
      ...update,
      id: +productId,
    });

    return res.send(updateProduct);
  }
);

// Delete Product
routes.delete(
  "/api/products/:id",
  [requireUser, validate(deleteProductSchema)],
  async (req: Request<DeleteProductInput["params"]>, res: Response) => {
    const userId = res.locals.user.userId;
    const productId = req.params.id;

    const product = await UserRepo.findProductById({ id: +productId });

    if (!product) {
      return res.sendStatus(404);
    }

    if (product.userId !== userId) {
      return res.sendStatus(403);
    }
    const deletProduct = await UserRepo.deleteProduct({ id: +productId });

    return res.sendStatus(200);
  }
);

export default routes;
