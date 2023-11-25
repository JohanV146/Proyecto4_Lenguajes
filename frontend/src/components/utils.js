//funcion para crear numeros random en intervalos de numeros.
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}