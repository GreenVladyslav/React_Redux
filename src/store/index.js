import { configureStore } from '@reduxjs/toolkit';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';
// Redux_ToolKit
const stringMiddleware = () => (next) => (action) => {
     if (typeof action === 'string') {
          return next({
               type: action
          })
     }
     return next(action)
};

const store = configureStore({
     reducer: {heroes, filters}, /* наши редюсеры */
     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stringMiddleware), /* getDefaultMiddleware - вклчючаем все middleware и так же добавляем наш applyMiddleware типа он*/
     devTools: process.env.NODE_ENV !== 'production', /* зависит от режима разработки (продакшен или build) */

})

export default store;


// Проблемы:
// 1.Очень много повторения кода при создание reducer и actionCreator (хотелось бы разбивать на куски)
// 2.Во вторых хотелось бы намного удобнее создавать store (особенно смущает конструкция по включению Middleware и расширения для браузера)
// 3.Когда у нас с вами будет очень вложенные структруы которые лежат внутри store будет не очень легко(приятно) соблюдать иммутабельность и что-то менять внутри
// например: Если бы каждый обьект героя содержал поля которые были бы тоже обьектами и вот где-то внутри таких полей нам бы приходилось поменять какуе-то характеристику (например у героя какие либо предметы и их количетсво и мы при помощи админ панели меняли бы это (и для соблюдения иммутабельности было бы сложно))

// Функция configureStore - предназначена для того чтобы удобно и автоматически комбинировать reducer, подключать дополнительный функционал под названием Middleware или enhancer и автоматически включать devTools без той страшной строки

// Другие Middleware с документации:
// 1)Serializability Middleware - Для того чтобы проверять, что у нас в store нету данных которые не должны быть там(символы, промисы, функции) список найти ниже в документации можно что может и не может включатся в store
// 2)Immutability Middleware - для обнурежения иммутацый которые могут возникнуть в нашем store 
// 3)Redux-Thunk Middleware - включен в редакс по умолчнаию (мы знаем для чего он)

// preloadedState - является опциональным параметром задающим начальное состояние нашего хранилища 
// enchancer - все просто должны передать массив с этими свойствами   enhancers?: StoreEnhancer[]










// example 2


// import { legacy_createStore as createStore, combineReducers, compose, applyMiddleware } from 'redux';
// import ReduxThunk from 'redux-thunk'
// import heroes from '../reducers/heroes';
// import filters from '../reducers/filters';
// // Redux_Thunk
// const stringMiddleware = () => (next) => (action) => {
//      if (typeof action === 'string') {
//           return next({
//                type: action
//           })
//      }
//      return next(action)
// };

// const store = createStore(
//                     combineReducers({heroes, filters}),
//                     compose(applyMiddleware(ReduxThunk, stringMiddleware),
//                          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
//                     );

// export default store;
















// example 1

// // принимает (store {dispatch() та getState()}) возвращает другую функцию которая подхватывает метод (dispatch) =>  а dispatch возвращает как аругмент (action) который возвращается в dispatch с измененным функционалом
// const stringMiddleware = () => (next) => (action) => {
//      if (typeof action === 'string') {
//           return next({
//                type: action
//           })
//      }
//      return next(action)
// };

// const enhancer = (createStore) => (...args) => { /* принимет createStore и возвращаем другую функцю */
//      const store = createStore(...args);

//      const oldDispath = store.dispatch; /* сохранили оригинальный диспетч который принимал только обьект (положили сюда оригинальный dispatch)*/
//      store.dispatch = (action) => { /*(диспетч который был в оригинали store и меняем его значение) взяли орин диспетч и перезаписали его  */
//           if (typeof action === 'string') { /* Мы тутда поместили новую функцию которая что-то свое делает */
//                return oldDispath({ /* если action будет строкой то в таком случае мы вызываем оригнальный диспетч и в него передаем обьект и этот обьект формируем руками */
//                     type: action
//                })
//           }

//           return oldDispath(action); /* если не строка то мы все так же (это скорее всего будет обьект) помещаем в наш старый dispatch */
//      }
//      return store;
// }
// // createStore в нее уже встроена механизм что если мы вторым аргументом будет передавать какуе-то функцию то она будет Уселителем createStore
// // enhancer - эта функция будет запущена там и она подменит оригинальный dispatch
// const store = createStore(
//                     combineReducers({heroes, filters}),
//                     compose(applyMiddleware(stringMiddleware),
//                          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
//                     );

// export default store;


// // В dispath мы можем передовать обьекты у которых должно быть свойство type и дополнительные поля
// // (а инога случается так что в dispatch Отправляется не обьект, а строка или функция или что-то другое )

// // compose (функция для соеденения) нужно учитываь порядок - усилитель devtool будет на последнем месте
// // enhancer - тут идет работа совсем большим обьектом store, мы его берем, создаем, модифицируем, возвращаем мы можем сделать с ним что угодно но мы работает только с функцие dispatch
// // applyMiddleware - это предлагаемый способ расширения Redux с помощью настраиваемых функций. Mидлвар позволяет вам обернуть метод стора dispatch для пользы и дела.

// // теперь для получения героев например: мы должны прописывать state.heroes.heroes




                    
//                     // compose(
//                     //      enhancer,
//                     //      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//                     // )