import React from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";

const MainScreen = ({points, foods}) => {
    const cols = [
        {field: "type", headerName: "מה אכלתי"},
        {field: "totalPoints", headerName: "סה״כ נקודות"}
    ]
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
                margin: '10px'
            }}>
            <Typography variant="subtitle2">סה:כ נקודות היום: {points}</Typography>
            <DataGrid
                columns={cols}
                rows={foods}
                hideFooter={true}
            />
        </Box>
    );
};

export default MainScreen;
