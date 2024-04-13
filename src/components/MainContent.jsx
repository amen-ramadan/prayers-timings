import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";
moment.locale("ar");

export default function MainContent() {
    const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
    const [timings, setTimings] = useState({
        Fajr: "04:20",
        Dhuhr: "11:50",
        Asr: "15:18",
        Sunset: "18:03",
        Isha: "19:33",
    });

    const [remainingTime, setRemainingTime] = useState("");
    const [selectedCity, setSelectedCity] = useState({
        displayName: "مكة المكرمة",
        apiName: "Makkah al Mukarramah",
    });
    const [today, setToday] = useState("");
    const availableCities = [
        { displayName: "مكة المكرمة", apiName: "Makkah al Mukarramah" },
        { displayName: "دمشق", apiName: "Damascus" }, // إضافة مدينة دمشق
        { displayName: "السليمانية", apiName: "Sulaymaniyah" }, // إضافة مدينة السليمانية
    ];

    const prayersArray = [
        { key: "Fajr", displayName: "الفجر", image: "https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2" },
        { key: "Dhuhr", displayName: "الظهر", image: "https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921" },
        { key: "Asr", displayName: "العصر", image: "https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf" },
        { key: "Sunset", displayName: "المغرب", image: "https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5" },
        { key: "Isha", displayName: "العشاء", image: "https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d" },
    ];

    const getTimings = async () => {
        console.log("calling the api");
        const response = await axios.get(
            `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`
        );
        setTimings(response.data.data.timings);
    };

    useEffect(() => {
        getTimings();
    }, [selectedCity]);

    useEffect(() => {
        let interval = setInterval(() => {
            setupCountdownTimer();
        }, 1000);

        const t = moment();
        setToday(t.format("MMM Do YYYY | h:mm"));

        return () => {
            clearInterval(interval);
        };
    }, [timings]);

    const setupCountdownTimer = () => {
        const momentNow = moment();

        let prayerIndex = 2;

        if (
            momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
        ) {
            prayerIndex = 1;
        } else if (
            momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
        ) {
            prayerIndex = 2;
        } else if (
            momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
        ) {
            prayerIndex = 3;
        } else if (
            momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
        ) {
            prayerIndex = 4;
        } else {
            prayerIndex = 0;
        }

        setNextPrayerIndex(prayerIndex);

        const nextPrayerObject = prayersArray[prayerIndex];
        const nextPrayerTime = timings[nextPrayerObject.key];
        const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

        let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

        if (remainingTime < 0) {
            const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
            const fajrToMidnightDiff = nextPrayerTimeMoment.diff(moment("00:00:00", "hh:mm:ss"));
            const totalDiffernce = midnightDiff + fajrToMidnightDiff;

            remainingTime = totalDiffernce;
        }
        const durationRemainingTime = moment.duration(remainingTime);

        setRemainingTime(
            `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
        );
    };

    const handleCityChange = (event) => {
        const cityObject = availableCities.find((city) => city.apiName === event.target.value);
        setSelectedCity(cityObject);
    };

    return (
        <>
            <Grid container>
                <Grid>
                    <div>
                        <h2 style={{ margin: "0 8px" }}>{today}</h2>
                        <h1>{selectedCity.displayName}</h1>
                    </div>
                </Grid>

                <Grid>
                    <div>
                        <h2 style={{ margin: "0 8px" }}>متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
                        <h1>{remainingTime}</h1>
                    </div>
                </Grid>
            </Grid>

            <Divider style={{ borderColor: "white", opacity: "0.1" }} />

            <Stack className="prayers" style={{ marginTop: "50px" }}>
                {prayersArray.map((prayer) => (
                    <Prayer key={prayer.key} name={prayer.displayName} time={timings[prayer.key]} image={prayer.image} />
                ))}
            </Stack>

            <Stack direction="row" justifyContent={"center"} style={{ marginTop: "40px", width: "100%" }}>
                <FormControl style={{ width: "40%" }}>
                    <InputLabel id="demo-simple-select-label" sx={{ color: "white"}}>المدينة</InputLabel>
                    <Select
                        style={{ color: "white" }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={handleCityChange}
                    >
                        {availableCities.map((city) => (
                            <MenuItem value={city.apiName} key={city.apiName}>
                                {city.displayName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
        </>
    );
}
