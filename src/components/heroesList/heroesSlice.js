import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook'; /* чтобы делать запрос */

const heroesAdapter = createEntityAdapter(); /* при вызове вернет на обьект с готовымие методами, callback-ами, мемозированые селекторы (селекторы это функцие которые позволяют вытащить нам кусочек store) и у него будет опеределнная структура*/

// const initialState = {
//     heroes: [],
//     heroesLoadingStatus: 'idle',
// }

const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle'
});
// console.log(initialState);  /* ids - у нас уникальный Id, у нас все в entires данные (раньше мы получали массив с обьектами)*/

// createEntityAdapter - по своей сути это функция которая возвращает обьект так называемый adapter c готовыми методами, callback-ми, миморезироваными селекторами и определенной структурой. Причем большая часть методов это CRUD - "Создание, чтение, обновление и удаление  (методы которые будут возвращаться из этой функции они и будут манипулировать данными которые заключены в определенные методы)
// Нормализация данных - это приведение всех данных к одному формату, одной структуре и при этом мы так же избавляемся от дублей   - Это частый случай нормализации (использование адаптера это один из способов это сделать)

// setAll - ринимает массив сущностей или объект в определенной форме Record<EntityId, T>и заменяет все существующие сущности значениями из массива.
// setMany - (если нужно не стирать все что было до этого (допустим если нам нужно подгружать новые данные)) принимает массив сущностей или объект в определенной форме Record<EntityId, T>и добавляет или заменяет их
// selectById: учитывая состояние и идентификатор объекта, возвращает объект с этим идентификатором или undefined.
// getSelectors()функцию, которая возвращает набор селекторов, знающих, как читать содержимое объекта состояния сущности: selectIds,selectEntities,selectAll ....  
// !!!чтобы получить массив из адаптера:  export const {selectAll} = heroesAdapter.getSelectors(state => state.heroes);
// Не всегда мы можем использовать эти функции иногда от руки можно написать
// createEntityAdapter не всегда обязателен в проекте! но можно и с ним
// !!ВАЖНО если вдруг нужен другой вид сортировки или Id по другому расположен то можно написать свою функцию!  selectId: (book) => book.bookId,  смотри документацию

