import React, {useState} from 'react';
import {Autocomplete, Button, Divider, TextField, Typography} from "@mui/material";

const NewFoodScreen = ({addFood, allfoods}) => {
    const [food, setFood] = useState({
        type: '',
        points: 0,
        amount: 0,
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        if (name !== 'type') {
            setFood({...food, [name]: value});
        } else {
            setFood({
                ...food,
                [name]: value,
                points: allfoods.findLast(food => food.type === value)?.points || 0
            });
        }
    };

    const handleAutoCompleteChange = (e, value) => {
        handleInputChange({target: {name: 'type', value}});
    }

    const handleAddFood = () => {
        // Calculate total points
        const totalPoints = food.points * food.amount;
        // Call the addFood function to save the food item
        addFood({...food, totalPoints});
        // Reset form
        setFood({type: '', points: 0, amount: 0});
    };
    const uniqueTypes = (arr) => {
        let result = {};
        for(let i = 0; i < arr.length; i++) {
            result[arr[i].type] = arr[i].points;
        }
        return Object.keys(result).map(type => ({type: type, points: result[type]}));
    }
    const uniquePoints = uniqueTypes(allfoods);
    return (
        <div>
            <Divider/>
            <Typography variant="h3">New Food Entry</Typography>
            <Autocomplete freeSolo
                          onChange={handleAutoCompleteChange}
                          name="autocomplete"
                          renderInput={((params) =>
                              <TextField {...params} onChange={handleInputChange} name="type" label="Food"/>
                          )}
                          options={uniquePoints.map((food) => food.type)}/>

            <TextField
                label="Points"
                type="number"
                name="points"
                placeholder="Points"
                value={food.points}
                onChange={handleInputChange}
            />
            <br/>
            <TextField
                label="Amount"
                type="number"
                name="amount"
                placeholder="Amount (0.5 to 500)"
                value={food.amount}
                onChange={handleInputChange}
            />
            <br/>
            <Typography variant="h5">Total Points: {food.points * food.amount}</Typography>
            <br/>
            <Button variant="contained" onClick={handleAddFood}>Add Food</Button>
        </div>
    );
};

export default NewFoodScreen;
