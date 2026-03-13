export type IconProps = {
  /** Nombre del icono de Google Material Symbols */
  name: string;
  /** Si el icono debe estar relleno (fill) */
  fill?: boolean;
  /** Peso de la fuente (100-700) */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** Grado (-25 a 200) */
  grade?: number;
  /** Tamaño óptico (20-48) */
  opticalSize?: number;
  /** Tamaño del icono (ej: '24px', '2rem', 24) */
  size?: number | string;
  /** Clases adicionales (color de Tailwind, etc) */
  className?: string;
  /** Si debe usar la variante redondeada (optical adjustment) */
  rounded?: boolean;
};
