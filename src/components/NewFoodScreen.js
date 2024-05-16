import React, {useState} from 'react';
import {Autocomplete, Box, Button, Divider, TextField, Typography} from "@mui/material";

const NewFoodScreen = ({addFood, allfoods}) => {
    const [food, setFood] = useState({
        type: '',
        points: '',
        amount: '',
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
        setFood({type: '', points: '', amount: ''});
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
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'clip',
            }}>
            <Typography variant="subtitle1">מה אכלתי עכשיו</Typography>
            <Autocomplete freeSolo
                          onChange={handleAutoCompleteChange}
                          name="autocomplete"
                          renderInput={((params) =>
                              <TextField
                                  {...params}
                                  onChange={handleInputChange}
                                  name="type"
                                  label="אוכל"
                                  type="text"
                                  placeholder="שם האוכל"
                                  sx={{
                                      border: '1px solid',
                                      borderColor: 'divider',
                                      borderRadius: 2,
                                      overflow: 'clip',
                                      minWidth: '200px',
                                  }}
                              />
                          )}
                          options={uniquePoints.map((food) => food.type)}
                          sx={{
                              margin: '5px',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 2,
                              overflow: 'clip',
                          }}/>

            <TextField
                label="נקודות"
                type="number"
                name="points"
                placeholder="נקודות"
                value={food.points}
                onChange={handleInputChange}
                sx={{
                    margin: '5px',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    overflow: 'clip',
                    minWidth: '200px',
                }}
            />
            <TextField
                label="כמות"
                type="number"
                name="amount"
                placeholder="כמות"
                value={food.amount}
                onChange={handleInputChange}
                sx={{
                    margin: '5px',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    overflow: 'clip',
                    minWidth: '200px',
                }}
            />
            <Typography variant="subtitle2">סה״כ: {food.points * food.amount}</Typography>
            <Button variant="contained" onClick={handleAddFood}>הוספה</Button>
        </Box>
    );
};

export default NewFoodScreen;
