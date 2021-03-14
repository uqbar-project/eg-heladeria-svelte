import { toast as svelteToast } from '@zerodevx/svelte-toast'

const ERROR_CONEXION = "Error al conectarse con el servidor"

const error = (error: { mensaje: string }): void => {

    const mensaje = error.mensaje ? error.mensaje : ERROR_CONEXION

    const options = {
        theme: {
            '--toastBackground': '#FF9494',
            '--toastColor': 'black',

        },
        initial: 0,
        progress: 0,
        dismissable: true
    }

    push(mensaje, options)
}

const push = (mensaje: string, options = {}): void => {
    removeLastToast()
    svelteToast.push(mensaje, options)
}

const removeLastToast = (): void => {
    svelteToast.pop()
}

export const toast = { push, error, removeLastToast }