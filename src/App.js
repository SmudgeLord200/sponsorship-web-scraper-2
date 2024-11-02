import React from "react";
import "./App.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
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

  const [participantOption, setParticipantOption] = React.useState("");
  const [onlineOption, setOnlineOption] = React.useState("");

  const [searchedResult, setSearchedResult] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(json);

  const [pageNum, setPageNum] = React.useState(0);

  const nextPage = () => {
    // console.log(filteredData.length);
    setPageNum((pageNum + 6) % filteredData.length);
    // console.log(pageNum);
  };
  const prevPage = () => {
    // console.log(filteredData.length);
    setPageNum((pageNum - 6) % filteredData.length);
    // console.log((pageNum - 6) % filteredData.length);
  };

  const toggleAdvancedSearch = () => {
    setIsExpanded(!isExpanded);
  };

  const setSearchBarInput = (e) => {
    setSearchBar(e.target.value);
  };

  const handlParticipantSelectChange = (event) => {
    setParticipantOption(event.target.value); // Update state with selected value
  };

  const handleOnlineSelectChange = (event) => {
    setOnlineOption(event.target.value); // Update state with selected value
  };

  const displayFilteredData = (i) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          width: "50vw",
        }}
      >
        {filteredData.slice(i, i + 2).map((data) => (
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              border: "5px solid #FFFDD0",
              borderRadius: "5px",
              padding: "20px",
              width: "50%",
              textAlign: "center",
              marginBottom: "2%",
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {data["name"]}
              </Typography>
              <Divider sx={{ backgroundColor: "white", marginTop: 2 }} />
              <CardMedia
                image={data["logo"]}
                sx={{
                  height: 150,
                  width: "100%",
                  backgroundSize: "contain",
                  borderRadius: "4px",
                }}
              />
              <Divider sx={{ backgroundColor: "white" }} />
              <Typography mt={2}>
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
    // console.log(filtered);
  };

  React.useEffect(() => {
    const result = searchedResult + participantOption + onlineOption;
    // console.log("result is ", result);
    const lowercasedQuery = result
      .toLowerCase()
      .split(",")
      .map((element) => element.trimStart());
    filterData(lowercasedQuery);
    // console.log("lowercased query is ", lowercasedQuery);
  }, [searchedResult, participantOption, onlineOption]);

  React.useEffect(() => {
    if (!searchBar) {
      setSearchedResult(""); // Reset searched result
      setPageNum(0);
      setParticipantOption("");
      setOnlineOption("");
      setFilteredData(json);
      setIsExpanded(false); // Reset the isExpanded state to false
    }
  }, [searchBar]);

  return (
    <Container>
      <Header />
      <main>
        <Stack direction="row" spacing={2} mt={2} mb={2}>
          <TextField
            type="search"
            id="search"
            name="search"
            label="Search sponsor..."
            value={searchBar}
            onChange={setSearchBarInput}
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
            variant="outlined"
            color="primary"
            onClick={() => {
              setSearchedResult(searchBar);
              setPageNum(0);
            }}
            disabled={!searchBar}
            sx={{
              backgroundColor: "#228B56",
              padding: 2,
              color: "white",
              "&:disabled": { backgroundColor: "grey" },
            }}
          >
            Search
          </Button>
        </Stack>

        <Stack mb={2}>
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
                  <MenuItem value=",">In-Person</MenuItem>
                  <MenuItem value=",online">Online</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </Stack>

        {filteredData.length != 0 ? (
          <>
            <Stack direction="column" spacing={2}>
              <Stack
                direction={{ xs: "column", sm: "row", md: "row", lg: "row" }}
                spacing={2}
                justifyContent={"space-between"}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                >
                  Results
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button onClick={prevPage} variant="outlined">
                    Previous
                  </Button>
                  <Button onClick={nextPage} variant="outlined">
                    Next
                  </Button>
                </Stack>
              </Stack>
              {filteredData && displayFilteredData(pageNum)}
              {filteredData && displayFilteredData(pageNum + 2)}
              {filteredData && displayFilteredData(pageNum + 4)}
            </Stack>
          </>
        ) : (
          <Stack mt={4}>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Result Not Found
            </Typography>
          </Stack>
        )}
      </main>
    </Container>
  );
};

export default App;
