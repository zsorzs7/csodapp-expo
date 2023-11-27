import {createStore, action, persist} from "easy-peasy";

export default createStore(
    persist({
        lastRoute: 'read',
        setLastRouteRead: action((state) => {
            state.lastRoute = 'Read';
        }),
        setLastRouteProgress: action((state) => {
            state.lastRoute = 'Progress';
        }),
        doneExercisesToday: 0,
        addDoneExercise: action((state) => {
            state.doneExercisesToday += 1;
        }),
        resetDoneExercisesToday: action((state) => {
            state.doneExercisesToday = 0;
        }),
        setDoneExercisesToday: action((state, number) => {
            state.doneExercisesToday = number;
        })
    })
);