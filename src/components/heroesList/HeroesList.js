import { useHttp } from '../../hooks/http.hook'; /* чтобы делать запрос */
import { useEffect } from 'react'; /* чтобы делать запрос в правильное время */
import { useDispatch, useSelector } from 'react-redux'; /* два хука редакса */
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import { createSelector } from '@reduxjs/toolkit';  /* можно импортировать с reselect */

// import { fetchHeroes } from '../../actions'; /* экшины убираем heroDeleted так как экспортируем теперь из другого файла */
import { heroDeleted, fetchHeroes, filteredHeroesSelector } from './heroesSlice';
// import { heroesFetching, heroesFetched, heroesFetchingError, heroDeleted } from '../../actions'; /* экшины */
import HeroesListItem from "../heroesListItem/HeroesListItem"; /* наш отдельный конкретный герой */
import Spinner from '../spinner/Spinner'; /* спинер */
import { useCallback } from 'react';

import './heroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

    // const filteredHeroesSelector = createSelector( /* При помощи createSelector  у нас будет мимоизирование и не будет переРендеринга */
    //     (state) => state.filters.activeFilter,
    //     // (state) => state.heroes.heroes,
    //     selectAll, /* будет работать так же как команда сверху (и вернет массив с героями которые нам нужны) */
    //     (filter, heroes) => {
    //         console.log(heroes);
    //         if (filter === 'all') {
    //             console.log('render');
    //             return heroes;
    //         } else {
    //             return heroes.filter(item => item.element === filter)
    //         }
    //     }
    // );

    // const filteredHeroes = useSelector(state => {
    //     if (state.filters.activeFilter === 'all') {
    //         return state.heroes.heroes;
    //     } else {
    //         return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter)
    //     }
    // })

    const filteredHeroes = useSelector(filteredHeroesSelector); /* теперь эта функция в heroesSlice (все что работает с store там находится) */
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus); /* вытягиваем глобальный стейт чтобы использовать внутри компонента два штуки*/
    const dispatch = useDispatch(); /* получаем диспетч */
    const {request} = useHttp(); /* функция для запроса */

    useEffect(() => {
        dispatch(fetchHeroes()); /* главная задача Redux-Thunk передавать функцию которая будет делать что-то (это могут быть запросы не сервер, timeout а в них уже вкладываются необходимый функционал*/
    }, []);

    // useEffect(() => {
    //     dispatch(heroesFetching); /* dispatch('HEROES_FETCHING') в action попадает вот такое действие*/
    //     request("http://localhost:3001/heroes")
    //         .then(data => dispatch(heroesFetched(data))) /* actions */
    //         .catch(() => dispatch(heroesFetchingError()))

    //     // eslint-disable-next-line
    // }, []);

    const onDelete = useCallback((id) => {  /* потому что она передается ниже по иерархии дочернем компонентам и она не будет переРендериватся постоянно */
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(data => console.log(data, 'Deleted'))
            .then(dispatch(heroDeleted(id)))
            // .catch(error = console.log(error));
    }, [request])


    if (heroesLoadingStatus === "loading") { /* схоже на конечный автомат только без switch. case */
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <CSSTransition
                timeout={0}
                classNames="hero">
                <h5 className="text-center mt-5">Героев пока нет</h5>
            </CSSTransition>
            
        }

        return arr.map(({id, ...props}) => {
            return <CSSTransition
                key={id}
                timeout={500}
                classNames="hero">
                <HeroesListItem  {...props} onDelete={() => onDelete(id)}/>  
            </CSSTransition>
            /* вот тут useCallback нужен HeroesListItem*/
        })
    }



    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;