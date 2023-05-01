export const checkValidProductFields = (req, res, next) => {
  const { title, description, price, code, stock, status, category } = req.body;
  if (
    !title ||
    !description ||
    !price ||
    !code ||
    stock < 0 ||
    !status ||
    !category
  ) {
    res
      .status(400)
      .json({ status: "error", message: "Todos los campos son obligatorios" });
  } else {
    next();
  }
};

export const isUserAuthenticate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};
