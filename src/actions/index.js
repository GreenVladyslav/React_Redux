import { createAction } from "@reduxjs/toolkit";
// createAction Принимает два аргумента это (тип действия и вспомогательную функцию)

// !!!В функцию createAction первым аргументом всегда передавайте строки (да тут есть штуки которые сами переводят в строку) но передавйте стркои и все будет ок
// Комплексные createAction мы не трогаем (это там где заросы на сервер) они сами по себе самодостаточные поэтому их не трогаем
// для них тоже есть функционал но мы его не трогаем

/* request - хранится в отдельном хуке  */
export const fetchHeroes = (request) => (dispatch) => {  /* (dispatch) - будем возвращать новую функию которая автоматически будет получать dispatch */
    dispatch(heroesFetching());                             /* ( и дальше будем возвращать вот такой actionCreator ввиде функции) */
    request("http://localhost:3001/heroes")
        .then(data => dispatch(heroesFetched(data))) /* actions передаем в reducer (payload: heroes) */
        .catch(() => dispatch(heroesFetchingError()))
}
// теперь у нас есть комплексный createAction который будет делать все за нас
// ТОЕСТЬ теперь у нас все действия с createAction происходят в файле action (тут) и нам не надо импортировать все по отдельности

export const fetchFilters = (request) => (dispatch) => {
    dispatch(filtersFetching());
    request("http://localhost:3001/filters/")
        .then(data => dispatch(filtersFetched(data)))
        .catch(() => dispatch(filtersFetchingError()));
}

export const heroesFetching = createAction('HEROES_FETCHING');

// export const heroesFetching = () => {
//     return {
//         type: 'HEROES_FETCHING'
//     }
// }

// иногда payload нужно создавать автоматически:
// 1.Старайтесь в reducer не передавать больше одного поля
// 2.Все действия старайтесь выполнять в actionCreator и когда данные уже готовые то просто передаем в reducer только одно значение (которое приходит в качестве payload)
// Смотри документацию как это сделать если нужно самому создать payload
export const heroesFetched = createAction('HEROES_FETCHED'); /* часть с payload приходит автоматически */

// export const heroesFetched = (heroes) => {
//     return {
//         type: 'HEROES_FETCHED',
//         payload: heroes
//     }
// }

export const heroesFetchingError = createAction('HEROES_FETCHING_ERROR');

// export const heroesFetchingError = () => {
//     return {
//         type: 'HEROES_FETCHING_ERROR'
//     }
// }

export const filtersFetching = () => {
    return {
        type: 'FILTERS_FETCHING'
    }
}

export const filtersFetched = (filters) => {
    return {
        type: 'FILTERS_FETCHED',
        payload: filters
    }
}

export const filtersFetchingError = () => {
    return {
        type: 'FILTERS_FETCHING_ERROR'
    }
}

export const activeFilterChanged = (filter) => {
    return  {
        type: 'ACTIVE_FILTER_CHANGED',
        payload: filter
    }
}

// export const activeFilterChanged = (filter) => (dispatch) => {
//     setTimeout(() => {
//         dispatch({
//                 type: 'ACTIVE_FILTER_CHANGED',
//                 payload: filter
//         })
//     }, 1000);
// }

export const heroCreated = createAction('HERO_CREATED');

// export const heroCreated = (hero) => {
//     return {
//         type: 'HERO_CREATED',
//         payload: hero
//     }
// }

export const heroDeleted = createAction('HERO_DELETED'); /* payload приходит автоматически не забывай */

// export const heroDeleted = (id) => {
//     return {
//         type: 'HERO_DELETED',
//         payload: id
//     }
// }


























// /* request - хранится в отдельном хуке  */
// export const fetchHeroes = (request) => (dispatch) => {  /* (dispatch) - будем возвращать новую функию которая автоматически будет получать dispatch */
//     dispatch(heroesFetching());                             /* ( и дальше будем возвращать вот такой actionCreator ввиде функции) */
//     request("http://localhost:3001/heroes")
//         .then(data => dispatch(heroesFetched(data))) /* actions передаем в reducer (payload: heroes) */
//         .catch(() => dispatch(heroesFetchingError()))
// }
// // теперь у нас есть комплексный actionCreator который будет делать все за нас
// // ТОЕСТЬ теперь у нас все действия с actionCreator происходят в файле action (тут) и нам не надо импортировать все по отдельности

// export const fetchFilters = (request) => (dispatch) => {
//     dispatch(filtersFetching());
//     request("http://localhost:3001/filters/")
//         .then(data => dispatch(filtersFetched(data)))
//         .catch(() => dispatch(filtersFetchingError()));
// }

// export const heroesFetching = () => {
//     return {
//         type: 'HEROES_FETCHING'
//     }
// }

// export const heroesFetched = (heroes) => {
//     return {
//         type: 'HEROES_FETCHED',
//         payload: heroes
//     }
// }

// export const heroesFetchingError = () => {
//     return {
//         type: 'HEROES_FETCHING_ERROR'
//     }
// }

// export const filtersFetching = () => {
//     return {
//         type: 'FILTERS_FETCHING'
//     }
// }

// export const filtersFetched = (filters) => {
//     return {
//         type: 'FILTERS_FETCHED',
//         payload: filters
//     }
// }

// export const filtersFetchingError = () => {
//     return {
//         type: 'FILTERS_FETCHING_ERROR'
//     }
// }

// export const activeFilterChanged = (filter) => {
//     return  {
//         type: 'ACTIVE_FILTER_CHANGED',
//         payload: filter
//     }
// }

// // export const activeFilterChanged = (filter) => (dispatch) => {
// //     setTimeout(() => {
// //         dispatch({
// //                 type: 'ACTIVE_FILTER_CHANGED',
// //                 payload: filter
// //         })
// //     }, 1000);
// // }

// export const heroCreated = (hero) => {
//     return {
//         type: 'HERO_CREATED',
//         payload: hero
//     }
// }

// export const heroDeleted = (id) => {
//     return {
//         type: 'HERO_DELETED',
//         payload: id
//     }
// }

