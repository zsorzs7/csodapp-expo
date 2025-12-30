import {createStore, action, persist} from "easy-peasy";

export default createStore(
    persist({
        /* region Exercises */
        exercises: [],
        setExercises: action((state, exercises) => {
            state.exercises = exercises;
        }),
        /* endregion */

        /* region Exercises */
        userProgress: 0,
        setUserProgress: action((state, userProgress) => {
            state.userProgress = userProgress;
        }),
        /* endregion */

        /* region Progress */
        currentlyViewedExercise: {},
        setCurrentlyViewedExercise: action((state, exercise) => {
            state.currentlyViewedExercise = exercise;
        }),
        /* endregion */

        /* region Navigation */
        lastRoute: 'Read',
        setLastRoute: action((state, route) => {
            state.lastRoute = route;
        }),
        /* endregion */

        /* region Daily Progress */
        doneExercisesToday: 0,
        addDoneExercise: action((state) => {
            state.doneExercisesToday += 1;
        }),
        resetDoneExercisesToday: action((state) => {
            state.doneExercisesToday = 0;
        }),
        setDoneExercisesToday: action((state, number) => {
            state.doneExercisesToday = number;
        }),
        /* endregion */

        /* region Timer */
        resetTimer: 0,
        triggerTimerReset: action((state) => {
            state.resetTimer = Date.now(); // Use timestamp to trigger reset
        }),
        /* endregion */

    })
);
