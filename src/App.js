import React, {useEffect, useState} from 'react';
import MainScreen from './components/MainScreen';
import NewFoodScreen from './components/NewFoodScreen';
import {initializeApp} from "firebase/app";
import {addDoc, collection, getDocs, getFirestore, query, where} from "firebase/firestore";
import {Box, Typography} from "@mui/material";
import {createTheme, ThemeProvider, useTheme} from '@mui/material/styles';
import {prefixer} from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import {heIL} from '@mui/x-data-grid/locales';

import {CacheProvider} from '@emotion/react';

const cacheRtl = createCache({
    key: 'main-app-rtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQx4HvPjccqgWY8tE76nkpNKtKhyiuweo",
    authDomain: "foodtracker-bc618.firebaseapp.com",
    projectId: "foodtracker-bc618",
    storageBucket: "foodtracker-bc618.appspot.com",
    messagingSenderId: "277480052837",
    appId: "1:277480052837:web:377e8d11ca63631d0c4e8c"
};

const firebaseapp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseapp);

const App = () => {
    const [foods, setFoods] = useState([]);
    const [allFoods, setAllFoods] = useState([]);
    const [points, setPoints] = useState(0);

    const existingTheme = useTheme();
    const theme = React.useMemo(
        () =>
            createTheme({}, heIL, existingTheme, {
                direction: 'rtl',
            }),
        [existingTheme],
    );

    useEffect(() => {
        const dbFoods = collection(db, "foodtracking");
        const q =
            query(dbFoods,
                where("date",
                    ">=",
                    new Date(`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`)));
        getDocs(q)
            .then((querySnapshot)=>{
                const newData = querySnapshot.docs
                    .map((doc) => ({...doc.data(), id:doc.id }));
                setFoods(newData);
                const t = newData.reduce((a, b) => a + (b.points * b.amount), 0);
                setPoints(t);
                console.log(`Loaded ${newData.length} items for today`);
            })
            .catch(console.error);
        const q2 = query(dbFoods,
            where("date",
                ">=",
                new Date(`${new Date().getFullYear()}-${new Date().getMonth()-3}-${new Date().getDate()}`)));
        getDocs(q2)
            .then((querySnapshot)=>{
                const newData = querySnapshot.docs
                    .map((doc) => ({...doc.data(), id:doc.id }));
                setAllFoods(newData);
                console.log(`Loaded old ${newData.length} items for autocomplete`);
            })
            .catch(console.error);
    }, []);

    const addFood = async (food) => {
        // Update local storage or any other data storage mechanism
        try {
            const docRef = await addDoc(collection(db, "foodtracking"), {
                date: new Date(),
                ...food,
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        setFoods([...foods, {...food, id: foods.length + 1}]);
        setAllFoods([...allFoods, {...food, id: foods.length + 1}]);
        setPoints(points + food.totalPoints);
    };

    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    textAlign: 'center',
                    bgcolor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    overflow: 'clip',
                    margin: '10px'
                }}>
                <div dir="rtl">
                    <Typography variant="subtitle1">מעקב נקודות יומי</Typography>
                    <MainScreen points={points} foods={foods}/>
                    <NewFoodScreen addFood={addFood} allfoods={allFoods}/>
                </div>
            </Box>
            </ThemeProvider>
        </CacheProvider>
    );
};

export default App;
