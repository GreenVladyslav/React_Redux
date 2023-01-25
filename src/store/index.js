import { legacy_createStore as createStore, combineReducers } from 'redux';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

const enhancer = (createStore) => (...args) => {
     const store = createStore(...args);

     const oldDispath = store.dispatch; /* сохранили оригинальный диспетч который принимал только обьект */
     store.dispatch = (action) => { /* взяли орин диспетч и перезаписали его  */
          if (typeof action === 'string') { /* Мы тутда поместили новую функцию которая что-то свое делает */
               return oldDispath({ /* если action будет строкой то в таком случае мы вызываем оригнальный диспетч и в него передаем обьект и этот обьект формируем руками */
                    type: action
               })
          }

          return oldDispath(action); /* если не строка то мы все так же (это скорее всего будет обьект) помещаем в наш старый dispatch */
     }
     return store;
}
// createStore в нее уже встроена механизм что если мы вторым аргументом будет передавать какуе-то функцию то она будет Уселителем createStore
// enhancer - эта функция будет запущена там и она подменит оригинальный dispatch
const store = createStore(combineReducers({heroes, filters}), enhancer);

export default store;

// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()



// теперь для получения героев например: мы должны прописывать state.heroes.heroes