// Пример из реальных работ: Если например нам понадобится несколько раз использовать функцию HeroesList.js > filteredHeroesSelector то перенесем ее сюда в heroesSlice и экспортируем куда нужно и вызываем вот так в HeroesList.js > const filteredHeroes = useSelector(filteredHeroesSelector);




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
            // state.heroes.push(action.payload);
            heroesAdapter.addOne(state, action.payload);
        },
        heroDeleted: (state, action) => {
            // state.heroes = state.heroes.filter(item => item.id !== action.payload);
            heroesAdapter.removeOne(state, action.payload); /* смотри документацию как все под капотом происходит (почемун ету фильтра ? потому что вторым аргументом передается уникальный ID) */
        }
    },
    extraReducers: (builder) => { /* тут у нас обработка запросан а сервер через createAsyncThunk */ /* отвечает за загрузку данных и отслеживанеи их состояния */
        builder
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                // state.heroes = action.payload;
                heroesAdapter.setAll(state, action.payload)     /* ринимает массив сущностей или объект в определенной форме Record<EntityId, T>и заменяет все существующие сущности значениями из массива. */
                // heroesAdapter.setAll(то куда мы помещаем, то чем мы заменяем или добавляем)
            })
            .addCase(fetchHeroes.rejected, state => {
                state.heroesLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = heroesSlice; /* разделяем наш разрер на нескольк действий  (получаем все действия и reducer)*/

export default reducer;

const {selectAll} = heroesAdapter.getSelectors(state => state.heroes); /* все селекторы, функцие которые у меня будут они будут сразу обращаться к heroes */
// selectAll вытаскиеваю этот функционал (но здесь можно вытащить и другие нужные нам селекторы)

export const filteredHeroesSelector = createSelector( /* При помощи createSelector  у нас будет мимоизирование и не будет переРендеринга */
    (state) => state.filters.activeFilter,
    // (state) => state.heroes.heroes,
    selectAll, /* будет работать так же как команда сверху (и вернет массив с героями которые нам нужны) */
    (filter, heroes) => {
        // console.log(heroes);
        if (filter === 'all') {
            // console.log('render');
            return heroes;
        } else {
            return heroes.filter(item => item.element === filter)
        }
    }
);
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
































// // example 1 , а выше с функцией createEntityAdapter


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { useHttp } from '../../hooks/http.hook'; /* чтобы делать запрос */

// const initialState = {
//     heroes: [],
//     heroesLoadingStatus: 'idle',
// }

// // Внутри thunkAPI есть много параметров смори документацию ( это если надо что-то вытащить от туда (dispatch, getState, exta, requestID, signal, throw))
// // Это все нам редко пригодися поэтому функцию payloadCreator вызываем без аругментов
// // вместо --RETURN-- request("http://localhost:3001/heroes") можно написать async await
// // createAsyncThunk - Вот эта команда на самом деле возвращает не один actionCreator, а аж три actionCreator -а которые можно использовать для работы с асинхронными операциями pending, fulfilled, rejected
// // Теперь эти три команды нужно обрабоать:
// // 1.panding - когда наш зарос (или что-то асинхронное) только формируется ( только отправляется)
// // 2.fulfilled - когда наш promise или запрос или какая-то другая асинхронная операция выполнилась успешна 
// // 3.rejected - какое действие будет выполнено если произошла ошибка

// export const fetchHeroes = createAsyncThunk(  /* отвечает за загрузку данных и отслеживанеи их состояния */
//     'heroes/fetchHeroes', /* имя среза/тип действия */
//     async () => {               /* функция которая должна вернуть асинхронный код (промис)*/
//                           /* аргументы: 1.то что мы передаем 2.API самого thunkAPI*/
//         const {request} = useHttp(); /* запускает наш собственый хук который работает с сервером и отдает нам функцию по работе с сервером для того чтобы мы могли делать зпаросы*/
//         return await request("http://localhost:3001/heroes") /* делаем запрос по нашему адресу */
//     }  

// );

// const heroesSlice = createSlice({ /* создание нашего нового обьекта */
//     name: 'heroes',               /* state.heroes */
//     initialState,
//     reducers: {
//         heroCreated: (state, action) => {
//                     state.heroes.push(action.payload);
//                     },
//         heroDeleted: (state, action) => {
//                     state.heroes = state.heroes.filter(item => item.id !== action.payload);
//                     }
//         },
//         extraReducers: (builder) => { /* тут у нас обработка запросан а сервер через createAsyncThunk */ /* отвечает за загрузку данных и отслеживанеи их состояния */
//             builder
//                 .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
//                 .addCase(fetchHeroes.fulfilled, (state, action) => {
//                     state.heroesLoadingStatus = 'idle';
//                     state.heroes = action.payload;
//                 })
//                 .addCase(fetchHeroes.rejected, state => {
//                     state.heroesLoadingStatus = 'error';
//                 })
//                 .addDefaultCase(() => {})
//         }
// });

// const {actions, reducer} = heroesSlice; /* разделяем наш разрер на нескольк действий  (получаем все действия и reducer)*/

// export default reducer;
// export const {
//     heroesFetching,
//     heroesFetched,
//     heroesFetchingError,
//     heroCreated,
//     heroDeleted
// } = actions;


// // createSlice принимает в себя 4 разные аргументы для настройки
// // name - пространство имен создаваемых действий
// // initialState - начальное состояние reducer-a
// // reducers - обьект с обработчиками 
// // extraReducers - обьект который содержит reducer-ы другого среза (данный параметр может потребоваться в случае обновления обьекта относящегося к другому срезу) допустим если мы что-то хотели поменять в филтрах
// // В итоге когда эта функция закончит работу мы получим обект с тремя полями (имя среза, reducer, actions) тоесть набор каких-то действий
// // Важно понять что функция createSlice обьеденят все что можно в данном функционале : она создает reducer, генерирует actionCreator и так же возвращает имя(name) нашего среза(slice) с которым мы будем работать и по этогу нам не нужно будет разделять этот функционал на отдельные файлы и сузности

// // Не забывайте изначальный паттерн: Когда у нас вызываются функции dispatch, с какими-то action они попадают в reducer и reducer уже меняет наш store!!!








// // Если нам предварительно нужно сделать что-то с данными (например сгенерировать):
// // heroesFetch: state => {
// //     reducer: (state, action) => {
// //         state.push(action.payload)  /* добавляем еще один обьект */
// //       },
// //       prepare: (text) => {            /* а тут мы генерируем обьект который запушим */
// //         const id = nanoid()
// //         return { payload: { id, text } } /* например обьект с уникальным индетификатором и текстом  который передан из вне */
// //       }
// // }

// // От куда извне ? Нпример когда вдруг у анс используется функция например heroDeleted у нас dispatch ся- что-то
// // .then(dispatch(heroDeleted(id))) здесь мы этот аргумент можем передавать  - он пойдет в action.payload и если вдруг у нас есть 
// // функция prepare то у нас это придет вот сюда prepare: (text) =>  для формирования  вручную нашего payload и потом мы запушим его state.push(action.payload)
// // Это если вдруг нам понадобится генерировать его врунчую



// // extraReducer... то есть мы импортруем actions с друг-го slice и что-то делаем например state меняется у себя и друго-го среза
// // extraReducers: (builder) => {
// //     builder
// //       .addCase(incrementBy, (state, action) => {
// //         // action is inferred correctly here if using TS
// //       })






















// // heroesFetching: state => {state.heroesLoadingStatus = 'loading'},
// // а теперь делаем это одной строкой (меняем наш стейт напрямую из-за библиотека immer (имутабельность))



// // Раньше

// // 1) создаем actions
// // export const heroesFetching = () => {
// //     return {
// //         type: 'HEROES_FETCHING'
// //     }
// // }

// // 2) берем наш reducer если у нас вдруг такая строка совпадает то выполняем такое действие
// // const heroes = (state = initialState, action) => {
// //     switch (action.type) {
// //         case 'HEROES_FETCHING':
// //             return {
// //                 ...state,
// //                 heroesLoadingStatus: 'loading'
// //             }





















