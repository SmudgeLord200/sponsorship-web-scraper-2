import React from "react";
import "./App.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Header from "./components/Header";
import json from "./web-scraper/sponsors_readable.json";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";

const App = () => {
  const [searchBar, setSearchBar] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [displayResult, setDisplayResult] = React.useState(true); // Check to false for default

  const [participantOption, setParticipantOption] = React.useState("");
  const [onlineOption, setOnlineOption] = React.useState("");

  //const [json, setData]= React.useState(null);
  const [searchedResult, setSearchedResult] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(json);

  const toggleAdvancedSearch = () => {
    setIsExpanded(!isExpanded);
  };

  const setInput = (e) => {
    setSearchBar(e.target.value);
  };

  const searchSponsors = () => {
    // Implement your API calls here
    /* fetch('/sponsors.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          return response.json();
        })
        .then((jsonData) => {
            console.log(searchedResult);
            setData(jsonData);
        })
        .catch((error) => console.error('Error fetching data:', error)); */
    console.log(json);
  };

  const handlParticipantSelectChange = (event) => {
    setParticipantOption(event.target.value); // Update state with selected value
  };

  const handleOnlineSelectChange = (event) => {
    setOnlineOption(event.target.value); // Update state with selected value
  };

  const displayFilteredData = (i) => {
    return (
      <Box className="cardGroup">
        {filteredData.slice(i, i + 2).map((data) => (
          <Card className="resultCard">
            <CardContent>
              <Typography>{data["name"]}</Typography>
              <CardMedia className="logo" image={data["logo"]} />
              <Typography>
                Average Attendance :{" "}
                <strong>
                  {Math.round(data["participants_num"] / data["hackathon_num"])}
                </strong>
              </Typography>
              <Typography>
                Keywords :{" "}
                <strong>
                  {data["keywords"].slice(0, 2).map((e, index) => (
                    <>
                      {" "}
                      {e}
                      {index !== 1 && ", "}
                    </>
                  ))}
                </strong>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  const filterData = (lowercasedQuery) => {
    const filtered = json.filter((item) =>
      lowercasedQuery.every(
        (item1) =>
          item["name"].toLowerCase().includes(item1) ||
          item["keywords"].some((keyword) =>
            keyword.toLowerCase().includes(item1)
          ) ||
          item["locations"].some((location) =>
            location.toLowerCase().includes(item1)
          ) ||
          item["participants_num"] / item["hackathon_num"] <=
            parseInt(item1) + parseInt(item1) * 0.5
      )
    );
    setFilteredData(filtered);
    console.log(filtered);
  };

  React.useEffect(searchSponsors, []);

  React.useEffect(() => {
    const result = searchedResult + participantOption;
    const lowercasedQuery = result
      .toLowerCase()
      .split(",")
      .map((element) => element.trimStart());
    filterData(lowercasedQuery);
  }, [searchedResult, participantOption]);

  return (
    <Container>
      <Header />
      <main>
        <Stack direction="row" spacing={2} mt={2} className="searchBar">
          <TextField
            type="search"
            id="search"
            name="search"
            label="Search sponsor..."
            value={searchBar}
            onChange={setInput}
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiInputBase-input": {
                color: "white", // Text color
              },
              "& .MuiInputLabel-root": {
                color: "white", // Label color
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // Border color for outlined variant
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSearchedResult(searchBar);
            }}
            disabled={!searchBar}
            sx={{ backgroundColor: "#228B56", padding: 2 }}
          >
            Search
          </Button>
        </Stack>

        <Stack className="advancedSearch text-bold">
          <Button
            component="label"
            variant="text"
            color="white"
            sx={{ fontWeight: "bold" }}
            endIcon={
              isExpanded ? (
                <ArrowUpwardOutlinedIcon />
              ) : (
                <ArrowDownwardOutlinedIcon />
              )
            }
            onClick={toggleAdvancedSearch}
          >
            Advanced Search
          </Button>

          {isExpanded && (
            <Stack direction="column" spacing={2}>
              <FormControl fullWidth>
                <InputLabel
                  id="number"
                  sx={{
                    color: "white",
                  }}
                >
                  Number of attendees
                </InputLabel>
                <Select
                  labelId="number"
                  id="number"
                  label="Number of attendees"
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white", // Border color for outlined variant
                    },
                  }}
                  onChange={handlParticipantSelectChange}
                >
                  <MenuItem value=",">None</MenuItem>
                  <MenuItem value=",25">0 - 50</MenuItem>
                  <MenuItem value=",75">50 - 100</MenuItem>
                  <MenuItem value=",500">100 - 1000</MenuItem>
                  <MenuItem value=",10000">1000+</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel
                  id="format"
                  sx={{
                    color: "white",
                  }}
                >
                  In-person/online
                </InputLabel>
                <Select
                  labelId="format"
                  id="format"
                  label="Format"
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white", // Border color for outlined variant
                    },
                  }}
                  onChange={handleOnlineSelectChange}
                >
                  <MenuItem value="">In-Person</MenuItem>
                  <MenuItem value="online">Online</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </Stack>

        {displayResult && (
          <>
            <Stack direction="column" spacing={2}>
              <Typography variant="h6" className="resultsHeader text-bold">
                Results
              </Typography>
              {filteredData && displayFilteredData(0)}
              {filteredData && displayFilteredData(20)}
              {filteredData && displayFilteredData(40)}
            </Stack>
          </>
        )}
      </main>
    </Container>
  );
};

export default App;
