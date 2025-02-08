export const API_URL = "https://elmassyaf.ykdev.online"

export function responsive(width = 0, sm:any = 0, md:any = 0, lg:any = 0) {
    if (width < 390) {
        return sm || md || lg
    } else if (width < 800) {
        return md || lg || sm
    } else {
        return lg || md || sm
    }
}