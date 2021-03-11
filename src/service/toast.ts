import { toast as svelteToast } from '@zerodevx/svelte-toast'

const ERROR_CONEXION = "Error al conectarse con el servidor"

const success = (mensaje: string): void => {
    removeLastToast()
    svelteToast.push(mensaje, {
        theme: {
            '--toastBackground': '#48BB78',
            '--toastProgressBackground': '#2F855A',
        },
    })
}

const error = (error: { mensaje: string }): void => {
    removeLastToast()
    const mensaje = error.mensaje ? error.mensaje : ERROR_CONEXION

    svelteToast.push(mensaje, {
        theme: {
            '--toastBackground': '#F56565',
            '--toastProgressBackground': '#C53030'
        },
        initial: 0,
        progress: 0,
        dismissable: false
    })
}

const push = svelteToast.push

const removeLastToast = (): void => {
    svelteToast.pop()
}


export const toast = { push, success, error, removeLastToast }