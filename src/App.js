import React, {useState, useEffect} from 'react';
import MainScreen from './components/MainScreen';
import NewFoodScreen from './components/NewFoodScreen';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

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
    const [allfoods, setAllfoods] = useState([]);
    const [points, setPoints] = useState(0);

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
                setAllfoods(newData);
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
        setAllfoods([...allfoods, {...food, id: foods.length + 1}]);
        setPoints(points + food.totalPoints);
    };

    return (
        <div>
            <MainScreen points={points} foods={foods}/>
            <NewFoodScreen addFood={addFood} allfoods={allfoods}/>
        </div>
    );
};

export default App;
