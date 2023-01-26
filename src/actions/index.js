/* request - хранится в отдельном хуке  */
export const fetchHeroes = (request) => (dispatch) => {  /* (dispatch) - будем возвращать новую функию которая автоматически будет получать dispatch */
    dispatch(heroesFetching());                             /* ( и дальше будем возвращать вот такой actionCreator ввиде функции) */
    request("http://localhost:3001/heroes")
        .then(data => dispatch(heroesFetched(data))) /* actions передаем в reducer (payload: heroes) */
        .catch(() => dispatch(heroesFetchingError()))
}
// теперь у нас есть комплексный actionCreator который будет делать все за нас
// ТОЕСТЬ теперь у нас все действия с actionCreator происходят в файле action (тут) и нам не надо импортировать все по отдельности

export const fetchFilters = (request) => (dispatch) => {
    dispatch(filtersFetching());
    request("http://localhost:3001/filters/")
        .then(data => dispatch(filtersFetched(data)))
        .catch(() => dispatch(filtersFetchingError()));
}

export const heroesFetching = () => {
    return {
        type: 'HEROES_FETCHING'
    }
}

export const heroesFetched = (heroes) => {
    return {
        type: 'HEROES_FETCHED',
        payload: heroes
    }
}

export const heroesFetchingError = () => {
    return {
        type: 'HEROES_FETCHING_ERROR'
    }
}

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

export const heroCreated = (hero) => {
    return {
        type: 'HERO_CREATED',
        payload: hero
    }
}

export const heroDeleted = (id) => {
    return {
        type: 'HERO_DELETED',
        payload: id
    }
}

