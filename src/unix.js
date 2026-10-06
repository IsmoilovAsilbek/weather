// dt - unix sekund, offset - shahar vaqt zonasi siljishi (timezone_offset, sekundda)
export function unix(dt, type, offset = 0) {
    const date = new Date((dt + offset) * 1000)
    const base = { timeZone: 'UTC' } // offset allaqachon qo'shilgan

    if (type === 'weekday') {
        const day = date.toLocaleDateString('ru-RU', { ...base, weekday: 'long' })
        return day.charAt(0).toUpperCase() + day.slice(1)
    }

    if (type === 'day') {
        return date.toLocaleDateString('ru-RU', { ...base, day: 'numeric' })
    }

    if (type === 'month') {
        // "6 октября" kabi to'g'ri shakl (родительный падеж) uchun kun bilan birga olinadi
        const parts = new Intl.DateTimeFormat('ru-RU', { ...base, day: 'numeric', month: 'long' }).formatToParts(date)
        return parts.find(p => p.type === 'month')?.value ?? ''
    }

    if (type === 'time') {
        return date.toLocaleTimeString('ru-RU', { ...base, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    }

    return ''
}