import React from 'react';
import {Card, CardContent, CardHeader, List, ListItem, ListItemIcon, ListItemText, Typography} from "@mui/material";
import {Fastfood} from "@mui/icons-material";
import {DataGrid} from "@mui/x-data-grid";

const MainScreen = ({points, foods}) => {
    const cols = [
        {field: "type", headerName: "Food"},
        {field: "totalPoints", headerName: "Total Points"}
    ]
    return (
        <div>
            <Typography variant="h3">Food Points Tracker</Typography>
            <Card variant="outlined" >
                <CardHeader title={`Points for today: ${points}` }>
                    <Typography variant="p">Points for today: {points}</Typography>
                </CardHeader>
                <CardContent>
                    <DataGrid
                        columns={cols}
                        rows={foods}
                        pagination={false}
                        hideFooter={true}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default MainScreen;
