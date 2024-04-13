import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function Prayer({ name, time, image }) {
    return (
        <Card sx={{ width: "180px" }} className="prayer">
            <img src={image} alt={name} style={{ width: "100%" }} />
            <CardContent>
                <Typography variant="h4">{name}</Typography>
                <Typography variant="h5">{time}</Typography>
            </CardContent>
        </Card>
    );
}
