import {  createStore } from 'vuex'
import axios from "axios";

const GEO_URL = 'https://api.openweathermap.org/geo/1.0'
const ONECALL_URL = 'https://api.openweathermap.org/data/2.8/onecall'

// Xatoni foydalanuvchiga tushunarli matnga aylantiradi
function describeError(e) {
    if (e.userMessage) return e.userMessage
    if (!e.response) return 'Нет соединения с интернетом'
    if (e.response.status === 401) return 'API-ключ не работает (401)'
    if (e.response.status === 404) return 'Сервис погоды не найден (404)'
    if (e.response.status === 429) return 'Слишком много запросов, попробуйте позже'
    return `Ошибка сервера (${e.response.status})`
}

export default createStore({
    state: {
        city: '',
        weather: null,
        loading: false,
        error: '',
        apiKey: '732d1e6e4b94c0e862de99eed008c9ab'
    },
    mutations: {
        setCity(state, payload) {
            state.city = payload;
        },
        getWeather(state, info) {
            state.weather = info;
            state.city = ''
        },
        setLoading(state, value) {
            state.loading = value
        },
        setError(state, message) {
            state.error = message
        }
    },
    actions: {
        async getWeather(context, { city, lat, lon } = {}) {
            const key = context.state.apiKey
            context.commit('setLoading', true)
            context.commit('setError', '')

            try {
                let name

                if (city && city.trim()) {
                    let response = await axios.get(`${GEO_URL}/direct?q=${city.trim()}&appid=${key}`);

                    if (!response.data.length) {
                        const err = new Error('not found')
                        err.userMessage = `Город «${city.trim()}» не найден`
                        throw err
                    }

                    lat = response.data[0].lat
                    lon = response.data[0].lon
                    name = response.data[0].local_names?.ru || response.data[0].name
                } else {
                    let locationInfo = await axios.get(`${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`);
                    name = locationInfo.data[0]?.local_names?.ru || locationInfo.data[0]?.name || "Noma'lum";
                }

                let response2 = await axios.get(`${ONECALL_URL}?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${key}&units=metric&lang=ru`);
                let weatherInfo = { ...response2.data, name };
                context.commit('getWeather', weatherInfo);
            } catch (error) {
                console.error("Ma'lumotni olishda xatolik: ", error);
                context.commit('setError', describeError(error))
            } finally {
                context.commit('setLoading', false)
            }
        }

    },
    getters: {

    }
})