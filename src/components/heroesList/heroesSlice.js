import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook'; /* чтобы делать запрос */

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
}

// Внутри thunkAPI есть много параметров смори документацию ( это если надо что-то вытащить от туда (dispatch, getState, exta, requestID, signal, throw))
// Это все нам редко пригодися поэтому функцию payloadCreator вызываем без аругментов
// вместо --RETURN-- request("http://localhost:3001/heroes") можно написать async await
// createAsyncThunk - Вот эта команда на самом деле возвращает не один actionCreator, а аж три actionCreator -а которые можно использовать для работы с асинхронными операциями pending, fulfilled, rejected
// Теперь эти три команды нужно обрабоать:
// 1.panding - когда наш зарос (или что-то асинхронное) только формируется ( только отправляется)
// 2.fulfilled - когда наш promise или запрос или какая-то другая асинхронная операция выполнилась успешна 
// 3.rejected - какое действие будет выполнено если произошла ошибка

export const fetchHeroes = createAsyncThunk(  /* отвечает за загрузку данных и отслеживанеи их состояния */
    'heroes/fetchHeroes', /* имя среза/тип действия */
    async () => {               /* функция которая должна вернуть асинхронный код (промис)*/
                          /* аргументы: 1.то что мы передаем 2.API самого thunkAPI*/
        const {request} = useHttp(); /* запускает наш собственый хук который работает с сервером и отдает нам функцию по работе с сервером для того чтобы мы могли делать зпаросы*/
        return await request("http://localhost:3001/heroes") /* делаем запрос по нашему адресу */
    }  

);

const heroesSlice = createSlice({ /* создание нашего нового обьекта */
    name: 'heroes',               /* state.heroes */
    initialState,
    reducers: {
        heroCreated: (state, action) => {
                    state.heroes.push(action.payload);
                    },
        heroDeleted: (state, action) => {
                    state.heroes = state.heroes.filter(item => item.id !== action.payload);
                    }
        },
        extraReducers: (builder) => { /* тут у нас обработка запросан а сервер через createAsyncThunk */ /* отвечает за загрузку данных и отслеживанеи их состояния */
            builder
                .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
                .addCase(fetchHeroes.fulfilled, (state, action) => {
                    state.heroesLoadingStatus = 'idle';
                    state.heroes = action.payload;
                })
                .addCase(fetchHeroes.rejected, state => {
                    state.heroesLoadingStatus = 'error';
                })
                .addDefaultCase(() => {})
        }
});

const {actions, reducer} = heroesSlice; /* разделяем наш разрер на нескольк действий  (получаем все действия и reducer)*/

export default reducer;
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;


// createSlice принимает в себя 4 разные аргументы для настройки
// name - пространство имен создаваемых действий
// initialState - начальное состояние reducer-a
// reducers - обьект с обработчиками 
// extraReducers - обьект который содержит reducer-ы другого среза (данный параметр может потребоваться в случае обновления обьекта относящегося к другому срезу) допустим если мы что-то хотели поменять в филтрах
// В итоге когда эта функция закончит работу мы получим обект с тремя полями (имя среза, reducer, actions) тоесть набор каких-то действий
// Важно понять что функция createSlice обьеденят все что можно в данном функционале : она создает reducer, генерирует actionCreator и так же возвращает имя(name) нашего среза(slice) с которым мы будем работать и по этогу нам не нужно будет разделять этот функционал на отдельные файлы и сузности

// Не забывайте изначальный паттерн: Когда у нас вызываются функции dispatch, с какими-то action они попадают в reducer и reducer уже меняет наш store!!!








// Если нам предварительно нужно сделать что-то с данными (например сгенерировать):
// heroesFetch: state => {
//     reducer: (state, action) => {
//         state.push(action.payload)  /* добавляем еще один обьект */
//       },
//       prepare: (text) => {            /* а тут мы генерируем обьект который запушим */
//         const id = nanoid()
//         return { payload: { id, text } } /* например обьект с уникальным индетификатором и текстом  который передан из вне */
//       }
// }

// От куда извне ? Нпример когда вдруг у анс используется функция например heroDeleted у нас dispatch ся- что-то
// .then(dispatch(heroDeleted(id))) здесь мы этот аргумент можем передавать  - он пойдет в action.payload и если вдруг у нас есть 
// функция prepare то у нас это придет вот сюда prepare: (text) =>  для формирования  вручную нашего payload и потом мы запушим его state.push(action.payload)
// Это если вдруг нам понадобится генерировать его врунчую



// extraReducer... то есть мы импортруем actions с друг-го slice и что-то делаем например state меняется у себя и друго-го среза
// extraReducers: (builder) => {
//     builder
//       .addCase(incrementBy, (state, action) => {
//         // action is inferred correctly here if using TS
//       })






















// heroesFetching: state => {state.heroesLoadingStatus = 'loading'},
// а теперь делаем это одной строкой (меняем наш стейт напрямую из-за библиотека immer (имутабельность))



// Раньше

// 1) создаем actions
// export const heroesFetching = () => {
//     return {
//         type: 'HEROES_FETCHING'
//     }
// }

// 2) берем наш reducer если у нас вдруг такая строка совпадает то выполняем такое действие
// const heroes = (state = initialState, action) => {
//     switch (action.type) {
//         case 'HEROES_FETCHING':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'loading'
//             }