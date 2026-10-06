import mist from '@/assets/images/mist.svg'
import clear from '@/assets/images/sun.svg'
import partlyCloudy from '@/assets/images/mainly_cloudy.svg'
import daily_sun from '@/assets/images/daily_sun.svg'
import clouds from '@/assets/images/mainly_cloudy.svg'
import partlySunny from '@/assets/images/small_rain_sun.svg'
import lightRain from '@/assets/images/mini_rain.svg'
import rain from '@/assets/images/rain.svg'
import variableCloudiness from '@/assets/images/mainly_cloudy.svg'
import smok from '@/assets/images/wind.svg'
import mainlyClouds from '@/assets/images/mainlyClouds.svg'
import lightRainSecond from '@/assets/images/small_rain_sun.svg'

// Eski ro'yxat (ingliz tilidagi tavsif bo'yicha) - moslik uchun qoldirildi
export const weatherName = {
    'mist': mist,
    'clear': clear,
    'partly cloudy': partlyCloudy,
    'daily_sun': daily_sun,
    'broken clouds': clouds,
    'overcast clouds': mainlyClouds,
    'partly sunny or mostly cloudy with clear intervals': partlySunny,
    'light intensity shower rain': lightRain,
    'rain': rain,
    'partly cloudy or variable cloudiness': variableCloudiness,
    'smoke': smok,
    'light rain': lightRainSecond
}

// API lang=ru bilan rus tilida tavsif qaytaradi, shuning uchun
// tavsif matni emas, weather[0].id (OpenWeather kodi) bo'yicha tanlanadi
export function getIcon(weather, { daily = false } = {}) {
    const w = weather?.[0]
    const sun = daily ? daily_sun : clear
    if (!w) return sun

    const { id, main } = w

    if (id === 800) return sun
    if (id === 801 || id === 802) return partlyCloudy
    if (id === 803) return clouds
    if (id === 804) return mainlyClouds
    if (id >= 200 && id < 300) return rain          // momaqaldiroq
    if (id >= 300 && id < 400) return lightRain     // mayda yomg'ir
    if (id === 500 || id === 520) return lightRainSecond
    if (id >= 500 && id < 600) return rain
    if (id >= 600 && id < 700) return rain          // qor: alohida snow.svg qo'shsangiz shu yerga ulang
    if (id >= 700 && id < 800) return main === 'Smoke' ? smok : mist

    return sun
}