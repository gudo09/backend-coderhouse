export default class CustomError extends Error {
  constructor(type, message: string = "") {
    //genero una instancia del Error de JS con super
    super(message);

    //agrego la propiedad type
    this.type = type;
  }
}
