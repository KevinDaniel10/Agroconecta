import { check, validationResult } from "express-validator";

export const validacionCOntrasena = [
    check("passwordnuevo ")
        .isLength({ min: 5 })
        .withMessage("El campo 'password' debe tener al menos 5 caracteres")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*).*$/)
        .withMessage(
        "El campo 'password' debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
        )
        .customSanitizer((value) => value?.trim()),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
        return next();
        } else {
        return res.status(400).send({ errors: errors.array() });
        }
    },
];