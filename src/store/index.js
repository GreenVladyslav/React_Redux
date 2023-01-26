import { legacy_createStore as createStore, combineReducers, compose, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

const stringMiddleware = () => (next) => (action) => {
     if (typeof action === 'string') {
          return next({
               type: action
          })
     }
     return next(action)
};

const store = createStore(
                    combineReducers({heroes, filters}),
                    compose(applyMiddleware(ReduxThunk, stringMiddleware),
                         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
                    );

export default store;
































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