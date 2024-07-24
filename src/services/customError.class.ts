//La clase extiende de la clase Error propia de JS
//Se usa para lanzar errores personalizados
export default class CustomError extends Error {
  type: {code: number};
  constructor(type: {code: number}, message: string = "") {
    //genero una instancia del Error de JS con super
    super(message);
    //agrego la propiedad type
    this.type = type;
  }
}
