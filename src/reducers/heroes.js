import { createReducer } from "@reduxjs/toolkit"

import {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} from '../actions';

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
}


// Второй вариант спользование команды createReducer он будет рабоать только в nativeJavaScript (c TypeScript он будет работать)  в этом варианте вторым аргументом идет не функция, а обьект (ключами которого будет actionCreator а их свойствами выполняемые действия) 
// нельзя писать в одну строку [heroesFetching]:  state => {state.heroesLoadingStatus = 'loading'; потому что так RETURN стоит в самом начале
const heroes = createReducer(initialState, {
    [heroesFetching]:  state => {state.heroesLoadingStatus = 'loading'}, /* А если мы обернем в фигруные скобки то токгда RETURN не работает в начале */
    [heroesFetched]: (state, action) => {
                    state.heroesLoadingStatus = 'idle';
                    state.heroes = action.payload;
                    },
    [heroesFetchingError]: state => {
                    state.heroesLoadingStatus = 'error';
                    },
    [heroCreated]: (state, action) => {
                    state.heroes.push(action.payload);
                    },
    [heroDeleted]: (state, action) => {
                    state.heroes = state.heroes.filter(item => item.id !== action.payload);
                    }
        },
    [], /* массив функций сравнения (пока что хз он пустой) */
    state => state
)






// .addCase() - аналог case
// createReducer автоматически имеет и активирует библиотеку immer - а она упращает работу с иммутабельностью ( то есть не надо прописывать ...state, и далее как раньше), а сразу можем напрямую обращаться к свойству и менять его в createReducer
// !!!Чтобы createReducer работал то action Должны быть созданы с помощью actionCreator
// const heroes = createReducer(initialState, builder => { /* builder - помогает строить reducer при помощи трех выхваных методов */
//     builder
//         .addCase(heroesFetching, state => {
//             state.heroesLoadingStatus = 'loading'; /* такой код не подходит для иммутабельности но если мы используем Toolkit с createReducer (или createSlice) то так можно так как внутри работает библиотека immer  */
//         }) /* полезно когда есть обьект внутри обьекта и внутри обьекта то все прочто прописум obj.obj.obj */
//         /* нельзя возвращать ничего из этой функции (return) и писать в одну строку */
//         .addCase(heroesFetched, (state, action) => {
//             state.heroesLoadingStatus = 'idle';
//             state.heroes = action.payload;
//         })
//         .addCase(heroesFetchingError, state => {
//             state.heroesLoadingStatus = 'error';
//         })
//         .addCase(heroCreated, (state, action) => {
//             state.heroes.push(action.payload); /* так как мы можем писать из-за immer мутабельной код то мы можем просто запушить в массив  heroes это массив смотри initialState*/
//         })
//         .addCase(heroDeleted, (state, action) => {
//             state.heroes = state.heroes.filter(item => item.id !== action.payload)
//         })
//         .addDefaultCase(() => {}); /* второй метод, функция будет вызыватся и возвращать началый state если он не был найден */
// })






// const heroes = (state = initialState, action) => {
//     switch (action.type) {
//         case 'HEROES_FETCHING':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'loading'
//             }
//         case 'HEROES_FETCHED':
//             return {
//                 ...state,
//                 heroes: action.payload,
//                 heroesLoadingStatus: 'idle'
//             }
//         case 'HEROES_FETCHING_ERROR':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'error'
//             }
//         case 'HERO_CREATED':
//             // let newCreatedHeroList = [...state.heroes, action.payload]
//             return {
//                 ...state,
//                 heroes: [...state.heroes, action.payload]
//             }
//         case 'HERO_DELETED':
//             // const newHeroList = state.heroes.filter(item => item.id !== action.payload)
//             return {
//                 ...state,
//                 heroes: state.heroes.filter(item => item.id !== action.payload)
//             }
//         default: return state
//     }
// }

export default heroes;