import {createStore, action, persist} from "easy-peasy";

export default createStore(
    persist({
        /* region Exercises */
        exercises: [],
        setExercises: action((state, exercise) => {
            state.currentlyViewedExercise = exercise;
        }),
        /* endregion */

        /* region Progress */
        currentlyViewedExercise: {},
        setCurrentlyViewedExercise: action((state, exercise) => {
            state.currentlyViewedExercise = exercise;
        }),
        /* endregion */

        /* region Navigation */
        lastRoute: 'read',
        setLastRoute: action((state, route) => {
            state.lastRoute = route;
        }),
        /* endregion */

        /* region Daily Progress */
        dailyProgress: 0,
        setDailyProgress: action((state, progress) => {
            state.dailyProgress = progress;
        }),
        /* endregion */
    })
);
