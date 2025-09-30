declare module "react-headroom" {
  import * as React from "react";

  interface HeadroomProps extends React.HTMLAttributes<HTMLElement> {
    // Tiempo en ms que tarda en hacer el "pin" (scroll up) para mostrar la cabecera (default: 200)
    pinStart?: number;
    // Tolerancia de scroll hacia arriba para activar el pin (default: 5)
    upTolerance?: number;
    // Tolerancia de scroll hacia abajo para activar el unpin (default: 0)
    downTolerance?: number;
    // Deshabilitar el comportamiento de hide/show
    disable?: boolean;
    // Usar estilos inline (default: true)
    useInlineStyles?: boolean;
    // Usar position fixed (default: true)
    useFixed?: boolean;
    // Clases CSS adicionales
    className?: string;
    // Callback cuando la cabecera se fija
    onPin?: () => void;
    // Callback cuando la cabecera se oculta
    onUnpin?: () => void;
    // Callback cuando la cabecera se desactiva
    onUnfix?: () => void;
    // Referencia React al elemento
    innerRef?: React.Ref<HTMLElement>;
    // Tipo del elemento contenedor (default: 'header')
    wrapperTag?: keyof JSX.IntrinsicElements;
  }

  const Headroom: React.FC<HeadroomProps>;

  export default Headroom;
}
