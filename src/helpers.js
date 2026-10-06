const DIRECTIONS = ['северный', 'северо-восточный', 'восточный', 'юго-восточный', 'южный', 'юго-западный', 'западный', 'северо-западный']

export function windDirection(deg = 0) {
    return DIRECTIONS[Math.round(deg / 45) % 8]
}

// hPa -> mm rt. st.
export function hpaToMmHg(hpa) {
    return Math.round(hpa * 0.75006)
}